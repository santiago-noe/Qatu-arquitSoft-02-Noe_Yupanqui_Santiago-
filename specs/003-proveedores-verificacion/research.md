# Decisiones e investigación — Proveedores y verificación

## Evidencia local

ADR-002, ADR-005, ADR-007, ADR-012 gobiernan esta entrega. HU12 y RF13 definen el alcance. No se infiere arquitectura de terceros a partir de sus pantallas.

## Decisiones conservadas

- Un perfil de proveedor por usuario; identidad consultada por fachada de Usuarios.
- Solo administrador autorizado resuelve verificación; el proveedor no se autoaprueba.
- Documentos de verificación no aparecen en perfil público; descargas requieren permiso.
- Mapas por adapter y distrito manual como respaldo. La caída del mapa no impide completar la zona manual.

## Decisiones pendientes

- D02: tratamiento de publicaciones y reservas existentes al desactivar un proveedor; pendiente antes de desactivación operativa.
- D03: proveedor de mapas y límites de documentos (tipo/tamaño/retención) antes de integrar cargas.

## Alternativas y límites

Conservar monolito modular reduce operación para un VPS/equipo pequeño; extraer servicios o añadir caché requiere medición. Los contratos por adapter facilitan pruebas y sustitución sin prometer aislamiento de CPU/memoria dentro del mismo proceso.

## Resultado

Plan elaborado contra documentación existente; decisiones pendientes aún sin resolver. Documentar decisión, fecha, responsable y cambios de contrato antes de ejecutar tareas bloqueadas.
