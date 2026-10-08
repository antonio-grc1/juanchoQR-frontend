import axios from 'axios';
import type { Evento, EventoPayload, AuthResponse, Ticket } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar expiración de token y refresco
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post<{ accessToken: string }>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = res.data;
          localStorage.setItem('token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Si el refresh falla, desloguear
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const eventosApi = {
  getAll: async (estado?: string): Promise<Evento[]> => {
    const res = await api.get<{ eventos: Evento[] }>('/eventos', {
      params: estado ? { estado } : undefined,
    });
    return res.data.eventos;
  },

  getById: async (id: string): Promise<Evento> => {
    const res = await api.get<{ evento: Evento }>(`/eventos/${id}`);
    return res.data.evento;
  },

  getAdminAll: async (): Promise<Evento[]> => {
    const res = await api.get<{ eventos: Evento[] }>('/eventos/admin/all');
    return res.data.eventos;
  },

  create: async (evento: EventoPayload): Promise<Evento> => {
    const res = await api.post<{ evento: Evento }>('/eventos', evento);
    return res.data.evento;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagen', file);
    const res = await api.post<{ imagenUrl: string }>('/eventos/imagen', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.imagenUrl;
  },

  update: async (id: string, evento: Partial<EventoPayload>): Promise<Evento> => {
    const res = await api.put<{ evento: Evento }>(`/eventos/${id}`, evento);
    return res.data.evento;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/eventos/${id}`);
  },
};

export const authApi = {
  loginAdmin: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  loginGoogle: async (idToken: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/google', { idToken });
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
    }
  },
};

export interface CreateOrderResponse {
  ordenId: string;
  total: number;
  preferenceId: string;
  initPoint: string;
}

export const ordenesApi = {
  create: async (tipoEntradaId: string, cantidad: number): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>('/ordenes', {
      tipoEntradaId,
      cantidad,
    });
    return res.data;
  },

  getMisOrdenes: async (): Promise<any[]> => {
    const res = await api.get<{ ordenes: any[] }>('/ordenes/mis-ordenes');
    return res.data.ordenes;
  },

  simularPago: async (ordenId: string, accion?: 'aprobar' | 'rechazar'): Promise<any> => {
    const res = await api.post('/ordenes/simular-pago', {
      ordenId,
      accion,
    });
    return res.data;
  },
};

export const ticketsApi = {
  getMisTickets: async (): Promise<Ticket[]> => {
    const res = await api.get<{ tickets: Ticket[] }>('/tickets/mis-tickets');
    return res.data.tickets;
  },

  validate: async (tokenQr: string): Promise<{
    valid: boolean;
    message: string;
    ticket?: Ticket;
    fechaUso?: string;
  }> => {
    const res = await api.post('/tickets/validar', { tokenQr });
    return res.data;
  },
};
