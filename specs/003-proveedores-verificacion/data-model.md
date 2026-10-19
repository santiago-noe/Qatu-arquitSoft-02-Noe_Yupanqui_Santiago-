# Modelo de datos — Proveedores y verificación

**Fuente:** [modelo lógico Qatu](../../docs/03-diseño-de-software/modelo-de-datos.md). Esta vista pertenece a proveedores; no es una migración aplicada.

## Datos propios

proveedores; verificaciones.

## Campos lógicos propuestos

| Entidad | Campos | Restricción |
|---|---|---|
| proveedor | id, usuarioId, zonaId, descripcion, estado, estadoVerificacion, version | usuarioId UNIQUE; usuario por contrato |
| verificacion | id, proveedorId, documentoPrivadoId, estado, motivo, revisorId, revisadoEn | solo revisor autorizado; historial y archivo privado |

Los campos adicionales operativos son propuestas de detalle del modelo existente; nombres físicos y migraciones se fijan al implementar.

## Invariantes de persistencia y acceso

1. Un perfil de proveedor por usuario; identidad consultada por fachada de Usuarios.
2. Solo administrador autorizado resuelve verificación; el proveedor no se autoaprueba.
3. Documentos de verificación no aparecen en perfil público; descargas requieren permiso.
4. Mapas por adapter y distrito manual como respaldo. La caída del mapa no impide completar la zona manual.
5. Catálogo consulta estado activo/verificado antes de publicar; desactivación debe impedir nuevas operaciones según política D02.

## Fronteras

ConsultaProveedores: perfil público, zona y estado; documentos y observaciones internas permanecen privados.

Las claves externas lógicas no conceden permiso para usar repositories de otros módulos. Toda migración define índices, constraints y compatibilidad de rollback. Se usarán céntimos enteros para dinero y UTC para instantes; las políticas comerciales pendientes no se deducen de esa representación. No guardar secretos ni datos completos de tarjeta.

## Cambios pendientes de esquema

Confirmar columnas y estados contra contratos antes de generar migraciones. Toda ampliación respecto al modelo lógico se registra como propuesta y se sincroniza; no se presenta como dato ya implementado.
