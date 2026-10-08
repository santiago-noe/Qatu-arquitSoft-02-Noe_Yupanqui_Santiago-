# 🔧 Qatu: plataforma de alquiler de herramientas y servicios de oficios en Ayacucho

## 📋 Información del proyecto

| Campo                     | Detalle                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| **Nombre del integrante** | Noe Yupanqui Santiago                                                                             |
| **Descripción**           | Plataforma web para alquilar herramientas y contratar servicios de oficios en Ayacucho.           |
| **Caso de estudio**       | Qatu, proyecto propio. Se toma la estructura de marketplace como referencia funcional.            |
| **Curso**                 | Arquitectura de Software (IS-488)                                                                 |

## 📖 Descripción

Qatu conecta a personas que necesitan una herramienta (taladro, amoladora, andamio, etc.) o un servicio de oficio (pintor, gasfitero, electricista, jardinero, etc.) con proveedores de Ayacucho que los ofrecen. Esta primera versión **no incluye compraventa de productos**: solo alquiler de herramientas y contratación de servicios.

## 🎯 Objetivo

Diseñar la arquitectura de software de Qatu a partir del análisis del sistema (actores, historias de usuario, requisitos, atributos de calidad, restricciones y drivers arquitectónicos), registrando las decisiones arquitectónicas (ADR) y aplicando un estilo **cliente-servidor + monolito modular en capas** con **Clean Architecture** para organizar las dependencias internas.

## 🗂️ Estructura del repositorio

```
├── analisis-de-sistema/
│   ├── 01-actores.md
│   ├── 02-historias-del-usuario.md
│   ├── 03-requisitos-funcionales.md
│   ├── 04-atributos-de-calidad.md
│   ├── 05-restricciones.md
│   ├── 06-driver-arquitectonicos.md
│   └── 07-desision-arquitectonica.md
└── arquitectura/
    ├── arquitectura-inicial.md
    ├── arquitectura-inicial.architecture.json
    ├── arquitectura-inicial.html
    ├── estilo-arquitectonico.md
    ├── estructura-cliente-web-nextjs.architecture.json
    ├── estructura-cliente-web-nextjs.html
    ├── enfoque/
    │   └── enfoque-arquitectonico.md
    └── img/
        ├── monolito-modular-en-capas.png
        └── estructura-cliente-web-nextjs.png
```

## 🧭 Recorrido sugerido

| Paso | Documento                                                                                  | Pregunta que responde                                  |
| ---- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1-6  | [`analisis-de-sistema/`](./analisis-de-sistema/)                                           | ¿Qué debe hacer el sistema y qué lo condiciona?        |
| 7    | [Decisiones arquitectónicas (ADR)](./analisis-de-sistema/07-desision-arquitectonica.md)    | ¿Qué decidimos y por qué?                              |
| 8    | [Arquitectura inicial](./arquitectura/arquitectura-inicial.md)                             | ¿Cuáles son las capas y los módulos?                   |
| 9    | [Estilo arquitectónico](./arquitectura/estilo-arquitectonico.md)                           | ¿Cómo estructuramos globalmente el sistema?            |
| 10   | [Enfoque arquitectónico](./arquitectura/enfoque/enfoque-arquitectonico.md)                 | ¿Cómo organizamos las dependencias internas?           |

Los archivos `.html` son los diagramas interactivos generados con archify a partir de sus `.architecture.json`; se abren directamente en el navegador.

---

**Curso:** Arquitectura de Software

**Integrante:** Noe Yupanqui Santiago
