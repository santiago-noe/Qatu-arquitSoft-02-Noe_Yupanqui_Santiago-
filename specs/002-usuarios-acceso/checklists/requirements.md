# Checklist — Usuarios y acceso

## Revisión documental

- [ ] Revisión humana de alcance HU11/HU13, requisitos RF12/RF14 y reglas locales.
- [x] Resolver decisiones que bloqueen las tareas elegidas (D01, US1/US2).
- [ ] Completar DTO y contratos propuestos sin cambiar silenciosamente docs.
- [ ] Verificar dependencia por fachadas y propiedad de datos.

## Aceptación funcional (pendiente)

- [ ] Ejecutar US positivos y negativos con persistencia real cuando aplica.
- [ ] Comprobar EQ-04, EQ-05 y guardar evidencia de condiciones/resultados.
- [ ] Verificar seguridad, estados web y logs sin secretos.
- [ ] Analizar consistencia y resolver diferencias antes del cierre.

[Spec](../spec.md) · [Tareas](../tasks.md).

## Incremento verificado 2026-10-19

- [x] US1/US2 con API NestJS y PostgreSQL real: 10 pruebas de backend, sin integración omitida.
- [x] Recorrido real en Chrome: 2 pruebas de usuarios y regresión de 13 pruebas de descubrimiento.
- [x] D01 sincronizada en research, ADR-007 y contrato fuente; solo identidad pública exportada entre módulos.
- [ ] US3, matriz administrativa completa y auditoría.
- [ ] OpenAPI estructurado, aceptación global EQ-04/EQ-05 y revisión humana de alcance.
