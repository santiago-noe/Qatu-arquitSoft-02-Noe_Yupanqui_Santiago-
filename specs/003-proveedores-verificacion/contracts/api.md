# Contratos — Proveedores y verificación

**Base:** /api/v1, JSON, ISO 8601; actor del contexto autenticado. Diseño, no API publicada.

## Rutas tomadas del diseño vigente

| Método | Ruta relativa | Acceso | Condición |
|---|---|---|---|
| — | Sin rutas específicas completas en el documento actual | — | Completar antes de implementación |

## Extensiones propuestas para cubrir requisitos existentes

- POST/PATCH /proveedores/me para alta y edición propias.
- GET /proveedores/:id para resumen público.
- POST /proveedores/me/verificaciones para remitir documentos.
- POST /admin/proveedores/:id/verificacion para resolución auditada.
- PATCH /admin/proveedores/:id/estado para desactivación.

Estas extensiones aún no están congeladas: completar DTO/estados en OpenAPI y actualizar docs antes de implementar. No se ejecutan operaciones ni llamadas externas desde estas especificaciones.

## Datos de entrada/salida propuestos

Alta/edición: descripcion, zonaId y datos públicos permitidos; usuarioId proviene del actor. Verificación: referencias privadas a documentos validados; revisor registra decision y motivo. Resumen público: id, nombre público, zonaId, descripcion y estadoVerificacion visible. No devuelve rutas de documentos, identidad privada ni observaciones internas.

## Puerto interno

ConsultaProveedores: perfil público, zona y estado; documentos y observaciones internas permanecen privados.

## Errores y seguridad

400 entrada inválida; 401 no autenticado; 403 no autorizado; 404 inexistente/no visible; 409 conflicto; 429 cuota; 202 pendiente cuando corresponda. Error con code, mensaje y correlationId, sin stack ni secretos. Respuestas públicas excluyen documentos y campos privados.

Paginación base 20 y máximo general 50; para aceptación de EQ-01 utilizar máximo 20. Mutaciones verifican rol/propiedad/estado en aplicación además de la guarda HTTP. Idempotencia es obligatoria en pagos y eventos según RF21/RF22; no se extiende a ciegas a todas las operaciones.

[Contrato fuente](../../../docs/03-diseño-de-software/diseño-externo/contratos-api.md) · [Spec](../spec.md).
