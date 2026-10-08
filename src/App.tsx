import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { EventosPage } from './pages/EventosPage';
import { EventoDetallePage } from './pages/EventoDetallePage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { PagoSimuladorPage } from './pages/PagoSimuladorPage';
import { PagoResultadoPage } from './pages/PagoResultadoPage';
import { MisEntradasPage } from './pages/MisEntradasPage';
import { ValidadorPage } from './pages/ValidadorPage';
import { useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function ProtectedValidatorRoute() {
  const { authReady, isAuthenticated, isValidador } = useAuth();
  if (!authReady) return null;
  return isAuthenticated && isValidador ? <ValidadorPage /> : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<EventosPage />} />
                <Route path="/eventos/:id" element={<EventoDetallePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Rutas de Pago y Mercado Pago */}
                <Route path="/pago/simulador" element={<PagoSimuladorPage />} />
                <Route path="/pago/exitoso" element={<PagoResultadoPage tipo="exitoso" />} />
                <Route path="/pago/fallido" element={<PagoResultadoPage tipo="fallido" />} />
                <Route path="/pago/pendiente" element={<PagoResultadoPage tipo="pendiente" />} />

                {/* Billetera de Entradas con QR */}
                <Route path="/mis-entradas" element={<MisEntradasPage />} />
                <Route
                  path="/validar-entradas"
                  element={<ProtectedValidatorRoute />}
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
