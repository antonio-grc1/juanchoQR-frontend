import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventosApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Evento, TipoEntrada } from '../types';

export const EventoDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tipoSeleccionadoId, setTipoSeleccionadoId] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventosApi.getById(id);
        setEvento(data);

        // Preseleccionar el primer tipo de entrada con stock disponible
        const primerDisponible = data.tiposEntrada.find((t) => t.stockDisponible > 0);
        if (primerDisponible) {
          setTipoSeleccionadoId(primerDisponible.id);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo encontrar el evento solicitado.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  const tipoEntradaActual: TipoEntrada | undefined = evento?.tiposEntrada.find(
    (t) => t.id === tipoSeleccionadoId
  );

  const maxPermitido = tipoEntradaActual
    ? Math.min(tipoEntradaActual.maxPorCompra, tipoEntradaActual.stockDisponible)
    : 1;

  const handleTipoChange = (event: SelectChangeEvent) => {
    setTipoSeleccionadoId(event.target.value);
    setCantidad(1); // resetear contador al cambiar tipo
  };

  const handleDisminuir = () => {
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const handleAumentar = () => {
    setCantidad((prev) => Math.min(maxPermitido, prev + 1));
  };

  const total = tipoEntradaActual ? Number(tipoEntradaActual.precio) * cantidad : 0;

  const handleIniciarCompra = () => {
    if (!tipoEntradaActual) return;

    if (!isAuthenticated) {
      // Guardar intento de compra y redirigir al login
      navigate(`/login?redirect=/eventos/${id}`);
      return;
    }

    // Al estar autenticado, derivar al checkout (Fase 3)
    alert(`Listo para iniciar compra de ${cantidad}x ${tipoEntradaActual.nombre} por $${total.toLocaleString('es-AR')}.`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="text" width="60%" height={50} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />
      </Container>
    );
  }

  if (error || !evento) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error || 'Evento no encontrado'}
        </Alert>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />}>
          Volver a la cartelera
        </Button>
      </Container>
    );
  }

  const fechaInicio = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Botón Volver */}
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        Volver a eventos
      </Button>

      <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
        <CardMedia
          component="img"
          image={evento.imagenUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'}
          alt={evento.titulo}
          sx={{ height: { xs: 240, md: 360 }, objectFit: 'cover' }}
        />

        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={3}>
            {/* Título y Badge */}
            <div>
              <Chip label={evento.estado} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {evento.titulo}
              </Typography>
            </div>

            {/* Fecha y Lugar */}
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {fechaInicio}
                </Typography>
              </Box>

              {evento.ubicacion && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <PlaceIcon color="primary" />
                  <Typography variant="body1">{evento.ubicacion}</Typography>
                </Box>
              )}
            </Stack>

            {/* Descripción */}
            {evento.descripcion && (
              <Box sx={{ bgcolor: 'grey.50', p: 2.5, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
                  {evento.descripcion}
                </Typography>
              </Box>
            )}

            <Divider />

            {/* SECCIÓN DE COMPRA */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Selecciona tus Entradas
              </Typography>

              {evento.tiposEntrada.length === 0 ? (
                <Alert severity="info">No hay tipos de entrada disponibles para este evento.</Alert>
              ) : (
                <Stack spacing={2.5}>
                  {/* Selector de Categoría */}
                  <FormControl fullWidth>
                    <InputLabel id="tipo-entrada-label">Tipo de entrada</InputLabel>
                    <Select
                      labelId="tipo-entrada-label"
                      value={tipoSeleccionadoId}
                      label="Tipo de entrada"
                      onChange={handleTipoChange}
                    >
                      {evento.tiposEntrada.map((tipo) => {
                        const agotado = tipo.stockDisponible <= 0;
                        return (
                          <MenuItem key={tipo.id} value={tipo.id} disabled={agotado}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                              <span>
                                {tipo.nombre} {agotado && '(AGOTADO)'}
                              </span>
                              <strong style={{ color: '#1976d2' }}>
                                ${Number(tipo.precio).toLocaleString('es-AR')}
                              </strong>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  {/* Contador de Cantidad */}
                  {tipoEntradaActual && tipoEntradaActual.stockDisponible > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Cantidad
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Stock restante: {tipoEntradaActual.stockDisponible} (Máx: {maxPermitido})
                        </Typography>
                      </div>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={handleDisminuir}
                          disabled={cantidad <= 1}
                          sx={{ minWidth: 40, fontWeight: 800 }}
                        >
                          -
                        </Button>
                        <Typography variant="h6" sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>
                          {cantidad}
                        </Typography>
                        <Button
                          variant="text"
                          onClick={handleAumentar}
                          disabled={cantidad >= maxPermitido}
                          sx={{ minWidth: 40, fontWeight: 800 }}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Total y Botón de Pago */}
                  {tipoEntradaActual && tipoEntradaActual.stockDisponible > 0 && (
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: 'primary.50',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'primary.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                          Total a pagar
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                          ${total.toLocaleString('es-AR')}
                        </Typography>
                      </div>

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={handleIniciarCompra}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.2,
                          fontWeight: 700,
                          textTransform: 'none',
                        }}
                      >
                        Pagar
                      </Button>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};
