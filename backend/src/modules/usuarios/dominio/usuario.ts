export type Rol = 'cliente' | 'proveedor' | 'admin';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  estado: 'activo' | 'inactivo';
  roles: Rol[];
}

export interface Credenciales {
  usuario: Usuario;
  passwordHash: string;
}

export class ErrorUsuario extends Error {
  constructor(public readonly code: string, public readonly status: number, mensaje: string) {
    super(mensaje);
  }
}

export function entrada(value: unknown, campos: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(campo => !campos.includes(campo))) {
    throw new ErrorUsuario('ENTRADA_INVALIDA', 400, 'Revisa los campos enviados.');
  }
  return value as Record<string, unknown>;
}

export function nombreValido(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 100) {
    throw new ErrorUsuario('ENTRADA_INVALIDA', 400, 'El nombre debe tener entre 2 y 100 caracteres.');
  }
  return value.trim();
}

export function emailValido(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new ErrorUsuario('ENTRADA_INVALIDA', 400, 'Ingresa un correo válido.');
  }
  return value.trim().toLowerCase();
}

export function passwordValido(value: unknown): string {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
    throw new ErrorUsuario('ENTRADA_INVALIDA', 400, 'La contraseña debe tener entre 12 y 128 caracteres.');
  }
  return value;
}
