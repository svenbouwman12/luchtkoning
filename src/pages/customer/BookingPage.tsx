import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '@/lib/supabase';
import { Item, BookingFormData } from '@/types/database.types';
import { differenceInDays } from 'date-fns';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import TimeSlotSelector from '@/components/TimeSlotSelector';

interface SelectedItem {
  item: Item;
  quantity: number;
}

const steps = ['Kies datum', 'Kies tijd', 'Selecteer items', 'Uw gegevens'];

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedItemId = searchParams.get('itemId');

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    selectedItems: [],
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (preselectedItemId && items.length > 0) {
      const item = items.find((i) => i.id === preselectedItemId);
      if (item && !selectedItems.find((si) => si.item.id === item.id)) {
        setSelectedItems([{ item, quantity: 1 }]);
      }
    }
  }, [preselectedItemId, items]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('available', true)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden items');
    }
  };

  const handleDateSelect = (date: Date) => {
    setFormData({ ...formData, startDate: date, endDate: date });
    setActiveStep(1); // Ga naar tijd selectie
  };

  const handleTimeSelect = (startTime: string, endTime: string) => {
    setFormData({ ...formData, startTime, endTime });
  };

  const handleAddItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const existing = selectedItems.find((si) => si.item.id === itemId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((si) =>
          si.item.id === itemId ? { ...si, quantity: si.quantity + 1 } : si
        )
      );
    } else {
      setSelectedItems([...selectedItems, { item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((si) => si.item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedItems(
      selectedItems.map((si) =>
        si.item.id === itemId ? { ...si, quantity } : si
      )
    );
  };

  const calculateTotal = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;

    const days = differenceInDays(formData.endDate, formData.startDate) + 1;
    if (days < 1) return 0;

    return selectedItems.reduce((total, { item, quantity }) => {
      return total + item.price_per_day * quantity * days;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validatie
    if (!formData.startDate || !formData.startTime || !formData.endTime) {
      setError('Selecteer een datum en tijd');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Selecteer minimaal één artikel');
      return;
    }

    try {
      setLoading(true);

      // 1. Maak of vind klant
      let customerId: string;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.customerEmail)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase
          .from('customers')
          .update({
            name: formData.customerName,
            phone: formData.customerPhone,
            address: formData.customerAddress,
          })
          .eq('id', customerId);
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            address: formData.customerAddress,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // 2. Maak boeking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: customerId,
          start_date: formData.startDate!.toISOString().split('T')[0],
          end_date: formData.endDate!.toISOString().split('T')[0],
          start_time: formData.startTime,
          end_time: formData.endTime,
          total_price: calculateTotal(),
          status: 'in behandeling',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 3. Voeg items toe aan boeking
      const bookingItems = selectedItems.map(({ item, quantity }) => ({
        booking_id: booking.id,
        item_id: item.id,
        quantity,
      }));

      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(bookingItems);

      if (itemsError) throw itemsError;

      // Navigeer naar bevestigingspagina
      navigate(`/confirmation?bookingId=${booking.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fout bij aanmaken boeking'
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotal();
  const numberOfDays =
    formData.startDate && formData.endDate
      ? differenceInDays(formData.endDate, formData.startDate) + 1
      : 0;

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0:
        return formData.startDate !== null;
      case 1:
        return formData.startTime && formData.endTime;
      case 2:
        return selectedItems.length > 0;
      default:
        return true;
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Boek uw evenement
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Volg de stappen om uw boeking te voltooien
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Linker kolom: Stappen */}
          <Grid item xs={12} md={8}>
            {/* Stap 1: Datum selectie */}
            {activeStep === 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Selecteer een datum
                </Typography>
                <AvailabilityCalendar
                  selectedDate={formData.startDate}
                  onDateSelect={handleDateSelect}
                />
              </Paper>
            )}

            {/* Stap 2: Tijd selectie */}
            {activeStep === 1 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Selecteer een tijdslot
                </Typography>
                <TimeSlotSelector
                  selectedDate={formData.startDate}
                  selectedStartTime={formData.startTime}
                  selectedEndTime={formData.endTime}
                  onTimeSelect={handleTimeSelect}
                />
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button onClick={() => setActiveStep(0)}>Vorige</Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    disabled={!canProceedToNextStep()}
                  >
                    Volgende
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Stap 3: Items selectie */}
            {activeStep === 2 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Selecteer artikelen
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Voeg artikel toe</InputLabel>
                  <Select
                    value=""
                    label="Voeg artikel toe"
                    onChange={(e) => handleAddItem(e.target.value)}
                  >
                    {items
                      .filter(
                        (item) =>
                          !selectedItems.find((si) => si.item.id === item.id)
                      )
                      .map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} - €{item.price_per_day.toFixed(2)}/dag
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {selectedItems.length === 0 ? (
                  <Alert severity="info">
                    Nog geen artikelen geselecteerd. Voeg artikelen toe aan uw
                    boeking.
                  </Alert>
                ) : (
                  <List>
                    {selectedItems.map(({ item, quantity }) => (
                      <ListItem
                        key={item.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 2 }}
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={`€${item.price_per_day.toFixed(2)} per dag`}
                        />
                        <TextField
                          type="number"
                          label="Aantal"
                          size="small"
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          sx={{ width: 100, mr: 2 }}
                          inputProps={{ min: 1 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button onClick={() => setActiveStep(1)}>Vorige</Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(3)}
                    disabled={!canProceedToNextStep()}
                  >
                    Volgende
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Stap 4: Klantgegevens */}
            {activeStep === 3 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Uw gegevens
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Naam"
                      required
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefoonnummer"
                      required
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      required
                      value={formData.customerAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerAddress: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button onClick={() => setActiveStep(2)}>Vorige</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Bezig...' : 'Boeking Bevestigen'}
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Rechter kolom: Samenvatting */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Samenvatting
                </Typography>
                <Divider sx={{ my: 2 }} />

                {formData.startDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Datum:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formData.startDate.toLocaleDateString('nl-NL')}
                    </Typography>
                  </Box>
                )}

                {formData.startTime && formData.endTime && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tijd:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formData.startTime} - {formData.endTime}
                    </Typography>
                  </Box>
                )}

                {selectedItems.length > 0 && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Artikelen:
                    </Typography>
                    {selectedItems.map(({ item, quantity }) => (
                      <Box key={item.id} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {quantity}x {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          €{(item.price_per_day * quantity).toFixed(2)}/dag
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="h6">Totaal:</Typography>
                      <Typography variant="h6" color="primary">
                        €{totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </>
                )}

                {selectedItems.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nog geen artikelen geselecteerd
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

