export type Rol = 'COMPRADOR' | 'ADMIN' | 'VALIDADOR';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export interface TipoEntrada {
  id: string;
  eventoId?: string;
  nombre: string;
  precio: number | string;
  stockTotal: number;
  stockDisponible: number;
  maxPorCompra: number;
}

export type EstadoEvento = 'BORRADOR' | 'DISPONIBLE' | 'FINALIZADO';

export interface Evento {
  id: string;
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  imagenPublicId?: string | null;
  fechaInicio: string;
  fechaFin?: string | null;
  ubicacion?: string | null;
  estado: EstadoEvento;
  tiposEntrada: TipoEntrada[];
}

export interface TipoEntradaPayload {
  id?: string;
  nombre: string;
  precio: number;
  stockTotal: number;
  maxPorCompra: number;
}

export type EventoPayload = Omit<Evento, 'id' | 'tiposEntrada' | 'estado'> & {
  estado?: EstadoEvento;
  tiposEntrada: TipoEntradaPayload[];
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export type EstadoTicket = 'ACTIVO' | 'UTILIZADO' | 'CANCELADO';

export interface Ticket {
  id: string;
  ordenId: string;
  tipoEntradaId: string;
  tokenQr: string;
  estado: EstadoTicket;
  fechaUso?: string | null;
  createdAt: string;
  tipoEntrada: TipoEntrada & {
    evento: Evento;
  };
}
