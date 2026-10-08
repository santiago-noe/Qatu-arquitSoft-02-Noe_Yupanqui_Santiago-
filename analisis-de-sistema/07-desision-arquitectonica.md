# 07 - Decisiones Arquitectónicas

## Objetivo

ADR (Architecture Decision Record) significa **Registro de Decisión Arquitectónica** y documenta las decisiones importantes que tomamos durante el diseño de la arquitectura de Qatu, junto con su justificación y el driver que las origina.

## Registro de Decisiones Arquitectónicas

| ID          | Decisión arquitectónica                                     | Driver relacionado                                    | Justificación                                                                                                          | Resultado                                                                         |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **ADR-001** | Monolito modular                                            | **DA01 - Escalabilidad; DA07 - Modularidad**          | Organizar las funcionalidades en módulos independientes dentro de una sola aplicación desplegable, de bajo costo.      | Módulos de Usuarios, Proveedores, Catálogo, Reservas y Reseñas.                    |
| **ADR-002** | Clean Architecture                                          | **DA07 - Modularidad y mantenibilidad**               | Separar las reglas del negocio (tarifas, estados y fechas de reserva) de los detalles tecnológicos.                    | Dominio, Aplicación, Infraestructura y Presentación.                              |
| **ADR-003** | Estrategia de caché                                         | **DA02 - Rendimiento**                                | Reducir consultas repetitivas en las búsquedas por categoría y zona, que son la operación más frecuente.               | Caché (Redis) para resultados de búsqueda y detalle de publicaciones.             |
| **ADR-004** | Integración de pagos mediante interfaces y adaptadores      | **DA04 - Integración con pasarela de pago**           | Desacoplar los casos de uso del proveedor de pagos (Culqi, Niubiz o Mercado Pago).                                     | Contrato `ProcesadorPagos` y adaptador para la pasarela externa.                  |
| **ADR-005** | Mensajería y mapas mediante adaptadores tolerantes a fallos | **DA06 - Integración con mensajería y mapas**         | Si WhatsApp/SMS o el servicio de mapas fallan, la reserva no debe detenerse.                                           | Contratos `Notificador` y `ServicioMapas`; notificaciones con reintentos.         |
| **ADR-006** | Control de concurrencia en reservas a nivel de base de datos | **DA08 - Consistencia de reservas**                  | Evitar que una herramienta se alquile dos veces en las mismas fechas, aun con solicitudes simultáneas.                 | Transacción + restricción de exclusión por rango de fechas en PostgreSQL.         |
| **ADR-007** | Autenticación JWT con autorización por rol                  | **DA03 - Seguridad**                                  | Controlar el acceso de clientes, proveedores y administradores sin guardar sesión en el servidor (permite replicar).   | Guardas de rol en la API, HTTPS y datos personales protegidos (Ley N.° 29733).    |
| **ADR-008** | Cliente web mobile-first con respuestas paginadas           | **DA09 - Usabilidad móvil; DA05 - API REST**          | La mayoría de usuarios entra desde celular con conexión variable.                                                      | Next.js con renderizado en servidor, imágenes optimizadas y API `/api/v1/*` paginada. |

## Detalle de las decisiones

### ADR-001 - Monolito modular

- **Contexto:** equipo pequeño, presupuesto limitado (RC14) y desarrollo guiado por especificaciones con Spec Kit (RC13).
- **Decisión:** una sola aplicación backend (NestJS) con un módulo por dominio: `usuarios`, `proveedores`, `catalogo`, `reservas` y `resenas`.
- **Consecuencias:** un solo despliegue y una sola base de datos; si un módulo crece (por ejemplo, Reservas) podrá extraerse como servicio independiente.

### ADR-002 - Clean Architecture

- **Contexto:** las reglas de Qatu (cálculo de tarifas, garantía, transición de estados de una reserva, solapamiento de fechas) deben poder probarse sin depender de la base de datos ni de la interfaz.
- **Decisión:** el núcleo (dominio) no conoce frameworks; los casos de uso solo usan entidades y contratos; los adaptadores implementan esos contratos.
- **Consecuencias:** más archivos al inicio, a cambio de pruebas unitarias simples y tecnologías intercambiables.

### ADR-003 - Estrategia de caché

- **Contexto:** buscar herramientas y servicios es la operación más frecuente en temporada alta.
- **Decisión:** usar Redis como caché frente al módulo `catalogo` con expiración corta. La **disponibilidad** de una herramienta no se cachea: siempre se consulta en la base de datos.
- **Consecuencias:** búsquedas más rápidas; se debe invalidar la caché al actualizar una publicación.

### ADR-004 - Integración de pagos mediante interfaces y adaptadores

- **Contexto:** los pagos (anticipo o garantía) se delegan a una pasarela externa (RC04) y no se almacenan datos de tarjetas.
- **Decisión:** el caso de uso depende del contrato `ProcesadorPagos`; el adaptador concreto (Culqi, Niubiz o Mercado Pago) se elige en la raíz de composición.
- **Consecuencias:** cambiar de pasarela no modifica el dominio; existe un adaptador simulado para desarrollo y pruebas.

### ADR-005 - Mensajería y mapas mediante adaptadores tolerantes a fallos

- **Contexto:** WhatsApp/SMS y el servicio de mapas son terceros que pueden no estar disponibles.
- **Decisión:** contratos `Notificador` y `ServicioMapas` con adaptadores; las notificaciones se registran y se reintentan si fallan, sin bloquear la reserva.
- **Consecuencias:** la operación principal (reservar y pagar) no depende de la disponibilidad de estos servicios.

### ADR-006 - Control de concurrencia en reservas a nivel de base de datos

- **Contexto:** dos clientes pueden solicitar la misma herramienta para fechas que se cruzan casi al mismo tiempo.
- **Decisión:** la aceptación de una reserva se hace dentro de una transacción y la tabla de reservas tiene una restricción de exclusión sobre `(herramienta_id, rango_fechas)` para reservas activas. Así la base de datos rechaza el segundo registro aunque ambos lleguen a la vez.
- **Consecuencias:** se garantiza la consistencia sin bloqueos en la aplicación; el segundo cliente recibe un mensaje de "fechas no disponibles".

### ADR-007 - Autenticación JWT con autorización por rol

- **Contexto:** tres roles con permisos distintos (RC08) y datos personales sujetos a la Ley N.° 29733 (RC09).
- **Decisión:** JWT de corta duración con el rol del usuario; guardas de NestJS por rol; HTTPS en todo el tráfico; contraseñas con hash.
- **Consecuencias:** la API no guarda sesión, lo que facilita replicar instancias (DA01).

### ADR-008 - Cliente web mobile-first con respuestas paginadas

- **Contexto:** acceso mayoritario desde celular y conexiones lentas (AC06).
- **Decisión:** Next.js con renderizado en servidor para las páginas de búsqueda y detalle, imágenes optimizadas y respuestas paginadas en la API REST.
- **Consecuencias:** menor consumo de datos y primera carga más rápida en celulares.

## Resumen

| Driver                                | Decisiones que lo atienden |
| ------------------------------------- | -------------------------- |
| DA01 - Escalabilidad                  | ADR-001, ADR-007           |
| DA02 - Rendimiento                    | ADR-003                    |
| DA03 - Seguridad                      | ADR-007                    |
| DA04 - Integración con pagos          | ADR-004                    |
| DA05 - API REST                       | ADR-008                    |
| DA06 - Integración con mensajería y mapas | ADR-005                |
| DA07 - Modularidad y mantenibilidad   | ADR-001, ADR-002           |
| DA08 - Consistencia de reservas       | ADR-006                    |
| DA09 - Usabilidad móvil               | ADR-008                    |

Todos los drivers identificados en [06 - Drivers Arquitectónicos](./06-driver-arquitectonicos.md) quedan atendidos por al menos una decisión.
