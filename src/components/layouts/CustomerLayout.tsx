import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';

export default function CustomerLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            🎈 LuchtKoning
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/items"
            startIcon={<InventoryIcon />}
          >
            Artikelen
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/booking"
            startIcon={<CalendarMonthIcon />}
          >
            Boeken
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} LuchtKoning - Springkussen & Feesttent
            Verhuur
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Telefoon: +31 6 12345678 | Email: info@luchtkoning.nl
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

