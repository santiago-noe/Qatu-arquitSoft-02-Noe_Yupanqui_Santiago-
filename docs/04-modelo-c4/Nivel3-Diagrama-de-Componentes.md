# Nivel 3 - Componentes de la API Qatu

## Objetivo

Detallar exclusivamente el contenedor API del nivel 2. Los seis módulos se ejecutan juntos; componentes técnicos transversales no se cuentan como módulos de negocio adicionales.

```mermaid
flowchart TB
    W["Contenedor externo a esta vista: Web Next.js"]
    subgraph API["Contenedor: API Qatu - NestJS"]
        H["Entrada HTTP<br/>Controladores, guards y validación"]
        U["Usuarios y acceso<br/>Identidad y permisos"]
        P["Proveedores<br/>Perfiles y verificación"]
        C["Catálogo<br/>Publicaciones y cotización"]
        R["Reservas y contratación<br/>Calendario, estados y componente de pagos"]
        E["Reputación y confianza<br/>Reseñas, garantías documentales e incidencias"]
        B["Búsqueda inteligente<br/>Intención validada y consulta"]
        O["Publicador outbox<br/>Avisos durables y reintentos"]
        I["Adaptadores de infraestructura<br/>Repositorios, Culqi, IA, mapas y archivos"]
    end
    DB[("Contenedor: PostgreSQL")]
    F[("Almacén de archivos")]
    PAY["Sistema externo: Culqi"]
    IA["Sistema externo: IA"]
    MSG["Sistema externo: mensajería"]
    MAP["Sistema externo: mapas"]
    W -->|HTTP/JSON| H
    H --> U
    H --> P
    H --> C
    H --> R
    H --> E
    H --> B
    P -->|IdentidadUsuarios| U
    C -->|ConsultaProveedores| P
    R -->|ConsultaCatalogo| C
    R -->|IdentidadUsuarios| U
    E -->|ConsultaReservaFinalizada| R
    E -->|IdentidadUsuarios| U
    B -->|ConsultaCatalogo| C
    B -->|ConsultaDisponibilidad| R
    U & P & C & R & E & B -->|Puertos implementados| I
    I -->|SQL: tablas propias| DB
    I -->|Pagos HTTPS| PAY
    I -->|Intención HTTPS| IA
    I -->|Geografía HTTPS| MAP
    I -->|I/O autorizado| F
    R -.->|Evento guardado en transacción| O
    O -->|Lee pendientes y marca entregas| DB
    O -->|HTTPS: avisos| MSG
```

## Componentes, interfaces y propiedad

| Módulo | Contrato público | Propiedad |
|---|---|---|
| usuarios | IdentidadUsuarios | Cuentas, roles y permisos |
| proveedores | ConsultaProveedores | Perfiles, verificación y zona |
| catalogo | ConsultaCatalogo | Publicaciones, recursos físicos y tarifa |
| reservas | ConsultaDisponibilidad; casos de uso de solicitudes/pagos | Bloqueos, operaciones, intentos y eventos de pago |
| resenas | RegistroConfianza | Evidencias, garantías documentales, incidencias y reseñas |
| busqueda | BuscarEnLenguajeNatural | Criterios interpretados y métricas de consumo |

El componente de pagos pertenece a reservas y es único responsable de Culqi. InterpreteIntencion pertenece a busqueda. El adaptador de mapas es compartido como infraestructura, con un único puerto; no duplica lógica por módulo. Catálogo y confianza usan AlmacenEvidencias con políticas distintas de acceso.

## Reglas

1. index.ts publica solo contratos/fachadas; no repositories o entidades ORM.
2. Cada módulo opera sus tablas. Shared contiene utilidades puras y adapters transversales, no un repositorio universal.
3. Llamadas internas son en proceso, no REST entre módulos.
4. Reservas no depende de IA; Búsqueda depende de lectura de Reservas.
5. Outbox y consumidores se ejecutan inicialmente dentro de API; un worker independiente requerirá actualizar nivel 2.
6. Eventos se publican después del commit, con deduplicación; no asumir entrega exactamente una vez.
7. Transacciones de aceptación y confirmación pertenecen a Reservas; evidencia se registra en confianza y se coordina mediante eventos/API pública, sin transacción externa ficticia.

## Trazabilidad

DA07/ADR-001/ADR-002 → límites. DA08/ADR-006 → calendario. DA04/DA12/ADR-004/ADR-011 → pago. DA10/ADR-009 → lectura con IA.

[Nivel 2](./Nivel2-DiagramadeContenedores.md) · [Nivel 4](./Nivel4-DiagramadeCodigo.md) · [Diseño interno](../03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md).
