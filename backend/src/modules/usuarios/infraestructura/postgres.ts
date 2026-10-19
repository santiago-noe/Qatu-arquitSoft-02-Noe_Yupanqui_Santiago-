import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import type { RepositorioUsuarios } from '../dominio/puertos';
import { ErrorUsuario, type Usuario } from '../dominio/usuario';

const seleccion = `SELECT u.id, u.email_normalizado AS email, u.nombre, u.estado,
  ARRAY(SELECT rol FROM roles_usuario WHERE usuario_id = u.id ORDER BY rol) AS roles FROM usuarios u`;

export class PostgresUsuarios implements RepositorioUsuarios {
  constructor(private readonly pool: Pool) {}

  async crear(email: string, nombre: string, passwordHash: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const id = randomUUID();
      await client.query('INSERT INTO usuarios(id,email_normalizado,nombre,password_hash) VALUES ($1,$2,$3,$4)', [id, email, nombre, passwordHash]);
      await client.query("INSERT INTO roles_usuario(usuario_id,rol) VALUES ($1,'cliente')", [id]);
      await client.query('COMMIT');
      return { id, email, nombre, estado: 'activo' as const, roles: ['cliente' as const] };
    } catch (error) {
      await client.query('ROLLBACK');
      if ((error as { code?: string }).code === '23505') throw new ErrorUsuario('EMAIL_DUPLICADO', 409, 'Ya existe una cuenta con ese correo.');
      throw error;
    } finally { client.release(); }
  }

  async credenciales(email: string) {
    const result = await this.pool.query(`${seleccion} WHERE u.email_normalizado = $1`, [email]);
    if (!result.rows[0]) return null;
    const hash = await this.pool.query('SELECT password_hash FROM usuarios WHERE id = $1', [result.rows[0].id]);
    return { usuario: result.rows[0] as Usuario, passwordHash: hash.rows[0].password_hash as string };
  }

  async porId(id: string) {
    const result = await this.pool.query(`${seleccion} WHERE u.id = $1`, [id]);
    return (result.rows[0] as Usuario | undefined) ?? null;
  }

  async cambiarNombre(id: string, nombre: string) {
    const result = await this.pool.query("UPDATE usuarios SET nombre = $2, version = version + 1 WHERE id = $1 AND estado = 'activo' RETURNING id", [id, nombre]);
    return result.rowCount ? this.porId(id) : null;
  }

  async crearSesion(id: string, usuarioId: string, expira: Date) {
    await this.pool.query('INSERT INTO sesiones_usuario(id,usuario_id,expira_en) VALUES ($1,$2,$3)', [id, usuarioId, expira]);
  }

  async sesionActiva(id: string, usuarioId: string) {
    const result = await this.pool.query('SELECT id FROM sesiones_usuario WHERE id = $1 AND usuario_id = $2 AND NOT revocada AND expira_en > now()', [id, usuarioId]);
    return !!result.rowCount;
  }

  async revocarSesion(id: string) {
    await this.pool.query('UPDATE sesiones_usuario SET revocada = true WHERE id = $1', [id]);
  }

  async limitar(clave: string, maximo: number) {
    const result = await this.pool.query(`INSERT INTO limites_acceso(clave,intentos,hasta) VALUES ($1,1,now() + interval '15 minutes')
      ON CONFLICT (clave) DO UPDATE SET intentos = CASE WHEN limites_acceso.hasta <= now() THEN 1 ELSE limites_acceso.intentos + 1 END,
      hasta = CASE WHEN limites_acceso.hasta <= now() THEN now() + interval '15 minutes' ELSE limites_acceso.hasta END RETURNING intentos`, [clave]);
    if (result.rows[0].intentos > maximo) throw new ErrorUsuario('LIMITE_ACCESO', 429, 'Demasiados intentos. Espera 15 minutos.');
  }
}
