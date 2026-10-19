# Especificaciones SDD de Qatu

GitHub Spec Kit **1.2.0** integrado con plantillas/scripts PowerShell y skills para **Claude Code**, conforme RC13. Las especificaciones de esta carpeta fueron adaptadas a docs por el asistente; inicializar herramientas no equivale a ejecutar automáticamente todas sus fases ni a implementar Qatu.

## Índice

| N.º | Especificación | Módulo | Requisitos | Estado |
|---|---|---|---|---|
| 001 | [Descubrimiento de ofertas](./001-descubrimiento-ofertas/spec.md) | Recorrido web transversal | RF01/RF02; presentación RF11/RF13 | Prototipo validado; integración pendiente |
| 002 | [Usuarios y acceso](./002-usuarios-acceso/spec.md) | usuarios | RF12, RF14 | US1/US2 implementadas localmente; US3 pendiente |
| 003 | [Proveedores y verificación](./003-proveedores-verificacion/spec.md) | proveedores | RF13 | Borrador con decisiones abiertas |
| 004 | [Catálogo y publicaciones](./004-catalogo-publicaciones/spec.md) | catalogo | RF01, RF02, RF03, RF15 | Borrador con decisiones abiertas |
| 005 | [Reservas, contratación y pagos](./005-reservas-contratacion-pagos/spec.md) | reservas | RF04, RF05, RF06, RF07, RF08, RF09, RF10, RF18, RF21, RF22, RF23 | Borrador con decisiones abiertas |
| 006 | [Reputación y confianza](./006-reputacion-confianza/spec.md) | resenas | RF11, RF15, RF18, RF19, RF20 | Borrador con decisiones abiertas |
| 007 | [Búsqueda inteligente](./007-busqueda-inteligente/spec.md) | busqueda | RF01, RF16, RF17 | Borrador con decisiones abiertas |
| 008 | [Despliegue y validación](./008-despliegue-validacion/spec.md) | Operación transversal | RC16; EQ-01/03/09 | Plan inicial |

Hay seis módulos de negocio; las ocho especificaciones incluyen dos entregas transversales. Los números organizan carpetas y no obligan a terminar toda una antes de empezar otra.

## Estructura de cada especificación

- spec.md: objetivo, historias, reglas y criterios de éxito.
- research.md: decisiones conservadas y aclaraciones pendientes.
- plan.md: contexto técnico, fronteras y secuencia.
- data-model.md: datos/DTO e invariantes.
- contracts/api.md: contratos existentes y extensiones propuestas identificadas.
- tasks.md: tareas pendientes ordenadas por historia con IDs locales.
- quickstart.md: escenarios de validación y registro de resultados.
- checklists/requirements.md: revisión documental y aceptación.

## Documentos globales

[Constitución](../.specify/memory/constitution.md) · [Trazabilidad](./trazabilidad.md) · [Decisiones pendientes](./decisiones-pendientes.md) · [Uso de Spec Kit](./uso-spec-kit.md) · [Informe de consistencia](./analisis-consistencia.md).

## Orden de trabajo

1. Preparar infraestructura de desarrollo y prototipo 001, con fixtures identificados.
2. Usuarios 002 → Proveedores 003 → Catálogo 004; conectar 001 a datos reales.
3. Reservas 005: solicitudes, calendario/cotización, pagos sandbox y notificaciones por fases.
4. Reputación 006: evidencias/reseñas/garantía; cerrar composición pública de 001.
5. Búsqueda IA 007 sin alterar pagos/reservas.
6. Aceptación integrada y VPS 008; preparar CI/Compose antes cuando convenga.

No se programan cobros o políticas comerciales mientras sus decisiones estén abiertas. La entrega 001 marca únicamente sus tareas de prototipo comprobadas; las integraciones siguen pendientes. [Docs originales](../README.md#documentacion) permanecen como fuente académica; cambios se sincronizan con specs.
