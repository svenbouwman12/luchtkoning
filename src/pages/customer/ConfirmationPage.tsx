import { useEffect, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import { supabase } from '@/lib/supabase';
import { BookingWithItems } from '@/types/database.types';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<BookingWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      setError('Geen boeking ID gevonden');
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      // Haal boeking op met klantgegevens
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*, customer:customers(*)')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Haal geboekte items op
      const { data: bookingItems, error: itemsError } = await supabase
        .from('booking_items')
        .select('*, item:items(*)')
        .eq('booking_id', bookingId);

      if (itemsError) throw itemsError;

      setBooking({
        ...bookingData,
        booking_items: bookingItems.map((bi) => ({
          ...bi,
          item: bi.item as any,
        })),
      } as BookingWithItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fout bij laden boeking'
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

  if (error || !booking) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Boeking niet gevonden'}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Terug naar home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Success Header */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          bgcolor: 'success.light',
          color: 'success.contrastText',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Boeking Bevestigd!
        </Typography>
        <Typography variant="body1">
          Bedankt voor uw boeking. We hebben uw aanvraag ontvangen en nemen
          zo snel mogelijk contact met u op.
        </Typography>
      </Paper>

      {/* Booking Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Boekingsgegevens
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Boekingsnummer
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {booking.id.substring(0, 8).toUpperCase()}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={booking.status}
              color={
                booking.status === 'bevestigd'
                  ? 'success'
                  : booking.status === 'geannuleerd'
                  ? 'error'
                  : 'warning'
              }
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Periode
            </Typography>
            <Typography variant="body1">
              {format(parseISO(booking.start_date), 'dd MMMM yyyy', {
                locale: nl,
              })}{' '}
              -{' '}
              {format(parseISO(booking.end_date), 'dd MMMM yyyy', {
                locale: nl,
              })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Klantgegevens
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body1">
            <strong>Naam:</strong> {booking.customer.name}
          </Typography>
          <Typography variant="body1">
            <strong>E-mail:</strong> {booking.customer.email}
          </Typography>
          <Typography variant="body1">
            <strong>Telefoon:</strong> {booking.customer.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Adres:</strong> {booking.customer.address}
          </Typography>
        </CardContent>
      </Card>

      {/* Booked Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Geboekte Artikelen
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            {booking.booking_items.map((bookingItem) => (
              <ListItem
                key={bookingItem.id}
                sx={{ px: 0 }}
                divider
              >
                <ListItemText
                  primary={bookingItem.item.name}
                  secondary={`Aantal: ${bookingItem.quantity} × €${bookingItem.item.price_per_day.toFixed(2)}/dag`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Totaalbedrag:</Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
              €{booking.total_price.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Volgende stappen:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          • U ontvangt een bevestigingsmail op {booking.customer.email}
          <br />
          • We nemen binnen 24 uur contact met u op
          <br />
          • Bezorging en installatie wordt afgestemd
          <br />• Na het evenement halen we alles weer op
        </Typography>
      </Alert>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
        >
          Terug naar Home
        </Button>
        <Button
          component={RouterLink}
          to="/items"
          variant="outlined"
          size="large"
        >
          Bekijk Meer Artikelen
        </Button>
      </Box>
    </Box>
  );
}

