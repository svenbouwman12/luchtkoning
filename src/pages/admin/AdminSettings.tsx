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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { supabase } from '@/lib/supabase';
import { Settings } from '@/types/database.types';

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
  });

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

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
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

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Bezig met opslaan...' : 'Instellingen Opslaan'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Info Box */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom color="info.contrastText">
          ℹ️ Toekomstige Functies
        </Typography>
        <Typography variant="body2" color="info.contrastText">
          De volgende functies kunnen in de toekomst worden toegevoegd:
        </Typography>
        <Box component="ul" sx={{ mt: 1, color: 'info.contrastText' }}>
          <li>💳 Stripe betalingsintegratie</li>
          <li>🔔 E-mail notificaties bij nieuwe boekingen</li>
          <li>🗺️ Meerdere verhuurlocaties</li>
          <li>🧾 Automatische factuurgeneratie (PDF)</li>
          <li>🌍 Meertaligheid (Nederlands/Engels)</li>
          <li>🔒 Gebruikersrollen en rechtenbeheer</li>
          <li>📱 Push notificaties</li>
        </Box>
      </Paper>
    </Box>
  );
}

