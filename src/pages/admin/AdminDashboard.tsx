import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EuroIcon from '@mui/icons-material/Euro';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/database.types';
import { startOfMonth, startOfToday, format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const today = format(startOfToday(), 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

      // Totaal aantal boekingen
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Boekingen vandaag
      const { count: bookingsToday } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('created_at::date', today);

      // Boekingen deze maand
      const { count: bookingsThisMonth } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart);

      // Omzet deze maand (alleen bevestigde boekingen)
      const { data: monthRevenue } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'bevestigd')
        .gte('created_at', monthStart);

      const revenueThisMonth = monthRevenue?.reduce(
        (sum, booking) => sum + Number(booking.total_price),
        0
      ) || 0;

      // Unieke klanten
      const { count: uniqueCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Populairste item
      const { data: itemCounts } = await supabase
        .from('booking_items')
        .select('item_id, items(name)');

      let mostPopularItem = null;
      if (itemCounts && itemCounts.length > 0) {
        const itemCountMap = itemCounts.reduce((acc: any, item: any) => {
          const itemId = item.item_id;
          acc[itemId] = (acc[itemId] || 0) + 1;
          return acc;
        }, {});

        const mostPopularId = Object.keys(itemCountMap).reduce((a, b) =>
          itemCountMap[a] > itemCountMap[b] ? a : b
        );

        const popularItem = itemCounts.find(
          (item) => item.item_id === mostPopularId
        );
        if (popularItem && popularItem.items) {
          mostPopularItem = {
            name: (popularItem.items as any).name,
            count: itemCountMap[mostPopularId],
          };
        }
      }

      setStats({
        totalBookingsToday: bookingsToday || 0,
        totalBookingsThisMonth: bookingsThisMonth || 0,
        totalBookings: totalBookings || 0,
        revenueThisMonth,
        mostPopularItem,
        uniqueCustomers: uniqueCustomers || 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fout bij laden statistieken'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard Overzicht
      </Typography>

      <Grid container spacing={3}>
        {/* Boekingen vandaag */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonthIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Boekingen Vandaag
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.totalBookingsToday || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Boekingen deze maand */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Boekingen Deze Maand
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.totalBookingsThisMonth || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Omzet deze maand */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EuroIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Omzet Deze Maand
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    €{stats?.revenueThisMonth.toFixed(0) || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Unieke klanten */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Totaal Klanten
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.uniqueCustomers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Totaal boekingen */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Totaal Boekingen
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {stats?.totalBookings || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alle tijd
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Populairste item */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Populairste Artikel
              </Typography>
              {stats?.mostPopularItem ? (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats.mostPopularItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.mostPopularItem.count} keer geboekt
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nog geen data beschikbaar
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Welcome message */}
      <Card sx={{ mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Welkom bij het Admin Dashboard! 🎈
          </Typography>
          <Typography variant="body2">
            Hier kunt u alle aspecten van uw verhuurbedrijf beheren. Gebruik het
            menu aan de linkerkant om te navigeren tussen artikelen, klanten,
            boekingen en instellingen.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

