import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';
import type { Evento } from '../types';

interface EventoCardProps {
  evento: Evento;
}

export const EventoCard: React.FC<EventoCardProps> = ({ evento }) => {
  const fechaFormateada = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calcular precio más bajo
  const precios = evento.tiposEntrada?.map((t) => Number(t.precio)) || [];
  const precioDesde = precios.length > 0 ? Math.min(...precios) : null;

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        image={evento.imagenUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
        alt={evento.titulo}
        sx={{
          height: 200,
          objectFit: 'cover',
        }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mb: 1 }}>
          <CalendarMonthIcon sx={{ fontSize: 18 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
            {fechaFormateada}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
          {evento.titulo}
        </Typography>

        {evento.ubicacion && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1.5 }}>
            <PlaceIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {evento.ubicacion}
            </Typography>
          </Box>
        )}

        {evento.descripcion && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flexGrow: 1,
            }}
          >
            {evento.descripcion}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <div>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {precioDesde !== null ? 'Desde' : 'Consultar'}
            </Typography>
            {precioDesde !== null && (
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ${precioDesde.toLocaleString('es-AR')}
              </Typography>
            )}
          </div>

          <Button
            component={Link}
            to={`/eventos/${evento.id}`}
            variant="contained"
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
          >
            Ver Entradas
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
