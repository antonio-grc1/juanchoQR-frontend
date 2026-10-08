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

export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'FINALIZADO' | 'CANCELADO';

export interface Evento {
  id: string;
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  fechaInicio: string;
  fechaFin?: string | null;
  ubicacion?: string | null;
  estado: EstadoEvento;
  tiposEntrada: TipoEntrada[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}
