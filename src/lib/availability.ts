// Beschikbaarheid check functies voor boekingen
import { supabase } from './supabase';
import { AvailabilityStatus, DateAvailability, TimeSlotAvailability } from '@/types/database.types';
import { format } from 'date-fns';

/**
 * Haal werkdagen en tijdslots op uit settings
 */
export async function getBookingSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('working_days, time_slots, default_booking_duration, pickup_time, available_after_pickup_hours')
    .single();

  if (error) throw error;

  return {
    workingDays: data.working_days as number[],
    timeSlots: data.time_slots as string[],
    defaultDuration: data.default_booking_duration,
    pickupTime: data.pickup_time as string,
    availableAfterPickupHours: data.available_after_pickup_hours as number,
  };
}

/**
 * Check of een dag een werkdag is
 */
export function isWorkingDay(date: Date, workingDays: number[]): boolean {
  const dayOfWeek = date.getDay(); // 0 = zondag, 1 = maandag, etc.
  return workingDays.includes(dayOfWeek);
}

/**
 * Haal alle boekingen op voor een specifieke datum en item
 */
export async function getBookingsForDateAndItem(date: Date, itemId: string) {
  const dateString = format(date, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('booking_items')
    .select(`
      quantity,
      bookings!inner(
        id,
        start_date,
        end_date,
        start_time,
        end_time,
        status
      )
    `)
    .eq('item_id', itemId);

  if (error) throw error;
  return data || [];
}

/**
 * Bereken hoeveel exemplaren van een item beschikbaar zijn op een tijdslot
 */
export async function getAvailableStock(
  itemId: string,
  date: Date,
  timeSlot: string,
  settings: any
): Promise<number> {
  // Haal item info op
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('stock_quantity')
    .eq('id', itemId)
    .single();

  if (itemError || !item) return 0;

  const totalStock = item.stock_quantity;
  const dateString = format(date, 'yyyy-MM-dd');

  // Haal alle actieve boekingen op voor dit item
  const { data: bookings, error } = await supabase
    .from('booking_items')
    .select(`
      quantity,
      bookings!inner(
        start_date,
        end_date,
        start_time,
        end_time,
        status
      )
    `)
    .eq('item_id', itemId);

  if (error) return 0;

  let bookedQuantity = 0;

  // Bereken hoeveel exemplaren geboekt zijn
  for (const booking of bookings || []) {
    const bookingData = (booking as any).bookings;
    
    // Skip geannuleerde boekingen
    if (bookingData.status === 'geannuleerd') continue;

    const startDate = bookingData.start_date;
    const endDate = bookingData.end_date;

    // Check of deze boeking overlapt met de opgevraagde datum
    if (startDate <= dateString && dateString <= endDate) {
      // Boeking overlapt met deze dag
      bookedQuantity += booking.quantity;
    }
  }

  return Math.max(0, totalStock - bookedQuantity);
}

/**
 * Check beschikbaarheid van een tijdslot
 */
export function checkTimeSlotAvailability(
  timeSlot: string,
  date: Date,
  bookings: any[]
): AvailabilityStatus {
  const dateString = format(date, 'yyyy-MM-dd');

  for (const booking of bookings) {
    // Check if deze datum binnen de boeking valt
    const isSameStart = booking.start_date === dateString;
    const isSameEnd = booking.end_date === dateString;
    const isBetween = booking.start_date < dateString && booking.end_date > dateString;

    if (isSameStart || isSameEnd || isBetween) {
      // Check tijdoverlap
      const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
      const [startHour, startMinute] = booking.start_time.split(':').map(Number);
      const [endHour, endMinute] = booking.end_time.split(':').map(Number);

      const slotMinutes = slotHour * 60 + slotMinute;
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      // Check overlap
      if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
        // Check status van boeking
        if (booking.status === 'bevestigd') {
          return 'booked';
        } else if (booking.status === 'in behandeling') {
          return 'pending';
        }
      }
    }
  }

  return 'available';
}

/**
 * Haal beschikbaarheid voor een datum op
 */
export async function getDateAvailability(
  date: Date,
  itemId?: string
): Promise<DateAvailability> {
  try {
    const settings = await getBookingSettings();
    const isWorking = isWorkingDay(date, settings.workingDays);

    if (!isWorking) {
      return {
        date,
        status: 'booked',
        timeSlots: [],
        isWorkingDay: false,
      };
    }

    // Haal boekingen op voor deze datum (evt. gefilterd op item)
    let query = supabase
      .from('bookings')
      .select('id, start_date, end_date, start_time, end_time, status, booking_items(item_id)');

    const dateString = format(date, 'yyyy-MM-dd');
    query = query.lte('start_date', dateString).gte('end_date', dateString);

    const { data: bookings, error } = await query;

    if (error) throw error;

    // Filter op item indien nodig
    const relevantBookings = itemId
      ? bookings.filter((b: any) =>
          b.booking_items.some((bi: any) => bi.item_id === itemId)
        )
      : bookings;

    // Check beschikbaarheid per tijdslot
    const timeSlots: TimeSlotAvailability[] = settings.timeSlots.map(
      (time: string) => ({
        time,
        status: checkTimeSlotAvailability(time, date, relevantBookings),
      })
    );

    // Bepaal overall status
    const hasBooked = timeSlots.some((ts) => ts.status === 'booked');
    const hasPending = timeSlots.some((ts) => ts.status === 'pending');
    const hasAvailable = timeSlots.some((ts) => ts.status === 'available');

    let overallStatus: AvailabilityStatus = 'available';
    if (hasBooked && !hasAvailable) {
      overallStatus = 'booked';
    } else if (hasPending && !hasAvailable) {
      overallStatus = 'pending';
    } else if (hasBooked || hasPending) {
      overallStatus = 'pending'; // Deels bezet
    }

    return {
      date,
      status: overallStatus,
      timeSlots,
      isWorkingDay: true,
    };
  } catch (error) {
    console.error('Error getting date availability:', error);
    return {
      date,
      status: 'available',
      timeSlots: [],
      isWorkingDay: false,
    };
  }
}

/**
 * Haal kleur voor status
 */
export function getStatusColor(status: AvailabilityStatus): string {
  switch (status) {
    case 'available':
      return '#4caf50'; // Groen
    case 'pending':
      return '#ff9800'; // Oranje
    case 'booked':
      return '#f44336'; // Rood
    default:
      return '#9e9e9e'; // Grijs
  }
}

/**
 * Haal status label
 */
export function getStatusLabel(status: AvailabilityStatus): string {
  switch (status) {
    case 'available':
      return 'Beschikbaar';
    case 'pending':
      return 'In afwachting';
    case 'booked':
      return 'Geboekt';
    default:
      return 'Onbekend';
  }
}

