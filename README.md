# Qatu: alquiler de herramientas y servicios de oficios en Ayacucho

Proyecto final de Arquitectura de Software (IS-488), Noe Yupanqui Santiago. Entrega prevista: fines de noviembre de 2026; fecha exacta por confirmar.

## Alcance

La integración continua de GitHub Actions valida especificaciones, backend con PostgreSQL y frontend con navegador en pushes a todas las ramas y pull requests hacia `main`. Cada especificación se desarrolla en su propia rama; requiere CI verde en la rama secundaria y en el pull request antes del merge a `main`, conservando sus commits individuales. Flujo de trabajo y configuración de las reglas remotas necesarias: [guía de CI](.github/CI.md).

MVP web para publicar, buscar, solicitar, pagar y completar alquileres de herramientas o servicios de oficios en Ayacucho. Incluye búsqueda en lenguaje natural, confianza y evidencias. Compraventa y otras categorías de la propuesta quedan como evolución futura.

Web Next.js/React/TypeScript; API NestJS/TypeScript como monolito modular; PostgreSQL/PostGIS; pasarela Culqi candidata con Yape como medio habilitado; despliegue inicial VPS con Docker Compose.

Estado (2026-10-19): prototipo 001 con catálogo sintético, Usuarios 002 y flujos locales de Proveedores 003 implementados con API NestJS y PostgreSQL. Registro, sesión, perfil, administración de cuentas, perfiles de proveedor y revisión documental privada con historial. /proveedor y /admin/proveedores complementan /cuenta y /admin/usuarios. Conservación de archivos elegida por el usuario: mientras siga activo, con limpieza al iniciar y horaria. Catálogo/reservas/pagos, mapas externos y política operativa D02 pendientes. Las metas de calidad globales siguen por verificar; evidencia en specs/002-usuarios-acceso/quickstart.md y specs/003-proveedores-verificacion/quickstart.md.

## Documentación

Este README es el índice global de las secciones 01–04. Los documentos se adaptan al dominio Qatu tomando como referencia Marketplace; no se incorporan ERP, carrito de compras ni courier al MVP.

```text
Qatu/
├── README.md
├── docs/
│   ├── 01-analisis-de-sistema/
│   ├── 02-arquitectura-software/
│   │   ├── diagramas/{png,svg,fuentes,scripts}/
│   │   └── historico/{archify,img}/
│   ├── 03-diseño-de-software/
│   │   ├── diseño-interno/
│   │   └── diseño-externo/
│   └── 04-modelo-c4/
│       └── diagramas/
├── specs/          Especificaciones SDD de trabajo local
├── frontend/       Web de descubrimiento y cuentas
├── backend/        API NestJS, módulo usuarios y migraciones
└── compose.yaml    PostgreSQL/PostGIS para desarrollo local
```

## Analisis del sistema

1. [Actores](./docs/01-analisis-de-sistema/01-actores.md).
2. [Historias de usuario](./docs/01-analisis-de-sistema/02-historias-del-usuario.md).
3. [Requisitos funcionales](./docs/01-analisis-de-sistema/03-requisitos-funcionales.md).
4. [Atributos de calidad](./docs/01-analisis-de-sistema/04-atributos-de-calidad.md).
5. [Restricciones](./docs/01-analisis-de-sistema/05-restricciones.md).
6. [Drivers arquitectónicos](./docs/01-analisis-de-sistema/06-driver-arquitectonicos.md).
7. [Decisiones arquitectónicas](./docs/01-analisis-de-sistema/07-desision-arquitectonica.md).
8. [Escenarios de atributos de calidad](./docs/01-analisis-de-sistema/08-escenarios-atributos-calidad.md).

## Arquitectura de software

1. [Arquitectura inicial](./docs/02-arquitectura-software/arquitectura-inicial.md): actores, aplicaciones, módulos e integraciones.
2. [Estilo arquitectónico](./docs/02-arquitectura-software/estilo-arquitectonico.md): cliente-servidor y monolito modular.
3. [Enfoque arquitectónico](./docs/02-arquitectura-software/enfoque-arquitectonico.md): Clean Architecture y dependencias.
4. [Componentes arquitectónicos](./docs/02-arquitectura-software/componentes-arquitectonicos.md): responsabilidades y contratos.

Los seis módulos son Usuarios, Proveedores, Catálogo, Reservas, Reputación/confianza (resenas) y Búsqueda inteligente (busqueda). Pagos y calendario pertenecen a Reservas. Administración es una interfaz con permisos; mensajería, mapas y archivos son soporte técnico.

### Diagramas de arquitectura

| Vista | Imagen | Vector | Editable |
|---|---|---|---|
| Arquitectura inicial | [PNG](./docs/02-arquitectura-software/diagramas/png/arquitectura-inicial-qatu.png) | [SVG](./docs/02-arquitectura-software/diagramas/svg/arquitectura-inicial-qatu.svg) | [drawio](./docs/02-arquitectura-software/diagramas/fuentes/arquitectura-inicial-qatu.drawio) |
| Enfoque arquitectónico | [PNG](./docs/02-arquitectura-software/diagramas/png/enfoque-arquitectonico-qatu.png) | [SVG](./docs/02-arquitectura-software/diagramas/svg/enfoque-arquitectonico-qatu.svg) | [drawio](./docs/02-arquitectura-software/diagramas/fuentes/enfoque-arquitectonico-qatu.drawio) |
| Estilo arquitectónico | [PNG](./docs/02-arquitectura-software/diagramas/png/estilo-arquitectonico-qatu.png) | [SVG](./docs/02-arquitectura-software/diagramas/svg/estilo-arquitectonico-qatu.svg) | [drawio](./docs/02-arquitectura-software/diagramas/fuentes/estilo-arquitectonico-qatu.drawio) |
| Componentes C4 nivel 3 | [PNG](./docs/02-arquitectura-software/diagramas/png/componentes-qatu.png) | [SVG](./docs/02-arquitectura-software/diagramas/svg/componentes-qatu.svg) | [drawio](./docs/02-arquitectura-software/diagramas/fuentes/componentes-qatu.drawio) |

Abrir drawio en diagrams.net: Archivo → Abrir desde → Dispositivo. PNG sirve para informes; SVG conserva nitidez. Las fuentes JSON contienen posiciones y textos de los renderizadores. Azul oscuro: personas; azul medio: aplicaciones/almacenes; azul claro: capas/módulos; gris: sistemas externos. Las flechas representan imports en el enfoque y llamadas en las vistas general/de estilo.

Para regenerar PNG desde la raíz de Qatu, con PowerShell en Windows:

```powershell
& "./docs/02-arquitectura-software/diagramas/scripts/render-arquitectura.ps1" -GraphDirectory "./docs/02-arquitectura-software/diagramas/fuentes" -ImageDirectory "./docs/02-arquitectura-software/diagramas/png" -VectorDirectory "./docs/02-arquitectura-software/diagramas/svg"

& "./docs/02-arquitectura-software/diagramas/scripts/render-componentes.ps1" -GraphPath "./docs/02-arquitectura-software/diagramas/fuentes/componentes-qatu.json" -OutputPath "./docs/02-arquitectura-software/diagramas/png/componentes-qatu.png"
```

Los renderizadores generan PNG desde JSON. Mantener SVG y drawio sincronizados cuando se edite una vista.

### Historico de arquitectura

Los archivos de historico son versiones anteriores; pueden mostrar cinco módulos y no sustituyen los documentos actuales.

- [Arquitectura anterior Archify](./docs/02-arquitectura-software/historico/archify/arquitectura-inicial.html) y [fuente JSON](./docs/02-arquitectura-software/historico/archify/arquitectura-inicial.architecture.json).
- [Cliente Next.js anterior](./docs/02-arquitectura-software/historico/archify/estructura-cliente-web-nextjs.html) y [fuente JSON](./docs/02-arquitectura-software/historico/archify/estructura-cliente-web-nextjs.architecture.json).
- [Monolito en capas anterior](./docs/02-arquitectura-software/historico/img/monolito-modular-en-capas.png).
- [Estructura del cliente anterior](./docs/02-arquitectura-software/historico/img/estructura-cliente-web-nextjs.png).

## Diseno de software

- [Principios SOLID](./docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md).
- [Patrones de diseño](./docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md).
- [Diseño interno de los seis módulos](./docs/03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md).
- [Contratos REST](./docs/03-diseño-de-software/diseño-externo/contratos-api.md).
- [Modelo de datos](./docs/03-diseño-de-software/modelo-de-datos.md).
- [Validación del diseño](./docs/03-diseño-de-software/validacion-del-diseno.md).

## Modelo C4

| Nivel | Pregunta | Documento |
|---|---|---|
| 1 | ¿Quién usa Qatu y con qué sistemas se integra? | [Contexto](./docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md) |
| 2 | ¿Qué aplicaciones y almacenes forman Qatu? | [Contenedores](./docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md) |
| 3 | ¿Cómo se organiza la API? | [Componentes](./docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md) |
| 4 | ¿Cómo colaboran las clases y puertos? | [Código](./docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md) |
| Complementaria | ¿Dónde se ejecuta? | [Despliegue VPS](./docs/04-modelo-c4/despliegue-vps.md) |

Archify genera las vistas estructurales y UML en PNG, con visor HTML y fuentes JSON editables. Secuencias y despliegue son vistas complementarias. Los contenedores C4 son unidades de ejecución/almacenamiento, no necesariamente contenedores Docker. Los componentes de la API comparten proceso.

Los documentos muestran PNG de alta resolución desde [diagramas/png](./docs/04-modelo-c4/diagramas/png). Editar las fuentes en [diagramas/fuentes](./docs/04-modelo-c4/diagramas/fuentes), regenerar con Archify y descargar el PNG desde su visor HTML. Los archivos .mmd previos se conservan como referencia histórica. Referencia: [C4](https://c4model.com/diagrams).

## Desarrollo local

Las especificaciones están en specs/; constitución y herramientas SDD en .specify/ y .claude/skills/. El prototipo está en frontend/. Estos recursos complementan los documentos 01–04.

Desde la raíz del repositorio, con Node.js 22 o superior:

```powershell
cd frontend
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000. El catálogo conserva datos sintéticos. Para habilitar /registro, /ingresar y /cuenta, preparar PostgreSQL, configurar backend/.env, ejecutar npm run migrate y npm run dev desde backend siguiendo [las instrucciones de la API](./backend/README.md). La web reenvía /api/v1 al backend local en el puerto 3001. No hay secretos de desarrollo preconfigurados.

Proveedores: desde /cuenta crear el perfil con distrito manual, elegir su visibilidad y solicitar revisión documental. Un administrador diferente revisa en /admin/proveedores. Para habilitar documentos, configurar DOCUMENTOS_KEY estable y protegida según [la guía de Proveedores](./backend/PROVEEDORES.md); sin ella los perfiles funcionan pero no se admiten adjuntos. Los documentos no se incluyen en páginas públicas ni fixtures del catálogo.
