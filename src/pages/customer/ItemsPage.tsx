import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/database.types';

export default function ItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  // Haal unieke categorieën op
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && item.available) ||
      (availabilityFilter === 'unavailable' && !item.available);
    return matchesCategory && matchesAvailability;
  });

  const handleBookItem = (itemId: string) => {
    // Navigeer naar booking pagina met geselecteerd item
    navigate(`/booking?itemId=${itemId}`);
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
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Ons Assortiment
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bekijk al onze verhuurartikelen en controleer de beschikbaarheid
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Categorie"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Alle categorieën</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Beschikbaarheid"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Alle items</MenuItem>
          <MenuItem value="available">Beschikbaar</MenuItem>
          <MenuItem value="unavailable">Niet beschikbaar</MenuItem>
        </TextField>
      </Box>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Alert severity="info">
          Geen items gevonden met de huidige filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Beschikbaarheid badge */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                  <Chip
                    label={item.available ? 'Beschikbaar' : 'Niet beschikbaar'}
                    color={item.available ? 'success' : 'error'}
                    size="small"
                  />
                </Box>

                <CardMedia
                  component="img"
                  height="200"
                  image={item.image_url || 'https://via.placeholder.com/400x200'}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{ mb: 1 }}
                    variant="outlined"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {item.description}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                    €{item.price_per_day.toFixed(2)}
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}
                      / dag
                    </Typography>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleBookItem(item.id)}
                    disabled={!item.available}
                  >
                    {item.available ? 'Boek nu' : 'Niet beschikbaar'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

