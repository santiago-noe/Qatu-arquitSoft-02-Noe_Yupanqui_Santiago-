# Integración continua de Qatu

El workflow `.github/workflows/ci.yml` se ejecuta con cada push a cualquier rama, cada pull request dirigido a `main` y manualmente desde GitHub → Actions → CI Qatu → Run workflow. Los pushes de etiquetas no disparan este workflow. No hace commits, merges, pushes ni despliegues.

## Ramas por especificación

`main` conserva el trabajo integrado. Cada especificación se desarrolla en su propia rama, con el mismo nombre de su carpeta: por ejemplo, `004-catalogo-publicaciones` corresponde a `specs/004-catalogo-publicaciones/`. No hace falta una rama `develop` compartida. Para infraestructura transversal se usa una rama descriptiva, como `chore/ci-github-actions`.

Flujo acordado: rama de la especificación → commits pequeños → push a esa rama → CI verde → pull request hacia `main` → CI del pull request verde → merge. El push valida el trabajo aislado y el evento `pull_request` comprueba su integración con la rama destino. Que el push haya pasado no sustituye los checks del pull request; cada commit nuevo debe volver a validarse.

Antes de empezar una especificación, con el árbol de trabajo limpio:

```powershell
git switch main
git pull --ff-only origin main
git switch -c 004-catalogo-publicaciones
```

Durante el desarrollo, revisar `git status --short`, agregar solo archivos del cambio con `git add -- <rutas>` y crear commits con mensajes específicos. Para publicar la rama:

```powershell
git push -u origin 004-catalogo-publicaciones
```

Cuando Actions esté verde, abrir el pull request en GitHub con base `main` y compare `004-catalogo-publicaciones`. La plantilla del repositorio pide vincular la especificación, resumir los cambios y registrar la evidencia de pruebas. Si falla un check, corregir en esa misma rama, crear otro commit y hacer `git push`; el pull request se actualiza y el CI se repite.

Con los checks del pull request aprobados y la rama actualizada con `main`, fusionar desde GitHub. Usar **Create a merge commit** para conservar los commits individuales del avance; no usar squash si se quiere mantener ese historial. Si `main` cambió, actualizar la rama mediante **Update branch** o un merge de `origin/main` en la rama secundaria y esperar otra ejecución satisfactoria. No hacer force push a `main` ni fusionar cambios con checks pendientes o fallidos.

Después del merge, volver a `main` y ejecutar `git pull --ff-only origin main` antes de iniciar la siguiente especificación. Si ya hay cambios sin commit, no ejecutar pull sobre ellos: crear primero su rama con `git switch -c <rama-del-avance>` y guardarlos allí.

## Comprobaciones

| Check | Alcance |
| --- | --- |
| Especificaciones y evidencias | Validador oficial de los artefactos Spec Kit y detector de tokens Mapbox versionados, sin reescribir archivos. Este detector no sustituye un escáner general de secretos. |
| Backend e integración PostgreSQL | Instalación con lockfile, compilación, migraciones repetidas para comprobar idempotencia y pruebas con `TEST_DATABASE_URL` definida para no omitir la integración. |
| Frontend y recorridos de navegador | Instalación de ambas aplicaciones, migraciones, Chromium, compilación y tipos; suites de descubrimiento, diseño de acceso, usuarios y proveedores. |

Los jobs usan Ubuntu 24.04 y Node.js 24. Cada job de integración tiene su propio servicio PostGIS 17/3.5, con base desechable y healthcheck. Las credenciales `qatu_ci` son solo para estos servicios efímeros; no se conectan a la base local ni a producción.

Las claves JWT y de documentos de navegador se generan aleatoriamente para cada ejecución. No se necesita subir `.env` ni configurar secretos de producción en GitHub. Se emplea `pull_request`, no `pull_request_target`, con permisos de solo lectura y sin conservar credenciales de checkout. Los pull requests externos pueden requerir aprobación del mantenedor para ejecutar Actions.

Playwright utiliza el Chromium instalado por su CLI en CI/Linux; mantiene Chrome local en Windows y permite sobrescribir el ejecutable mediante `QATU_BROWSER`. Cada suite escribe trazas en un subdirectorio distinto de `frontend/test-results/`; las capturas existentes conservan sus nombres. Actions guarda esas evidencias durante siete días, incluso si una suite falla. Solo se usan cuentas y documentos sintéticos. No se publican `.env`, volcados de base de datos ni archivos reales de identidad.

## Activarlo y proteger main

1. Subir el workflow y sus archivos de soporte en `chore/ci-github-actions`, esperar el CI de esa rama y abrir su pull request hacia `main`. Los avances de este CI que todavía estén sin commit en `main` pueden trasladarse creando esa rama sin descartar archivos.
2. Abrir la pestaña Actions y revisar la primera ejecución de CI Qatu; cada check debe quedar verde. El workflow no puede validarse remotamente hasta publicarlo.
3. En Settings → Rules → Rulesets, crear o ajustar una regla de ramas para `main`, con estado **Active**: exigir **Require a pull request before merging**, **Require status checks to pass** y **Require branches to be up to date before merging**. Agregar los tres checks de esta guía con GitHub Actions como origen; seleccionar sus nombres tal como aparecen después de la primera ejecución. No configurar bypass si se quiere aplicar también al propietario. Mantener bloqueados los force pushes y la eliminación de `main`.
4. En Settings → General → Pull Requests, habilitar **Allow merge commits** para conservar los commits individuales. No exigir una aprobación de otro revisor si se trabaja solo: el autor no puede aprobar su propio pull request; la revisión de otra persona se añade cuando exista otro colaborador.
5. Repetir el flujo por cada especificación. El archivo YAML ejecuta las comprobaciones, pero no configura estas reglas remotas: deben activarse en GitHub. Sin reglas activas, un check rojo no impide por sí solo el merge ni bloquea un push directo a `main`. Si la cuenta/repositorio no permite rulesets, revisar la protección de ramas disponible en su plan.

Si una prueba falla, abrir el job y el paso correspondiente; descargar `evidencias-navegador` para revisar capturas/trazas. Una ejecución nueva en la misma rama cancela la anterior para evitar trabajo duplicado. No se habilitan reintentos automáticos que oculten fallos.

Referencias: [servicios PostgreSQL en GitHub Actions](https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/creating-postgresql-service-containers), [Playwright en CI](https://playwright.dev/docs/ci), [protección de ramas y checks requeridos](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule).
