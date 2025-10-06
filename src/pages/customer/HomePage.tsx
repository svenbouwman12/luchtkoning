import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          px: 3,
          borderRadius: 3,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Welkom bij LuchtKoning! 🎈
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
          Verhuur van springkussens, feesttenten en meer voor uw perfecte
          evenement
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={RouterLink}
            to="/items"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
            startIcon={<InventoryIcon />}
          >
            Bekijk Artikelen
          </Button>
          <Button
            component={RouterLink}
            to="/booking"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
            startIcon={<CalendarMonthIcon />}
          >
            Direct Boeken
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 600 }}
        >
          Waarom kiezen voor LuchtKoning?
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: 'success.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Eenvoudig Boeken
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bekijk live beschikbaarheid en boek direct online. Geen
                  gedoe, gewoon snel en simpel.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <LocalShippingIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Bezorgen & Ophalen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wij bezorgen en installeren alles op locatie. Na afloop halen
                  we alles weer op.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <InventoryIcon
                  sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Topkwaliteit Materiaal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Al onze springkussens en tenten zijn schoon, veilig en van
                  hoge kwaliteit.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Popular Items Preview */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Populaire Artikelen
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bekijk ons volledige assortiment met springkussens, feesttenten,
            tafels en meer!
          </Typography>
          <Button
            component={RouterLink}
            to="/items"
            variant="contained"
            size="large"
            startIcon={<InventoryIcon />}
          >
            Bekijk Alle Artikelen
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

