# 6. Estilo arquitectónico

> **Pregunta guía:** ¿Cómo estructuramos globalmente el sistema?

## Estilo seleccionado

**Cliente-servidor + Monolito modular en capas.**

| Concepto             | Qué significa en este proyecto                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cliente-servidor** | El frontend (Next.js 14 · React · TypeScript) se ejecuta en el navegador del celular o computadora y consume el backend mediante API REST (HTTPS + JSON). |
| **Monolito**         | El backend (Node.js 20 + NestJS) es **una sola aplicación, un solo proceso, un solo despliegue** y una sola base de datos PostgreSQL (con PostGIS).       |
| **Modular**          | Dentro del monolito, cada funcionalidad es un módulo con límites claros: `usuarios`, `proveedores`, `catalogo`, `reservas`, `resenas`.                    |
| **En capas**         | Cada módulo se divide en presentación (controller), lógica de negocio (service) y datos (repository).                                                    |

> Capas = organización **lógica**. Monolito = unidad de **despliegue**.
> Ambos conceptos coexisten.

## Justificación (trazabilidad con drivers)

| Driver                                 | Cómo lo atiende el estilo                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| DA01 – Escalabilidad                   | El monolito no guarda sesión (JWT), así que se replica detrás de un balanceador; un módulo como `reservas` podría extraerse si lo necesita.       |
| DA02 – Rendimiento                     | Caché (Redis) frente al módulo `catalogo`; índices geográficos (PostGIS) para buscar por zona; llamadas en proceso, sin latencia entre módulos. |
| DA03 – Seguridad                       | Guardas transversales de autenticación (JWT) y rol, validación de entrada y HTTPS (ADR-007).                                                     |
| DA04 – Pago externo                    | El módulo `reservas` se integra con la pasarela mediante un adaptador HTTPS/REST (ADR-004).                                                      |
| DA05 – API REST                        | Frontend y backend separados; contrato `/api/v1/*`.                                                                                              |
| DA06 – Mensajería y mapas              | Adaptadores para WhatsApp/SMS y mapas; si fallan, la reserva continúa (ADR-005).                                                                |
| DA07 – Modularidad y mantenibilidad    | Módulos independientes; cada módulo solo usa a otro a través de su _service_.                                                                    |
| DA08 – Consistencia de reservas        | Una sola base de datos relacional permite transacciones y restricciones de exclusión por fechas (ADR-006).                                      |
| DA09 – Usabilidad móvil                | Next.js con renderizado en servidor y respuestas paginadas (ADR-008).                                                                            |

## Alternativas descartadas

| Estilo            | Motivo                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Microservicios    | Alto costo operativo para un equipo pequeño y un presupuesto limitado (RC14); además complica la consistencia de las reservas. |
| SOA / ESB         | Pensado para integrar muchos sistemas corporativos; excesivo para Qatu.                                                        |
| Event-driven puro | Útil para notificaciones asíncronas (se puede incorporar luego), pero no como estructura global.                              |
| Serverless        | Dificulta las transacciones de reserva y genera dependencia del proveedor cloud.                                               |

## Diagrama de arquitectura (estructura global)

![Monolito modular en capas — Qatu Backend](./img/monolito-modular-en-capas.png)

Versión en Mermaid (incluye además la caché Redis del ADR-003):

```mermaid
flowchart TB
    subgraph Actores
        CL["Cliente"]
        PR["Proveedor"]
        AD["Administrador"]
    end

    WEB["Cliente Web<br/>Next.js 14 · React · TypeScript<br/>(navegador · mobile-first)"]
    CL --> WEB
    PR --> WEB
    AD --> WEB

    WEB -- "HTTPS · JSON<br/>/api/v1/*" --> MW

    subgraph MONO["«monolito» Qatu Backend — Node.js 20 LTS · NestJS (un solo proceso, un solo despliegue)"]
        MW["Elementos transversales<br/>CORS · Helmet · guard JWT/rol · ValidationPipe · filtro de excepciones · logger"]

        subgraph P["1. Capa de presentación — recibe HTTP, autentica, valida y responde JSON"]
            U1["usuarios.controller"]
            S1["proveedores.controller"]
            C1["catalogo.controller"]
            R1["reservas.controller"]
            E1["resenas.controller"]
        end

        subgraph L["2. Capa de lógica de negocio — reglas y coordinación entre módulos"]
            U2["usuarios.service<br/>registro, login, roles"]
            S2["proveedores.service<br/>arrendadores y maestros, verificación"]
            C2["catalogo.service<br/>herramientas en alquiler, servicios de oficio, búsqueda"]
            R2["reservas.service<br/>alquiler por fechas, contratación de servicios, estados, pago"]
            E2["resenas.service<br/>calificaciones, moderación"]
        end

        subgraph DAT["3. Capa de datos — persistencia y consultas"]
            U3["usuarios.repository"]
            S3["proveedores.repository"]
            C3["catalogo.repository"]
            R3["reservas.repository"]
            E3["resenas.repository"]
            ORM["Acceso a datos compartido<br/>TypeORM · entidades · transacciones · pool de conexiones"]
        end

        MW --> U1 & S1 & C1 & R1 & E1
        U1 --> U2 --> U3
        S1 --> S2 --> S3
        C1 --> C2 --> C3
        R1 --> R2 --> R3
        E1 --> E2 --> E3
        U3 & S3 & C3 & R3 & E3 --> ORM

        S2 -.-> U2
        C2 -.-> S2
        R2 -.-> C2
        E2 -.-> R2
    end

    CACHE[("Redis<br/>caché de búsquedas")]
    DB[("PostgreSQL + PostGIS<br/>qatu_db")]
    PAY["«sistema externo»<br/>Pasarela de pagos<br/>Culqi / Niubiz / Mercado Pago"]
    MSG["«sistema externo»<br/>Servicio de mensajería<br/>WhatsApp Business / SMS"]
    MAP["«sistema externo»<br/>Servicio de mapas<br/>Google Maps / OpenStreetMap"]

    C2 -. "ADR-003" .-> CACHE
    ORM -- "SQL · TCP 5432" --> DB
    R2 -- "HTTPS / REST" --> PAY
    R2 -- "HTTPS / REST" --> MSG
    C2 -- "HTTPS / REST" --> MAP
    S2 -- "HTTPS / REST" --> MAP
```

**Leyenda**

- Flecha continua: llamada síncrona entre capas (de arriba hacia abajo).
- Flecha punteada entre services: uso entre módulos (solo a través de su _service_).
- Cilindros: almacenamiento. Cajas «sistema externo»: fuera del monolito.

### Dependencias entre módulos

| Módulo que usa | Módulo usado  | Motivo                                                                    |
| -------------- | ------------- | ------------------------------------------------------------------------- |
| `proveedores`  | `usuarios`    | Todo proveedor es un usuario registrado con rol de proveedor.             |
| `catalogo`     | `proveedores` | Solo un proveedor verificado puede publicar herramientas o servicios.     |
| `reservas`     | `catalogo`    | Consulta la tarifa y el calendario de la herramienta (alquiler) o la tarifa del servicio de oficio (contratación). |
| `resenas`      | `reservas`    | Solo se puede reseñar a un proveedor después de una reserva finalizada.   |

## Estructura interna del cliente web (Next.js)

El nodo **Cliente Web** del diagrama anterior se organiza internamente con
Clean Architecture: Presentación, Aplicación (casos de uso), Dominio e
Infraestructura (adaptadores), con `contenedor.ts` como raíz de composición.
Los adaptadores HTTP consumen la **Qatu API REST** del monolito.

![Estructura interna del cliente web Next.js — Clean Architecture](./img/estructura-cliente-web-nextjs.png)

## Reglas de la arquitectura

1. Cada capa solo invoca a la capa inmediatamente inferior.
2. Un módulo no accede al _repository_ ni a las tablas de otro módulo.
3. La comunicación entre módulos se hace llamando a su _service_.
4. Todo se ejecuta en un único proceso Node.js con una única base de datos.
5. Los sistemas externos (pagos, mensajería, mapas) se consumen siempre mediante adaptadores (ADR-004, ADR-005).
6. Aceptar una reserva siempre ocurre dentro de una transacción (ADR-006).

## Despliegue

```mermaid
flowchart LR
    B["Navegador<br/>(celular / PC)"] -- HTTPS --> LB["Balanceador de carga"]
    LB --> FE["Cliente web<br/>Next.js (Docker)"]
    LB --> I1["Instancia 1<br/>monolito (Docker)"]
    LB --> I2["Instancia 2<br/>monolito (Docker)"]
    LB -.-> IN["Instancia N<br/>(temporada alta)"]
    I1 & I2 & IN --> R[("Redis")]
    I1 & I2 & IN --> PG[("PostgreSQL + PostGIS")]
```

La aplicación es **una sola imagen** que se replica; escalar en temporada alta
es levantar más instancias, sin cambiar código (DA01). En la etapa inicial basta
con una instancia en un servicio económico (RC14).
