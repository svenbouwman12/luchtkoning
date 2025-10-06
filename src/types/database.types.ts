// Database types voor TypeScript
// Deze types komen overeen met de Supabase database schema

export interface Item {
  id: string;
  name: string;
  description: string | null;
  price_per_day: number;
  category: string;
  available: boolean;
  image_url: string | null;
  stock_quantity: number; // Aantal beschikbare exemplaren
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  total_spent: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'in behandeling' | 'bevestigd' | 'geannuleerd';
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
}

export interface Settings {
  id: string;
  company_name: string;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  vat_percentage: number;
  currency: string;
  working_days: number[]; // 0=zondag, 1=maandag, etc.
  time_slots: string[]; // ["09:00", "10:00", etc.]
  default_booking_duration: number; // in uren
  pickup_time: string; // Tijd wanneer items opgehaald worden (bijv. "12:00")
  available_after_pickup_hours: number; // Uren na ophalen voordat item weer beschikbaar is
  updated_at: string;
}

// Extended types met relaties
export interface BookingWithCustomer extends Booking {
  customer: Customer;
}

export interface BookingWithItems extends Booking {
  customer: Customer;
  booking_items: (BookingItem & { item: Item })[];
}

export interface CustomerWithBookings extends Customer {
  bookings: Booking[];
}

// Form types
export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  selectedItems: Array<{
    itemId: string;
    quantity: number;
  }>;
}

export interface ItemFormData {
  name: string;
  description: string;
  price_per_day: number;
  category: string;
  available: boolean;
  image_url: string;
  stock_quantity: number;
}

// Statistieken voor dashboard
export interface DashboardStats {
  totalBookingsToday: number;
  totalBookingsThisMonth: number;
  totalBookings: number;
  revenueThisMonth: number;
  mostPopularItem: {
    name: string;
    count: number;
  } | null;
  uniqueCustomers: number;
}

// Beschikbaarheid status types
export type AvailabilityStatus = 'available' | 'pending' | 'booked';

export interface TimeSlotAvailability {
  time: string;
  status: AvailabilityStatus;
  bookingId?: string;
}

export interface DateAvailability {
  date: Date;
  status: AvailabilityStatus;
  timeSlots: TimeSlotAvailability[];
  isWorkingDay: boolean;
}

