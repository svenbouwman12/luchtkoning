import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '@/lib/supabase';
import { Item, ItemFormData } from '@/types/database.types';

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_day: 0,
    category: '',
    available: true,
    image_url: '',
    stock_quantity: 1,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price_per_day: item.price_per_day,
        category: item.category,
        available: item.available,
        image_url: item.image_url || '',
        stock_quantity: item.stock_quantity || 1,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price_per_day: 0,
        category: '',
        available: true,
        image_url: '',
        stock_quantity: 1,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      if (editingItem) {
        // Update bestaand item
        const { error } = await supabase
          .from('items')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        setSuccess('Item bijgewerkt');
      } else {
        // Nieuw item toevoegen
        const { error } = await supabase.from('items').insert(formData);

        if (error) throw error;
        setSuccess('Item toegevoegd');
      }

      handleCloseDialog();
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij opslaan item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet u zeker dat u dit item wilt verwijderen?')) return;

    try {
      const { error } = await supabase.from('items').delete().eq('id', id);

      if (error) throw error;
      setSuccess('Item verwijderd');
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij verwijderen item');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Artikelenbeheer
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nieuw Artikel
        </Button>
      </Box>

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
              <TableCell>Afbeelding</TableCell>
              <TableCell>Naam</TableCell>
              <TableCell>Categorie</TableCell>
              <TableCell>Prijs/dag</TableCell>
              <TableCell>Voorraad</TableCell>
              <TableCell>Beschikbaar</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Avatar
                    src={item.image_url || undefined}
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" />
                </TableCell>
                <TableCell>€{item.price_per_day.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={`${item.stock_quantity || 1}x`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.available ? 'Ja' : 'Nee'}
                    color={item.available ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(item)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Artikel Bewerken' : 'Nieuw Artikel'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Naam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Beschrijving"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Prijs per dag (€)"
              type="number"
              value={formData.price_per_day}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_per_day: parseFloat(e.target.value) || 0,
                })
              }
              required
            />
            <TextField
              fullWidth
              label="Categorie"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              placeholder="bijv. Springkussens, Feesttenten, Meubilair"
            />
            <TextField
              fullWidth
              label="Afbeelding URL"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://..."
            />
            <TextField
              fullWidth
              label="Voorraad (aantal exemplaren)"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_quantity: parseInt(e.target.value) || 1,
                })
              }
              required
              inputProps={{ min: 1 }}
              helperText="Aantal exemplaren van dit artikel dat beschikbaar is voor verhuur"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                />
              }
              label="Beschikbaar voor verhuur"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuleren</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Bijwerken' : 'Toevoegen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

