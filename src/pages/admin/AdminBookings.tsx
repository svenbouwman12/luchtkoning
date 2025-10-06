import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '@/lib/supabase';
import { Booking, Customer, BookingItem, Item } from '@/types/database.types';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface BookingWithDetails extends Booking {
  customer: Customer;
  booking_items: (BookingItem & { item: Item })[];
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Haal boekingen op met klantgegevens
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, customer:customers(*)')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Voor elke boeking, haal de items op
      const bookingsWithItems = await Promise.all(
        (bookingsData || []).map(async (booking) => {
          const { data: items, error: itemsError } = await supabase
            .from('booking_items')
            .select('*, item:items(*)')
            .eq('booking_id', booking.id);

          if (itemsError) throw itemsError;

          return {
            ...booking,
            booking_items: items.map((bi) => ({
              ...bi,
              item: bi.item as any,
            })),
          } as BookingWithDetails;
        })
      );

      setBookings(bookingsWithItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden boekingen');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setSuccess('Status bijgewerkt');
      fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij bijwerken status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Weet u zeker dat u deze boeking wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      setSuccess('Boeking verwijderd');
      fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij verwijderen boeking');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Boekingenbeheer
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Boekingsnr</TableCell>
              <TableCell>Klant</TableCell>
              <TableCell>Periode</TableCell>
              <TableCell>Totaalbedrag</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {booking.id.substring(0, 8).toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {booking.customer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {booking.customer.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(parseISO(booking.start_date), 'dd MMM', { locale: nl })}
                    {' - '}
                    {format(parseISO(booking.end_date), 'dd MMM yyyy', { locale: nl })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    €{booking.total_price.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                    >
                      <MenuItem value="in behandeling">In behandeling</MenuItem>
                      <MenuItem value="bevestigd">Bevestigd</MenuItem>
                      <MenuItem value="geannuleerd">Geannuleerd</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetail(booking)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(booking.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Boekingsdetails</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              {/* Boeking info */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Algemene Informatie
              </Typography>
              <Typography variant="body1">
                <strong>Boekingsnummer:</strong>{' '}
                {selectedBooking.id.substring(0, 8).toUpperCase()}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <Chip
                  label={selectedBooking.status}
                  size="small"
                  color={
                    selectedBooking.status === 'bevestigd'
                      ? 'success'
                      : selectedBooking.status === 'geannuleerd'
                      ? 'error'
                      : 'warning'
                  }
                />
              </Typography>
              <Typography variant="body1">
                <strong>Periode:</strong>{' '}
                {format(parseISO(selectedBooking.start_date), 'dd MMMM yyyy', {
                  locale: nl,
                })}{' '}
                -{' '}
                {format(parseISO(selectedBooking.end_date), 'dd MMMM yyyy', {
                  locale: nl,
                })}
              </Typography>
              <Typography variant="body1">
                <strong>Gemaakt op:</strong>{' '}
                {format(parseISO(selectedBooking.created_at), 'dd MMMM yyyy HH:mm', {
                  locale: nl,
                })}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Klantgegevens */}
              <Typography variant="h6" gutterBottom>
                Klantgegevens
              </Typography>
              <Typography variant="body1">
                <strong>Naam:</strong> {selectedBooking.customer.name}
              </Typography>
              <Typography variant="body1">
                <strong>E-mail:</strong> {selectedBooking.customer.email}
              </Typography>
              <Typography variant="body1">
                <strong>Telefoon:</strong> {selectedBooking.customer.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Adres:</strong> {selectedBooking.customer.address}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Geboekte items */}
              <Typography variant="h6" gutterBottom>
                Geboekte Artikelen
              </Typography>
              <List>
                {selectedBooking.booking_items.map((bookingItem) => (
                  <ListItem key={bookingItem.id} divider>
                    <ListItemText
                      primary={bookingItem.item.name}
                      secondary={`Aantal: ${bookingItem.quantity} × €${bookingItem.item.price_per_day.toFixed(2)}/dag`}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Totaal */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'primary.light',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="primary.contrastText">
                  Totaalbedrag
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600 }}
                  color="primary.contrastText"
                >
                  €{selectedBooking.total_price.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Sluiten</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

