# Estado de implementación

Actualizado al cierre de la **Fase 1 · Fundamentos + Dashboard**.

## Fase 1 — completada

| Tarea | Resultado | Verificación | Commit |
| --- | --- | --- | --- |
| Workspace Vite + React + TypeScript, alias, ESLint/Prettier/Vitest | Listo | `lint`, `typecheck` | `a88316d` |
| Tokens de diseño ProyTrack y primitivas shadcn/ui | Listo | revisión visual | `a88316d` |
| Modelos de dominio, utilidades de dinero y fechas | Listo | unit tests | `ec78075` |
| Dataset determinista (50 proyectos, alertas, actividad) | Listo | unit tests de determinismo y coherencia | `ec78075` |
| Contratos de repositorio + adaptadores mock con IndexedDB | Listo | tests contra `fake-indexeddb` | `ec78075` |
| App shell: sidebar, topbar, drawer móvil, breadcrumbs, 404 | Listo | smoke test de rutas | `5629a33` |
| Dashboard: KPIs, 3 gráficos, tabla de atención, actividad | Listo | smoke test de render | `5629a33` |
| Filtro de periodo en URL y recálculo de indicadores | Listo | verificación manual | `5629a33` |
| Pruebas unitarias y de render | 28 tests en verde | `npm run test` | `6ddec5e` |
| Documentación (README, arquitectura, design system, ADRs) | Listo | revisión | este commit |

### Verificación ejecutada

```text
npm run lint       → 0 errores, 0 advertencias
npm run typecheck  → sin errores
npm run test       → 6 archivos, 28 pruebas aprobadas
npm run build      → dist generado (chunks separados por vendor y ruta)
```

Tamaño del build (gzip): React 150 kB · UI 54 kB · charts 130 kB (diferido) ·
app 35 kB · dashboard 8 kB.

## Pendiente inmediato (Fase 2)

- Listado de proyectos con TanStack Table, búsqueda y filtros en URL.
- Formulario crear/editar con React Hook Form + Zod y validaciones.
- Archivado lógico y detalle con pestaña Resumen.
- Enlaces del dashboard (`/projects?estado=…`, `/projects?riesgo=alto`) que hoy
  apuntan a una página de próxima fase.

## Pendiente posterior

- **Fase 3:** versiones inmutables, comparador antes/después, motor de reglas,
  alertas accionables, monitor e historial.
- **Fase 4:** actividad, configuración y reset demo, escenarios, accesibilidad AA,
  E2E con Playwright, CI y capturas reales en el README.
- **Fases 5–7:** API Express, Prisma + PostgreSQL, adaptador HTTP y despliegue.

## Bloqueos conocidos

- Ninguno funcional. El entorno local define `NODE_ENV=production`, por lo que
  hay que instalar con `npm install --include=dev`.
- `agent-browser` no está instalado en la máquina, así que las capturas de
  pantalla quedan pendientes para la fase de QA.
