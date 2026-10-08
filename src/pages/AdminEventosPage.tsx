import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, IconButton, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { eventosApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { EstadoEvento, Evento, EventoPayload, TipoEntradaPayload } from '../types';

const emptyTipo: TipoEntradaPayload = { nombre: '', precio: 0, stockTotal: 1, maxPorCompra: 10 };
const emptyForm: EventoPayload = {
  titulo: '', descripcion: '', imagenUrl: '', fechaInicio: '', fechaFin: '', ubicacion: '',
  estado: 'BORRADOR', tiposEntrada: [{ ...emptyTipo }],
};

const toInputDate = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : '';

export const AdminEventosPage: React.FC = () => {
  const { authReady, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState<EventoPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    try { setEventos(await eventosApi.getAdminAll()); }
    catch { setError('No se pudieron cargar los eventos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!isAdmin) { navigate('/admin/login', { replace: true }); return; }
    void load();
  }, [authReady, isAdmin, navigate]);

  const updateField = (field: keyof EventoPayload, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const updateTipo = (index: number, field: keyof TipoEntradaPayload, value: string) => {
    setForm((current) => ({
      ...current,
      tiposEntrada: current.tiposEntrada.map((tipo, currentIndex) =>
        currentIndex === index
          ? { ...tipo, [field]: field === 'nombre' ? value : Number(value) }
          : tipo
      ),
    }));
  };

  const edit = (evento: Evento) => {
    setEditingId(evento.id);
    setForm({
      titulo: evento.titulo, descripcion: evento.descripcion || '', imagenUrl: evento.imagenUrl || '',
      fechaInicio: toInputDate(evento.fechaInicio), fechaFin: toInputDate(evento.fechaFin),
      ubicacion: evento.ubicacion || '', estado: evento.estado,
      tiposEntrada: evento.tiposEntrada.map(({ id, nombre, precio, stockTotal, maxPorCompra }) =>
        ({ id, nombre, precio: Number(precio), stockTotal, maxPorCompra })),
    });
    setMessage(null); setError(null);
  };

  const reset = () => { setEditingId(null); setForm({ ...emptyForm, tiposEntrada: [{ ...emptyTipo }] }); };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(null);
    try {
      if (editingId) await eventosApi.update(editingId, form);
      else await eventosApi.create(form);
      setMessage(editingId ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.');
      reset(); await load();
    } catch (saveError: any) {
      setError(saveError.response?.data?.errors?.[0]?.message || saveError.response?.data?.error || 'No se pudo guardar el evento.');
    } finally { setSaving(false); }
  };

  const cancel = async (evento: Evento) => {
    if (!window.confirm(`¿Cancelar "${evento.titulo}"?`)) return;
    try { await eventosApi.cancel(evento.id); setMessage('Evento cancelado correctamente.'); await load(); }
    catch { setError('No se pudo cancelar el evento.'); }
  };

  if (!authReady || loading) return <Container sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Gestión de eventos</Typography>
      {message && <Alert severity="success" onClose={() => setMessage(null)} sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ mb: 4 }}>
        <CardContent component="form" onSubmit={save}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editingId ? 'Editar evento' : 'Nuevo evento'}</Typography>
          <Stack spacing={2}>
            <TextField required label="Título" value={form.titulo} onChange={(e) => updateField('titulo', e.target.value)} />
            <TextField multiline minRows={2} label="Descripción" value={form.descripcion || ''} onChange={(e) => updateField('descripcion', e.target.value)} />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField required fullWidth type="datetime-local" label="Inicio" slotProps={{ inputLabel: { shrink: true } }} value={form.fechaInicio} onChange={(e) => updateField('fechaInicio', e.target.value)} />
              <TextField fullWidth type="datetime-local" label="Fin" slotProps={{ inputLabel: { shrink: true } }} value={form.fechaFin || ''} onChange={(e) => updateField('fechaFin', e.target.value)} />
              <TextField fullWidth label="Ubicación" value={form.ubicacion || ''} onChange={(e) => updateField('ubicacion', e.target.value)} />
            </Stack>
            <TextField label="URL de imagen" value={form.imagenUrl || ''} onChange={(e) => updateField('imagenUrl', e.target.value)} />
            <TextField select label="Estado" value={form.estado} onChange={(e) => updateField('estado', e.target.value as EstadoEvento)}>
              {(['BORRADOR', 'PUBLICADO', 'FINALIZADO', 'CANCELADO'] as EstadoEvento[]).map((estado) => <MenuItem key={estado} value={estado}>{estado}</MenuItem>)}
            </TextField>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tipos de entrada</Typography>
            {form.tiposEntrada.map((tipo, index) => (
              <Stack key={tipo.id || index} direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <TextField required fullWidth label="Nombre" value={tipo.nombre} onChange={(e) => updateTipo(index, 'nombre', e.target.value)} />
                <TextField required type="number" label="Precio" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} value={tipo.precio} onChange={(e) => updateTipo(index, 'precio', e.target.value)} />
                <TextField required type="number" label="Stock" slotProps={{ htmlInput: { min: 1 } }} value={tipo.stockTotal} onChange={(e) => updateTipo(index, 'stockTotal', e.target.value)} />
                <TextField required type="number" label="Máx. compra" slotProps={{ htmlInput: { min: 1 } }} value={tipo.maxPorCompra} onChange={(e) => updateTipo(index, 'maxPorCompra', e.target.value)} />
                <IconButton color="error" disabled={form.tiposEntrada.length === 1} onClick={() => setForm((current) => ({ ...current, tiposEntrada: current.tiposEntrada.filter((_, itemIndex) => itemIndex !== index) }))}><DeleteIcon /></IconButton>
              </Stack>
            ))}
            <Box><Button startIcon={<AddIcon />} onClick={() => setForm((current) => ({ ...current, tiposEntrada: [...current.tiposEntrada, { ...emptyTipo }] }))}>Agregar tipo</Button></Box>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear evento'}</Button>
              {editingId && <Button onClick={reset}>Cancelar edición</Button>}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={2}>
        {eventos.map((evento) => (
          <Card key={evento.id}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Box><Typography variant="h6" sx={{ fontWeight: 700 }}>{evento.titulo}</Typography><Typography color="text.secondary">{new Date(evento.fechaInicio).toLocaleString('es-AR')} · {evento.tiposEntrada.length} tipo(s)</Typography></Box>
            <Stack direction="row" sx={{ alignItems: 'center' }}><Chip label={evento.estado} color={evento.estado === 'PUBLICADO' ? 'success' : 'default'} /><IconButton onClick={() => edit(evento)}><EditIcon /></IconButton>{evento.estado !== 'CANCELADO' && <IconButton color="error" onClick={() => void cancel(evento)}><DeleteIcon /></IconButton>}</Stack>
          </CardContent></Card>
        ))}
      </Stack>
    </Container>
  );
};
