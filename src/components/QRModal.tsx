import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { QRCodeSVG } from 'qrcode.react';
import type { Ticket } from '../types';

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const QRModal: React.FC<QRModalProps> = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const evento = ticket.tipoEntrada.evento;
  const esActivo = ticket.estado === 'ACTIVO';

  const fechaFormateada = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1,
            textAlign: 'center',
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCode2Icon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Entrada Digital
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.2 }}>
          {evento.titulo}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize', mb: 2 }}>
          {fechaFormateada} {evento.ubicacion && `• ${evento.ubicacion}`}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={ticket.tipoEntrada.nombre}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, mr: 1 }}
          />
          <Chip
            label={ticket.estado}
            color={esActivo ? 'success' : 'error'}
            icon={esActivo ? <CheckCircleIcon /> : <HighlightOffIcon />}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* QR Code Container con fondo blanco y padding */}
        <Box
          sx={{
            display: 'inline-block',
            p: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #f0f0f0',
            mb: 2,
          }}
        >
          <QRCodeSVG
            value={ticket.tokenQr}
            size={220}
            level="H"
            includeMargin={false}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, px: 2 }}>
          Presentá este código QR en la entrada para que el personal de control lo valide.
        </Typography>

        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 3 }}>
          💡 Tip: Aumentá el brillo de tu pantalla para facilitar el escaneo.
        </Typography>

        <Button fullWidth variant="outlined" onClick={onClose} sx={{ borderRadius: 2, fontWeight: 700 }}>
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
