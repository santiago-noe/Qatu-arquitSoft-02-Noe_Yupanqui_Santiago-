# API Qatu — Usuarios

NestJS 11/TypeScript, PostgreSQL y puertos por módulo. Este incremento implementa registro, login, perfil propio y logout (US1/US2, RF12/RF14). Administración auditada US3 sigue pendiente. El catálogo del frontend conserva fixtures.

## Desarrollo local

Requisitos: Node.js 22+ y PostgreSQL. Desde la raíz de Qatu, `docker compose up -d db` prepara PostgreSQL/PostGIS en 127.0.0.1:5433 con volumen persistente. Alternativamente usar una base PostgreSQL local dedicada.

Desde backend:

```powershell
npm ci
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copiar el secreto generado en JWT_SECRET de .env. Configurar DATABASE_URL; APP_ORIGIN debe coincidir exactamente con el origen del navegador (por defecto http://127.0.0.1:3000).

```powershell
npm run migrate
npm run dev
```

En otra terminal, desde frontend: `npm run dev`. Abrir http://127.0.0.1:3000/registro. Next.js reenvía /api/v1 al backend loopback:3001; QATU_API_URL permite cambiarlo y requiere reconstrucción para `next start`.

La migración es transaccional, con bloqueo e historial; repetir migrate no borra datos. El archivo .down.sql documenta el rollback manual destructivo y no se ejecuta automáticamente.

## Verificación

`npm run build` compila. `npm test` ejecuta validación/hash; las pruebas HTTP/PostgreSQL se omiten explícitamente sin TEST_DATABASE_URL.

Usar una base exclusiva de pruebas, migrarla con DATABASE_URL apuntando a ella y luego:

```powershell
$env:TEST_DATABASE_URL='postgresql://qatu:qatu_local@127.0.0.1:5433/qatu_test'
npm test
```

Los ensayos generan cuentas sintéticas; no usar una base personal/producción. Desde frontend, `npm run build` y `npm run test:usuarios` verifican el recorrido con navegador/API/base reales. Para ese ensayo el backend utiliza su .env, APP_ORIGIN se fija en 127.0.0.1:3100; la API y los puertos 3001/3100 deben estar libres. `npm test` conserva la regresión de descubrimiento sin requerir backend.

## Límites del incremento

No hay renovación ni recuperación de contraseña; las sesiones expiran a los 15 minutos. Logout revoca en servidor. No hay asignación pública de roles ni endpoint de administración. Las cuotas por IP detrás del proxy se comparten; revisar proxy y cuotas antes de publicar. HTTPS, limpieza programada de sesiones/cuotas expiradas, OpenAPI estructurado y aceptación completa de EQ-04/EQ-05 siguen pendientes. Las credenciales de Compose son exclusivamente locales.

Referencias de implementación: [NestJS](https://docs.nestjs.com/security/authentication), [scrypt de Node.js](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback). Política concreta en specs/002-usuarios-acceso/research.md.
