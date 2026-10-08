import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ordenesApi } from '../services/api';

export const PagoSimuladorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ordenId = searchParams.get('orden_id') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcesar = async (accion: 'aprobar' | 'rechazar') => {
    if (!ordenId) {
      setError('No se proporcionó un ID de orden válido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await ordenesApi.simularPago(ordenId, accion);

      if (accion === 'aprobar') {
        navigate(`/pago/exitoso?orden_id=${ordenId}`);
      } else {
        navigate(`/pago/fallido?orden_id=${ordenId}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al procesar la simulación de pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 4, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                bgcolor: '#009ee3', // Color celeste característico de Mercado Pago
                color: 'white',
                p: 2,
                borderRadius: '50%',
                mb: 1.5,
              }}
            >
              <PaymentIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Simulador de Pago — Checkout Pro
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Modo Desarrollo Local (Mercado Pago Simulator)
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Este simulador permite validar el flujo completo de compra sin necesidad de configurar credenciales de producción de Mercado Pago.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              ID DE REFERENCIA DE LA ORDEN:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
              {ordenId || 'No especificado'}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              color="success"
              disabled={loading || !ordenId}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              onClick={() => handleProcesar('aprobar')}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
            >
              Simular Pago Aprobado
            </Button>

            <Button
              variant="outlined"
              size="large"
              color="error"
              disabled={loading || !ordenId}
              startIcon={<CancelIcon />}
              onClick={() => handleProcesar('rechazar')}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
            >
              Simular Pago Rechazado
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};
