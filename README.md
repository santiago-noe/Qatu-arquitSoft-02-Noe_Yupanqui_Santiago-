# Qatu: alquiler de herramientas y servicios de oficios en Ayacucho

Proyecto final de Arquitectura de Software (IS-488), Noe Yupanqui Santiago. Entrega prevista: fines de noviembre de 2026; fecha exacta por confirmar.

## Alcance

MVP web para publicar, buscar, solicitar, pagar y completar alquileres de herramientas o servicios de oficios. Incluye búsqueda en lenguaje natural, confianza y evidencias. Compraventa y otras categorías del Word son visión futura.

Backend: monolito modular de seis módulos con Clean Architecture. Web Next.js; API NestJS; PostgreSQL; Culqi como pasarela candidata con Yape como medio habilitado; VPS con Docker Compose. Integración real, código y pruebas funcionales pendientes.

## Estructura y lectura

```text
Qatu/
└── docs/
    ├── 01-analisis-de-sistema/    Documentos 01 a 08 vigentes
    ├── 02-arquitectura-software/  Arquitectura, componentes, estilo y enfoque
    ├── 03-diseño-de-software/
    │   ├── diseño-interno/       Principios, patrones y módulos
    │   ├── diseño-externo/       Contratos REST
    │   ├── modelo-de-datos.md
    │   └── validacion-del-diseno.md
    └── 04-modelo-c4/             Contexto, contenedores, componentes, código y VPS
```

El análisis se encuentra en docs/01-analisis-de-sistema y la arquitectura en docs/02-arquitectura-software. La estructura numerada sigue el orden de Marketplace-arquitSoft-02/docs. El contenido se adapta a Qatu; ERP, carrito y courier no se copian al MVP.

1. [Análisis completo](./docs/01-analisis-de-sistema/README.md).
2. [Escenarios de atributos de calidad](./docs/01-analisis-de-sistema/08-escenarios-atributos-calidad.md).
3. [Arquitectura y decisiones](./docs/02-arquitectura-software/README.md).
4. [Diseño de software](./docs/03-diseño-de-software/README.md).
5. [Modelos C4](./docs/04-modelo-c4/README.md).
6. [Validación pendiente](./docs/03-diseño-de-software/validacion-del-diseno.md).

## Módulos

Usuarios y acceso; Proveedores; Catálogo; Reservas y contratación (incluye pagos); Reputación y confianza (resenas); Búsqueda inteligente (busqueda). Administración es una interfaz por permisos.

## Estado de diagramas

Los diagramas vigentes están incluidos en Markdown como Mermaid y sus fuentes editables .mmd en [diagramas](./docs/04-modelo-c4/diagramas/README.md). No necesitan imágenes inexistentes. Los HTML/JSON/PNG antiguos de archify se conservan como historial del diseño anterior de cinco módulos; no representan la versión actual.
