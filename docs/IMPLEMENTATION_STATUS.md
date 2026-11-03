# Estado de implementación

Actualizado tras el cierre de la **Fase 1** y el rebranding visual a **Trazo**.

## Rebranding Trazo — completado

| Tarea | Resultado | Commits |
| --- | --- | --- |
| Identidad, paleta y guía de marca | `TRAZO_BRAND_GUIDELINES.md`, `PRODUCT.md` actualizado | `d8f7d8c` |
| Tokens terracota + Manrope + favicon + metadatos | Design system aplicado | `942baaf` |
| Colores genéricos reemplazados por tokens semánticos | Badges, estados, tablas | `2eb0c86` |
| Sidebar flotante y drawer con identidad Trazo | Logo, wordmark y estado activo terracota | `db4cd1f` |
| Topbar flotante independiente | Breadcrumb, indicador demo y alertas | `78e8c11` |
| Gráficos con la nueva paleta | Recharts actualizado | `85f5278` |
| Dashboard editorial | Saludo, KPI destacada, timeline y superficies | `9ff2bc2` |
| Pruebas de contraste AA y marca | 8 archivos, 43 pruebas | `3b5a011` |
| Rail compacto desde tablet | Responsive desde 768 px | `154202c` |

## Fase 1 — completada

| Tarea | Resultado | Verificación | Commit |
| --- | --- | --- | --- |
| Workspace Vite + React + TypeScript, alias, ESLint/Prettier/Vitest | Listo | `lint`, `typecheck` | `dc350b0` |
| Tokens de diseño Trazo y primitivas shadcn/ui | Listo | revisión visual | `dc350b0` |
| Modelos de dominio, utilidades de dinero y fechas | Listo | unit tests | `f16a5e2` |
| Dataset determinista (50 proyectos, alertas, actividad) | Listo | unit tests de determinismo y coherencia | `f16a5e2` |
| Contratos de repositorio + adaptadores mock con IndexedDB | Listo | tests contra `fake-indexeddb` | `f16a5e2` |
| App shell: sidebar, topbar, drawer móvil, breadcrumbs, 404 | Listo | smoke test de rutas | `13de103` |
| Dashboard: KPIs, 3 gráficos, tabla de atención, actividad | Listo | smoke test de render | `13de103` |
| Filtro de periodo en URL y recálculo de indicadores | Listo | verificación manual | `13de103` |
| Pruebas unitarias y de render | 43 tests en verde | `npm run test` | `3b5a011` |
| Documentación (README, arquitectura, design system, ADRs) | Listo | revisión | este commit |

### Verificación ejecutada

```text
npm run lint       → 0 errores, 0 advertencias
npm run typecheck  → sin errores
npm run test       → 8 archivos, 43 pruebas aprobadas
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
