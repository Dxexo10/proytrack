# Arquitectura — Trazo (frontend-first)

## Objetivo

Construir el frontend completo con datos simulados de modo que la sustitución
por una API REST real no obligue a reescribir vistas, hooks ni reglas de negocio.

## Capas

```text
src/features/**          Pantallas, componentes de dominio y hooks de datos
src/components/**        UI reutilizable (ui/ shadcn, shared/, charts/)
src/domain/**            Modelos, reglas puras y servicios de agregación
src/data/**              Contratos de repositorio + implementación mock
src/lib/**               Configuración de la demo, etiquetas y utilidades de UI
src/app/**               Router, providers, layout y puntos de entrada
```

Flujo de una consulta:

```text
DashboardPage
  └─ useDashboardSummary(periodo)          (TanStack Query)
      └─ projectRepository.getAll()         (contrato)
      └─ alertRepository.getAll()           (contrato)
      └─ activityRepository.list()          (contrato)
          └─ Mock*Repository + IndexedDB    (adaptador Fase 1)
      └─ buildDashboardSummary(...)         (función pura, testeable)
```

## Contratos

Definidos en `src/data/contracts`:

- `ProjectRepository`: `list`, `getAll`, `getById`, `create`, `update`, `archive`,
  `listVersions`. `update` aplica el estado, crea la versión y devuelve
  `ProjectUpdateResult` con cambios y alertas generadas.
- `VersionRepository`: `getAll`, `getById`, `listByProject`, `list`.
- `ChangeEventRepository`: `getAll`, `listByProject`, `listByVersion`, `list`.
- `RuleConfigRepository`: `list`, `update`.
- `AlertRepository`: `list`, `getAll`, `getById`, `updateStatus`, `countOpen`.
- `ActivityRepository`: `list`, `getAll`.

`src/data/index.ts` es el **único punto de composición**. En la Fase 5 basta con
implementar `HttpProjectRepository`, `HttpAlertRepository` y
`HttpActivityRepository` contra `/api/v1` y cambiar esas tres líneas.

## Dominio

- `domain/models`: entidades serializables (dinero en céntimos, fechas ISO).
- `domain/services/project-metrics`: vencimiento, variación presupuestal y
  puntuación de riesgo explicable.
- `domain/services/project-diff`: compara los campos auditables y produce los
  eventos de cambio.
- `domain/services/change-rules`: evalúa presupuesto, fecha, vencimiento,
  bloqueo y prioridad contra `RuleConfig`; una sola alerta de presupuesto por
  transición.
- `domain/services/change-feed`: une cambios, versiones, proyectos, actores y
  alertas para monitor; filtros y paginación puros.
- `domain/services/dashboard-summary`: agrega KPIs, series y distribuciones a
  partir de proyectos y alertas. Sin acceso a red, 100 % testeable.
- `domain/utils`: formato de moneda (`Intl.NumberFormat('es-PE')`), fechas y
  utilidades de identificadores.

## Persistencia

`data/mock/storage/db.ts` abre IndexedDB (`trazo-demo`, versión 2) con los
stores `projects`, `versions`, `changes`, `alerts`, `activity`, `rules` y
`meta`. En el primer acceso, o cuando cambia `seedVersion` / `schemaVersion` /
`referenceDate`, se vuelve a sembrar el dataset determinista. La versión de
semilla actual es 3.

La edición de un proyecto es un único caso de uso transaccional
(`data/mock/services/apply-project-update.ts`): actualiza el proyecto, guarda la
versión inmutable, escribe un `ChangeEvent` por campo, evalúa las reglas,
deduplica alertas por `(projectId, versionId, ruleId)` y registra la actividad.
El dataset inicial recorre el mismo diff/motor para que versiones, cambios y
alertas sean coherentes desde el primer render.

Los adaptadores simulan latencia de 120–320 ms **solo en desarrollo**; en tests y
producción no hay esperas artificiales.

## Renderizado

- Rutas con carga diferida (`React.lazy` + `Suspense`).
- Gráficos cargados aparte del dashboard para no bloquear el primer render.
- Chunks de vendor separados (React, UI, charts, query).
- Providers: TanStack Query, Tooltip y Toaster (sonner).

## Reglas de negocio implementadas en Fase 3

- Presupuesto: alerta desde cero, advertencia > 10 % y crítica > 20 % respecto a
  la versión anterior; exactamente 20 % se queda en advertencia.
- Fecha de entrega postergada, proyecto vencido, estado bloqueado y prioridad
  crítica.
- Sin cambios en los campos auditables no hay versión ni alerta.
- Idempotencia por `(projectId, versionId, ruleId)`.

## Reglas de negocio implementadas en Fase 1

- KPIs siempre calculados desde el mismo estado que la tabla y la actividad.
- Variación presupuestal `(actual − inicial) / inicial`; si la base es 0 no se
  calcula porcentaje y se muestra un caso explícito.
- Riesgo de proyecto: vencimiento (+40), bloqueo (+30), prioridad crítica (+15),
  sobrecosto >20 % (+15) o >10 % (+8), avance <30 % en ejecución (+10).
- Periodo del dashboard = ventana de meses sobre `createdAt` para la tendencia
  mensual y los deltas contra la ventana anterior. Los totales, la distribución
  y las alertas representan el portafolio activo completo.

## Verificación

```bash
npm run lint
npm run typecheck
NODE_ENV=test npm run test
npm run build
```
