# Contratos externos de Qatu

## Estado y convenciones

Diseño REST /api/v1, JSON, fechas ISO 8601, instantes UTC y presentación America/Lima; dinero en céntimos enteros, PEN. No es una API ya disponible. Los identificadores de actor se derivan de identidad autenticada, no de clienteId enviado libremente. Validar rol y propietario en cada operación.

| Método y ruta prevista | Caso de uso | Acceso y condición |
|---|---|---|
| POST /auth/registro; POST /auth/login | Crear cuenta y autenticar | Público con límites de intentos |
| GET /publicaciones; GET /publicaciones/:id | Buscar y ver detalle | Público; solo ofertas activas y datos públicos |
| POST /publicaciones; PATCH /publicaciones/:id | Publicar/editar | Proveedor verificado y propietario |
| GET /recursos/:id/disponibilidad | Consultar rango | Público; no expone datos de otros clientes |
| POST /busqueda/intencion | Interpretar consulta y buscar | Público con cuota, longitud máxima y timeout |
| POST /reservas | Solicitar herramienta o servicio | Cliente autenticado; publicación y fechas válidas |
| GET /reservas; GET /reservas/:id | Consultar historial propio | Participante o administrador autorizado |
| POST /reservas/:id/aceptacion | Aceptar y bloquear periodo | Proveedor propietario |
| POST /reservas/:id/cotizacion | Cotizar servicio variable | Proveedor; cliente acepta antes del cobro |
| POST /reservas/:id/pagos | Iniciar intento | Cliente de la reserva; Idempotency-Key obligatorio |
| GET /reservas/:id/pagos | Consultar estado persistido | Participante autorizado |
| POST /pagos/webhooks/culqi | Recibir confirmación | Evidencia externa verificada; no JWT de usuario |
| POST /reservas/:id/cancelacion | Cancelar | Participante; política y ajustes explícitos |
| POST /reservas/:id/entrega; POST /reservas/:id/devolucion | Registrar hitos | Participantes autorizados y evidencia |
| POST /reservas/:id/evidencias | Subir archivo | Participante; validación de tamaño/tipo/propiedad |
| POST /reservas/:id/incidencias | Abrir incidencia | Participante; revisión humana |
| POST /reservas/:id/resenas | Calificar | Cliente de reserva finalizada |

## Búsqueda con IA

Entrada: texto máximo propuesto de 500 caracteres y filtros manuales opcionales. El servidor fija fecha de referencia y zona horaria. Salida: modo natural/convencional, criterios interpretados, campos que requieren precisión y resultados con IDs reales. Ejemplo: texto “taladro en Huamanga por menos de 40 soles al día” produce tipo herramienta, categoría resuelta, zona resuelta y máximo 4000 céntimos. No se inventan fechas; debe pedirlas antes de afirmar disponibilidad.

Filtros explícitos del cliente tienen prioridad; la interfaz muestra interpretación para corregirla. “Viernes” se resuelve con contexto y se confirma si es ambiguo; guardar fecha absoluta al solicitar. No enviar documentos privados, pagos o evidencias al modelo.

## Pagos

El navegador tokeniza mediante checkout del proveedor. Envía token y clave de operación, nunca PAN/CVV al backend Qatu. El servidor recalcula importe desde snapshot autorizado y guarda el intento antes de cobrar. No registrar token ni claves en logs. Respuestas pendientes/desconocidas devuelven estado y endpoint de consulta, no éxito ficticio.

Idempotency-Key se asocia a usuario, reserva y operación. Reutilizar la clave con payload diferente devuelve 409. Un evento duplicado produce acuse sin efecto adicional. Un evento no verificado no modifica estados. La deduplicación local no presupone soporte idéntico en la pasarela.

## Seguridad y errores

Errores contienen code, mensaje y correlationId sin stack ni secretos. 400 entrada; 401 sin autenticación; 403 sin permiso; 404 inexistente/no visible; 409 conflicto; 429 límite; 202 operación pendiente. Paginación: límite inicial 20, máximo 50; filtros con listas permitidas.

Autenticación web concretada en D01 (2026-10-19): JWT HS256 de 15 minutos en cookie qatu_sesion HttpOnly/SameSite=Strict/Path=/api/v1 y Secure en producción. Sesión revocable en PostgreSQL y comprobación de cuenta activa por acción privada. Escrituras exigen Origin igual a APP_ORIGIN y Content-Type application/json; se rechazan solicitudes cross-site. Sin renovación automática ni token en JSON/localStorage. Next.js sirve como proxy al mismo origen. Ver [decisión y límites de intentos](../../../specs/002-usuarios-acceso/research.md).

Usuarios US1/US2: POST /auth/registro recibe {email,password,nombre} y responde 201 con {usuario,expiraEn}; POST /auth/login recibe {email,password} y responde 200 con el mismo formato. GET /usuarios/me devuelve {id,email,nombre,estado,roles}; PATCH /usuarios/me acepta solo {nombre}. POST /auth/logout con JSON {} revoca sesión y responde 204 limpiando cookie. Campos adicionales rechazados; registro solo concede cliente. Nombre 2–100 caracteres, email normalizado hasta 254, contraseña 12–128. Administración de usuarios y OpenAPI estructurado pendientes. [Contrato concreto](../../../specs/002-usuarios-acceso/contracts/api.md).

## Prueba de integración Culqi/Yape

La documentación de Culqi permite cargos con token Yape. Habilitación comercial, credenciales, medios disponibles, pruebas sandbox, mecanismos de verificación, conciliación y reembolsos deben confirmarse antes de producción. No presentar un QR y un comprobante subido manualmente como confirmación automática de pasarela.

Fuentes verificadas el 13/10/2026: [Culqi cargos y Yape](https://docs.culqi.com/es/documentacion/pagos-online/cargo-unico/cargos/) y [API Culqi](https://apidocs.culqi.com/).
