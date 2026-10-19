# Modelo de datos — Usuarios y acceso

**Fuente:** [modelo lógico Qatu](../../docs/03-diseño-de-software/modelo-de-datos.md). Implementación física US1/US2 en backend/migrations/usuarios/001-usuarios.sql, probada en bases aisladas el 2026-10-19; no implica despliegue productivo.

## Datos propios

usuarios; roles_usuario.

## Campos lógicos propuestos

| Entidad | Campos | Restricción |
|---|---|---|
| usuario | id, emailNormalizado, passwordHash, nombre, estado, creadoEn, version | emailNormalizado UNIQUE; hash privado |
| rol_usuario | usuarioId, rol | UNIQUE(usuarioId,rol); roles permitidos |

Los campos adicionales operativos son propuestas de detalle del modelo existente; nombres físicos y migraciones se fijan al implementar.

## Invariantes de persistencia y acceso

1. Normalizar email y garantizar unicidad en PostgreSQL; almacenar solo hash seguro de contraseña.
2. Una cuenta admite varios roles; el registro público nunca concede administración.
3. El actor se obtiene de la sesión; cada caso de uso verifica estado, rol y propiedad.
4. D01 resuelta en research.md: JWT de 15 minutos en cookie HttpOnly y revocación persistida.

## Fronteras

IdentidadUsuarios: identidad activa, roles y permisos; nunca devuelve hash ni token a otros módulos.

Las claves externas lógicas no conceden permiso para usar repositories de otros módulos. Toda migración define índices, constraints y compatibilidad de rollback. Se usarán céntimos enteros para dinero y UTC para instantes; las políticas comerciales pendientes no se deducen de esa representación. No guardar secretos ni datos completos de tarjeta.

## Cambios pendientes de esquema

Nombres físicos: usuarios(id, email_normalizado, password_hash, nombre, estado, creado_en, version), roles_usuario(usuario_id, rol). Estados activo/inactivo; roles cliente/proveedor/admin. UUID, timestamptz, unicidad de email normalizado y PK compuesta para roles; FK a usuarios. Registro de cuenta y rol cliente en una transacción.

Detalle operativo D01: sesiones_usuario(id, usuario_id, expira_en, revocada) con índice de usuario; limites_acceso(clave, intentos, hasta) con incremento atómico por ventana de 15 minutos. La clave por email contiene SHA-256; nunca la contraseña. migraciones registra versiones aplicadas con bloqueo transaccional. Hay SQL de rollback manual en 001-usuarios.down.sql.

La limpieza periódica de filas expiradas sigue pendiente antes de operación sostenida. No se almacenan JWT completos ni refresh tokens. Las tablas de auditoría/cambios administrativos se concretarán con US3.
