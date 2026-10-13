# 04 - Modelo C4 de Qatu

Cuatro niveles de estructura: contexto, contenedores, componentes y código. C4 no exige una herramienta o notación particular; usamos Mermaid con tipo/responsabilidad explícitos y UML para código. Secuencias y despliegue son vistas complementarias.

| Vista | Pregunta | Documento |
|---|---|---|
| Nivel 1 | ¿Quién usa Qatu y con qué sistemas se integra? | [Contexto](./Nivel1-DiagramadeContextodelSistema.md) |
| Nivel 2 | ¿Qué aplicaciones y almacenes forman Qatu? | [Contenedores](./Nivel2-DiagramadeContenedores.md) |
| Nivel 3 | ¿Cómo se organiza la API en seis módulos? | [Componentes](./Nivel3-Diagrama-de-Componentes.md) |
| Nivel 4 | ¿Cómo colaboran clases y puertos críticos? | [Código](./Nivel4-DiagramadeCodigo.md) |
| Despliegue | ¿Dónde se ejecuta la primera versión? | [VPS](./despliegue-vps.md) |

[Fuentes editables](./diagramas/README.md) · [Diseño interno](../03-diseño-de-software/README.md).

Fuentes oficiales: [diagramas C4](https://c4model.com/diagrams), [componentes](https://c4model.com/diagrams/component) y [notación](https://c4model.com/diagrams/notation), consultadas el 13/10/2026. Los componentes comparten proceso; contenedores son unidades de ejecución/almacenamiento y no equivalen necesariamente a Docker.
