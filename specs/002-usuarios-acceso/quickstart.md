# Validación y recorrido — Usuarios y acceso

## Preparación

US1/US2 ejecutables localmente. Seguir backend/README.md para configurar DATABASE_URL, JWT_SECRET, APP_ORIGIN, migración y arranque. Para integración usar una base exclusiva de pruebas; TEST_DATABASE_URL habilita la suite HTTP/PostgreSQL, que restablece únicamente sus cuotas IP de ensayo y genera cuentas sintéticas. Sin esa variable la integración se omite explícitamente.

Desde backend: npm run build, npm run migrate, npm test. Desde frontend: npm run build, npm test para descubrimiento y npm run test:usuarios para navegador/API/PostgreSQL reales. El ensayo web inicia API en 3001 y web en 3100 con APP_ORIGIN coincidente; necesita DATABASE_URL y JWT_SECRET en el entorno o backend/.env.

## Recorridos

1. US1: dado email válido sin registrar, completo el registro; comprobar que se crea una sola cuenta y no se expone el hash.
2. US2: dado una sesión válida, edito mi perfil; comprobar que solo cambian mis datos permitidos.
3. US3: dado un administrador autorizado, desactiva una cuenta; comprobar que el acceso se revoca según política de sesión y se audita la acción.

## Casos críticos

- Email duplicado normalizado y dos registros concurrentes: una sola cuenta.
- Matriz cliente/proveedor/admin/anónimo: acciones ajenas rechazadas, incluso con IDs manipulados.
- Contraseña incorrecta, cuenta inactiva y límite de intentos; sin credenciales en logs.

## Registro de resultados

| Campo | Valor |
|---|---|
| Commit/versiones/entorno | 2026-10-19, Windows/PowerShell, Node 24.21.0, npm 11.19.0, PostgreSQL 18.4; base Git 8d91c2e con cambios locales sin commit. NestJS 11 y versiones exactas en backend/package-lock.json; Next 16.4.1. |
| Fixture y condiciones | Clúster aislado .local-postgres/ (ignorado), loopback:5433; bases qatu_test y qatu_web_test, emails UUID en example.com. Docker instalado pero daemon apagado; se usaron initdb/pg_ctl locales. |
| Comandos ejecutados | backend: npm run migrate (incluida repetición), npm run build, TEST_DATABASE_URL apuntando a qatu_test y npm test. frontend: npm run typecheck, npm run build, npm test y npm run test:usuarios con DATABASE_URL=qatu_web_test y secreto efímero. |
| Resultados positivos/negativos | Backend: 10 pruebas pasan, 0 omitidas; registro concurrente 201/409 y una cuenta, hash salado, campos privados ausentes, cookie HttpOnly/Strict, perfil, rechazo de escalamiento/IDs, anónimo/origen ajeno, logout con cookie reutilizada, expiración en BD, contraseña incorrecta, JWT inválido, cuenta inactiva y cuota 429. Chrome: 2 pruebas de usuarios pasan (registro→recarga→edición→logout→login y perfil anónimo/formularios a 360 px). Regresión de descubrimiento: 13 pruebas pasan. Compilaciones API/web y typecheck correctos. |
| Medidas EQ-04/EQ-05 | Evidencia parcial de autorización US1/US2. Dominio sin imports NestJS/pg; repositorios privados al módulo y fachada pública solo de identidad. No equivale a aceptar EQ-04/EQ-05 globales ni a medir rendimiento. |
| Limitaciones y fallos | Sin US3, auditoría administrativa, recuperación de contraseña, renovación, OpenAPI estructurado ni despliegue. La desactivación se ensayó mediante SQL controlado, no mediante un endpoint administrativo. Catálogo sintético. Cuota por IP compartida detrás de proxy y limpieza de filas expiradas pendientes antes de publicación. |

[Escenarios fuente](../../docs/01-analisis-de-sistema/08-escenarios-atributos-calidad.md) · [Plan](./plan.md).
