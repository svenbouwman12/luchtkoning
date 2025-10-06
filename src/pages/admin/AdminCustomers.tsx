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
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { supabase } from '@/lib/supabase';
import { Customer, Booking } from '@/types/database.types';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden klanten');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setNotes(customer.notes || '');
    
    // Haal boekingen van klant op
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerBookings(data || []);
    } catch (err) {
      console.error('Fout bij laden boekingen:', err);
    }
    
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedCustomer(null);
    setCustomerBookings([]);
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update({ notes })
        .eq('id', selectedCustomer.id);

      if (error) throw error;
      
      // Update local state
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? { ...c, notes } : c
        )
      );
      
      handleCloseDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij opslaan notities');
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
        Klantenbeheer
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Naam</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Telefoon</TableCell>
              <TableCell>Totaal Uitgegeven</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {customer.name}
                  </Typography>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={`€${customer.total_spent.toFixed(2)}`}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetail(customer)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Customer Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Klantdetails</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              {/* Contactgegevens */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contactgegevens
              </Typography>
              <Typography variant="body1">
                <strong>Naam:</strong> {selectedCustomer.name}
              </Typography>
              <Typography variant="body1">
                <strong>E-mail:</strong> {selectedCustomer.email}
              </Typography>
              <Typography variant="body1">
                <strong>Telefoon:</strong> {selectedCustomer.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Adres:</strong> {selectedCustomer.address}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Boekingsgeschiedenis */}
              <Typography variant="h6" gutterBottom>
                Boekingsgeschiedenis ({customerBookings.length})
              </Typography>
              {customerBookings.length === 0 ? (
                <Alert severity="info">Nog geen boekingen</Alert>
              ) : (
                <List>
                  {customerBookings.map((booking) => (
                    <ListItem key={booking.id} divider>
                      <ListItemText
                        primary={`${format(parseISO(booking.start_date), 'dd MMM yyyy', { locale: nl })} - ${format(parseISO(booking.end_date), 'dd MMM yyyy', { locale: nl })}`}
                        secondary={
                          <Box component="span">
                            Status: {booking.status} • Totaal: €{booking.total_price.toFixed(2)}
                          </Box>
                        }
                      />
                      <Chip
                        label={booking.status}
                        size="small"
                        color={
                          booking.status === 'bevestigd'
                            ? 'success'
                            : booking.status === 'geannuleerd'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Totaal uitgegeven */}
              <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" color="primary.contrastText">
                  Totaal Uitgegeven
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }} color="primary.contrastText">
                  €{selectedCustomer.total_spent.toFixed(2)}
                </Typography>
              </Box>

              {/* Notities */}
              <Typography variant="h6" gutterBottom>
                Interne Notities
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Voeg interne notities toe over deze klant..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Sluiten</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Notities Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

