import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '@/lib/supabase';
import { Settings } from '@/types/database.types';

const weekDays = [
  { value: 1, label: 'Maandag' },
  { value: 2, label: 'Dinsdag' },
  { value: 3, label: 'Woensdag' },
  { value: 4, label: 'Donderdag' },
  { value: 5, label: 'Vrijdag' },
  { value: 6, label: 'Zaterdag' },
  { value: 0, label: 'Zondag' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    vat_percentage: 21.0,
    currency: 'EUR',
    working_days: [1, 2, 3, 4, 5, 6] as number[],
    time_slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] as string[],
    default_booking_duration: 4,
  });

  const [newTimeSlot, setNewTimeSlot] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          company_name: data.company_name || '',
          company_email: data.company_email || '',
          company_phone: data.company_phone || '',
          company_address: data.company_address || '',
          vat_percentage: data.vat_percentage || 21.0,
          currency: data.currency || 'EUR',
          working_days: data.working_days || [1, 2, 3, 4, 5, 6],
          time_slots: data.time_slots || [],
          default_booking_duration: data.default_booking_duration || 4,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fout bij laden instellingen'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingDayToggle = (day: number) => {
    if (formData.working_days.includes(day)) {
      setFormData({
        ...formData,
        working_days: formData.working_days.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        working_days: [...formData.working_days, day].sort(),
      });
    }
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot && !formData.time_slots.includes(newTimeSlot)) {
      setFormData({
        ...formData,
        time_slots: [...formData.time_slots, newTimeSlot].sort(),
      });
      setNewTimeSlot('');
    }
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setFormData({
      ...formData,
      time_slots: formData.time_slots.filter((s) => s !== slot),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);

      if (settings) {
        // Update bestaande instellingen
        const { error } = await supabase
          .from('settings')
          .update(formData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Maak nieuwe instellingen
        const { error } = await supabase.from('settings').insert(formData);

        if (error) throw error;
      }

      setSuccess('Instellingen opgeslagen');
      fetchSettings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fout bij opslaan instellingen'
      );
    } finally {
      setSaving(false);
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
        Instellingen
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Bedrijfsgegevens */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Bedrijfsgegevens
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bedrijfsnaam"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mailadres"
                type="email"
                value={formData.company_email}
                onChange={(e) =>
                  setFormData({ ...formData, company_email: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefoonnummer"
                value={formData.company_phone}
                onChange={(e) =>
                  setFormData({ ...formData, company_phone: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adres"
                multiline
                rows={2}
                value={formData.company_address}
                onChange={(e) =>
                  setFormData({ ...formData, company_address: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="BTW Percentage (%)"
                type="number"
                value={formData.vat_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vat_percentage: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ step: 0.01, min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valuta"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="EUR"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Werkdagen */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Werkdagen
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecteer de dagen waarop klanten kunnen boeken
          </Typography>

          <FormControl component="fieldset">
            <FormGroup row>
              {weekDays.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={formData.working_days.includes(day.value)}
                      onChange={() => handleWorkingDayToggle(day.value)}
                    />
                  }
                  label={day.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Paper>

        {/* Tijdslots */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Beschikbare Tijdslots
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Voeg tijdslots toe waarop klanten kunnen boeken (formaat: HH:MM)
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Nieuw tijdslot"
              placeholder="09:00"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              type="time"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTimeSlot}
            >
              Toevoegen
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.time_slots.length === 0 ? (
              <Alert severity="info">Nog geen tijdslots toegevoegd</Alert>
            ) : (
              formData.time_slots.map((slot) => (
                <Chip
                  key={slot}
                  label={slot}
                  onDelete={() => handleRemoveTimeSlot(slot)}
                  color="primary"
                  variant="outlined"
                />
              ))
            )}
          </Box>
        </Paper>

        {/* Boekingsinstellingen */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Boekingsinstellingen
          </Typography>

          <TextField
            fullWidth
            label="Standaard boekingsduur (uren)"
            type="number"
            value={formData.default_booking_duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                default_booking_duration: parseInt(e.target.value) || 1,
              })
            }
            inputProps={{ min: 1, max: 24 }}
            helperText="Standaard aantal uren per boeking"
          />
        </Paper>

        {/* Save button */}
        <Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Bezig met opslaan...' : 'Instellingen Opslaan'}
          </Button>
        </Box>
      </form>

      {/* Info Box */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom color="info.contrastText">
          ℹ️ Live Beschikbaarheid
        </Typography>
        <Typography variant="body2" color="info.contrastText">
          De kalender op de boekingspagina toont nu live de beschikbaarheid:
        </Typography>
        <Box component="ul" sx={{ mt: 1, color: 'info.contrastText' }}>
          <li>🟢 Groen = Beschikbaar</li>
          <li>🟠 Oranje = In afwachting</li>
          <li>🔴 Rood = Geboekt/Niet beschikbaar</li>
        </Box>
        <Typography variant="body2" color="info.contrastText" sx={{ mt: 1 }}>
          Klanten kunnen alleen boeken op werkdagen en binnen de ingestelde tijdslots.
        </Typography>
      </Paper>
    </Box>
  );
}

