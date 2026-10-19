# Validación y recorrido — Proveedores y verificación

## Preparación

No hay aplicación ejecutable todavía. Al implementar, completar aquí los comandos reales del repositorio; no se inventan npm scripts. Preparar entorno aislado con PostgreSQL, migraciones y usuarios de prueba con roles distintos. Nunca usar pagos reales ni archivos personales para la aceptación académica.

## Recorridos

1. US1: dado una cuenta activa, completo perfil y distrito; comprobar que se registra un perfil propio sin duplicarlo.
2. US2: dado documentos privados remitidos, apruebo o rechazo con motivo; comprobar que el resultado queda auditado y solo una aprobación válida habilita publicación.
3. US3: dado un perfil visible, consulto sus datos; comprobar que veo información pública y estado real, nunca documentos privados.

## Casos críticos

- Perfil duplicado y usuario inexistente/inactivo.
- Acceso a documento propio, ajeno y administrativo; URL no pública.
- Fallo de mapas conserva selección manual; estado de verificación no modificable por cliente.

## Registro de resultados

| Campo | Valor |
|---|---|
| Commit/versiones/entorno | Pendiente |
| Fixture y condiciones | Pendiente |
| Comandos ejecutados | Pendiente |
| Resultados positivos/negativos | Pendiente |
| Medidas EQ-04/EQ-05/EQ-06 | Pendiente |
| Limitaciones y fallos | Pendiente |

[Escenarios fuente](../../docs/01-analisis-de-sistema/08-escenarios-atributos-calidad.md) · [Plan](./plan.md).
