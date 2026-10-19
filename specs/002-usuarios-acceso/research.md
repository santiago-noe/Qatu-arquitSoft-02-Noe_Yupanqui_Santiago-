# Decisiones e investigación — Usuarios y acceso

## Evidencia local

ADR-001, ADR-002, ADR-007 gobiernan esta entrega. HU11, HU13 y RF12, RF14 definen el alcance. No se infiere arquitectura de terceros a partir de sus pantallas.

## Decisiones conservadas

- Normalizar email y garantizar unicidad en PostgreSQL; almacenar solo hash seguro de contraseña.
- Una cuenta admite varios roles; el registro público nunca concede administración.
- El actor se obtiene de la sesión; cada caso de uso verifica estado, rol y propiedad.
- Token de corta duración y almacenamiento protegido; D01 resuelta abajo.

## D01 — Sesión web (2026-10-19)

- Decisión técnica de implementación: JWT HS256 de 15 minutos, issuer/audience fijos, secreto aleatorio externo de al menos 32 caracteres. No se devuelve el token en JSON ni se usa localStorage.
- Cookie `qatu_sesion`, HttpOnly, SameSite=Strict, Path=/api/v1, sin Domain y Secure en producción. Web y API comparten origen mediante proxy Next.js; APP_ORIGIN exacto obligatorio en todas las escrituras y Content-Type application/json. Se rechazan solicitudes cross-site. No se habilita CORS.
- PostgreSQL conserva sesiones con UUID, usuario, expiración y revocación. Cada acción privada consulta sesión y cuenta activa; logout revoca y limpia cookie. Desactivar la cuenta impide acceso de inmediato. No hay renovación automática: al expirar se requiere login.
- Registro público crea únicamente rol cliente. Incorporación de proveedor corresponde a 003; administración se aprovisionará fuera del registro público. PATCH de perfil solo permite nombre.
- Contraseñas de 12–128 caracteres, hash scrypt con salt aleatorio de 16 bytes, N=32768/r=8/p=3 y comparación de tiempo constante. Sin normalizar ni truncar la contraseña.
- Límites persistidos por ventana de 15 minutos: 10 registros/IP, 30 logins/IP y 10 logins/email normalizado (clave SHA-256). IP determinada por conexión, sin confiar en X-Forwarded-For. Detrás del proxy la cuota IP es compartida; configurar proxies confiables y revisar cuotas antes de despliegue público.
- Alternativa descartada para este incremento: refresh tokens y rotación, por mayor superficie operativa. La sesión corta permite comenzar sin política de renovación adicional.
- Responsable: implementación asistida solicitada por el usuario. Se conservan JWT y monolito previstos por ADR-007. Administración auditada US3 sigue pendiente.

## Alternativas y límites

Conservar monolito modular reduce operación para un VPS/equipo pequeño; extraer servicios o añadir caché requiere medición. Los contratos por adapter facilitan pruebas y sustitución sin prometer aislamiento de CPU/memoria dentro del mismo proceso.

## Resultado

D01 resuelta para US1/US2. La aceptación completa de 002 requiere US3 y la matriz administrativa; la evidencia de este incremento se registra en quickstart.md.
