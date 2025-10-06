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

