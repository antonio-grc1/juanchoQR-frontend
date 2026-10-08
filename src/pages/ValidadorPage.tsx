import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { ticketsApi } from '../services/api';

type ScanResult = {
  severity: 'success' | 'error' | 'warning';
  message: string;
};

const playFeedbackTone = (frequency: number) => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
  void oscillator.addEventListener('ended', () => audioContext.close());
};

export const ValidadorPage: React.FC = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanInProgressRef = useRef(false);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [validatedCount, setValidatedCount] = useState(0);

  const validateToken = async (token: string) => {
    if (scanInProgressRef.current) return;
    const normalizedToken = token.trim();
    if (!normalizedToken) return;

    scanInProgressRef.current = true;
    setLoading(true);
    setResult(null);
    try {
      const response = await ticketsApi.validate(normalizedToken);
      setValidatedCount((count) => count + 1);
      setResult({ severity: 'success', message: response.message });
      playFeedbackTone(880);
    } catch (error: unknown) {
      const responseData = axios.isAxiosError(error) ? error.response?.data : undefined;
      const reason = responseData?.reason;
      const severity = reason === 'YA_UTILIZADO' ? 'warning' : 'error';
      setResult({
        severity,
        message: responseData?.message || 'No se pudo validar el código QR.',
      });
      playFeedbackTone(220);
    } finally {
      setManualToken('');
      setLoading(false);
      window.setTimeout(() => {
        scanInProgressRef.current = false;
      }, 1200);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5Qrcode | null = null;
    const initializationId = window.setTimeout(() => {
      if (cancelled) return;

      scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      void scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => void validateToken(decodedText),
          () => undefined
        )
        .catch(() => {
          if (!cancelled) {
            setCameraError('No se pudo acceder a la cámara. Podés ingresar el código manualmente.');
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(initializationId);

      if (scanner?.isScanning) {
        void scanner.stop()
          .then(() => scanner?.clear())
          .catch(() => undefined);
      } else {
        scanner?.clear();
      }
      if (scannerRef.current === scanner) scannerRef.current = null;
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Validar entradas
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Escaneá el código QR del asistente para registrar su ingreso.
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ingresos validados: {validatedCount}
      </Typography>

      <Card>
        <CardContent>
          <Box id="qr-reader" sx={{ width: '100%', mb: 2 }} />
          {cameraError && <Alert severity="warning" sx={{ mb: 2 }}>{cameraError}</Alert>}

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void validateToken(manualToken);
            }}
            sx={{ display: 'flex', gap: 1 }}
          >
            <TextField
              fullWidth
              label="Código QR"
              value={manualToken}
              onChange={(event) => setManualToken(event.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="contained" disabled={loading || !manualToken.trim()}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Validar'}
            </Button>
          </Box>

          {result && (
            <Alert severity={result.severity} sx={{ mt: 3, fontWeight: 600 }}>
              {result.message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
