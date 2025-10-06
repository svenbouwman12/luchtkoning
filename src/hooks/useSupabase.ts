// Custom React hooks voor Supabase operaties
// Deze hooks kunnen worden uitgebreid voor meer functionaliteit

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Item, Customer, Booking } from '@/types/database.types';

/**
 * Hook om items op te halen met automatische updates
 */
export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();

    // TODO: Optioneel - Realtime subscriptie toevoegen
    // const subscription = supabase
    //   .channel('items_channel')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, fetchItems)
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden items');
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, refetch: fetchItems };
}

/**
 * Hook om boekingen op te halen
 */
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden boekingen');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch: fetchBookings };
}

/**
 * Hook om klanten op te halen
 */
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden klanten');
    } finally {
      setLoading(false);
    }
  };

  return { customers, loading, error, refetch: fetchCustomers };
}

