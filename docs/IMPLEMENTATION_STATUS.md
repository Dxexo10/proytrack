# Estado de implementación

Actualizado tras el cierre de la **Fase 3** y el rebranding visual a **Trazo**.

## Rebranding Trazo — completado

| Tarea                                                | Resultado                                             | Commits   |
| ---------------------------------------------------- | ----------------------------------------------------- | --------- |
| Identidad, paleta y guía de marca                    | `TRAZO_BRAND_GUIDELINES.md`, `PRODUCT.md` actualizado | `d8f7d8c` |
| Tokens terracota + Manrope + favicon + metadatos     | Design system aplicado                                | `942baaf` |
| Colores genéricos reemplazados por tokens semánticos | Badges, estados, tablas                               | `2eb0c86` |
| Sidebar flotante y drawer con identidad Trazo        | Logo, wordmark y estado activo terracota              | `db4cd1f` |
| Topbar flotante independiente                        | Breadcrumb, indicador demo y alertas                  | `78e8c11` |
| Gráficos con la nueva paleta                         | Recharts actualizado                                  | `85f5278` |
| Dashboard editorial                                  | Saludo, KPI destacada, timeline y superficies         | `9ff2bc2` |
| Pruebas de contraste AA y marca                      | 8 archivos, 43 pruebas                                | `3b5a011` |
| Rail compacto desde tablet                           | Responsive desde 768 px                               | `154202c` |

## Fase 1 — completada

| Tarea                                                              | Resultado         | Verificación                            | Commit      |
| ------------------------------------------------------------------ | ----------------- | --------------------------------------- | ----------- |
| Workspace Vite + React + TypeScript, alias, ESLint/Prettier/Vitest | Listo             | `lint`, `typecheck`                     | `dc350b0`   |
| Tokens de diseño Trazo y primitivas shadcn/ui                      | Listo             | revisión visual                         | `dc350b0`   |
| Modelos de dominio, utilidades de dinero y fechas                  | Listo             | unit tests                              | `f16a5e2`   |
| Dataset determinista (50 proyectos, alertas, actividad)            | Listo             | unit tests de determinismo y coherencia | `f16a5e2`   |
| Contratos de repositorio + adaptadores mock con IndexedDB          | Listo             | tests contra `fake-indexeddb`           | `f16a5e2`   |
| App shell: sidebar, topbar, drawer móvil, breadcrumbs, 404         | Listo             | smoke test de rutas                     | `13de103`   |
| Dashboard: KPIs, 3 gráficos, tabla de atención, actividad          | Listo             | smoke test de render                    | `13de103`   |
| Filtro de periodo en URL y recálculo de indicadores                | Listo             | verificación manual                     | `13de103`   |
| Pruebas unitarias y de render                                      | 43 tests en verde | `npm run test`                          | `3b5a011`   |
| Documentación (README, arquitectura, design system, ADRs)          | Listo             | revisión                                | este commit |

### Verificación ejecutada

```text
npm run lint       → 0 errores, 0 advertencias
npm run typecheck  → sin errores
npm run test       → 11 archivos, 57 pruebas aprobadas
npm run build      → dist generado (chunks separados por vendor y ruta)
```

Tamaño del build (gzip): React 150 kB · UI 54 kB · charts 130 kB (diferido) ·
app 35 kB · dashboard 8 kB.

## Fase 2 — completada

| Tarea                                                           | Resultado                                                                                  | Commits   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| Filtros de portafolio en URL, consultas y esquema de formulario | Búsqueda, estado, prioridad, sector, responsable, riesgo, archivados, orden y paginación   | `246f902` |
| Listado `/projects`                                             | Tabla desktop, tarjetas móviles, archivado con confirmación, estados de carga/vacío/error  | `f88bfc6` |
| Alta y edición                                                  | Formulario compartido con Zod, presupuesto, cronograma y protección de cambios sin guardar | `a4c03cb` |
| Detalle `/projects/:id`                                         | KPIs, alcance, presupuesto, alertas, actividad y pestañas de Fase 3                        | `47b7979` |
| Pruebas de Fase 2                                               | Filtros, validación, render del listado y detalle                                          | `a0196b0` |

## Fase 3 — completada

| Tarea                       | Resultado                                                                                                           | Commits     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| Dominio de cambios          | Diff de campos auditables, motor de reglas con umbrales, feed enriquecido y etiquetas                               | `ceabe23`   |
| Persistencia                | Stores de versiones, cambios y reglas; esquema 2 y semilla 3; actualización transaccional y seed derivado del motor | `1d24439`   |
| Detalle del proyecto        | Historial de versiones, comparador antes/después, motivo opcional y badges compartidos                              | `1759148`   |
| Monitor `/monitor`          | Feed agrupado por fecha, filtros en URL, detalle del cambio y paginación                                            | `9105c64`   |
| Centro de alertas `/alerts` | Contadores, filtros, regla de origen y acciones revisar/resolver con auditoría                                      | `04f280c`   |
| Documentación y navegación  | README, arquitectura, estado y badges de fase actualizados                                                          | este commit |

### Verificación ejecutada

```text
npm run lint       → 0 errores, 0 advertencias
npm run typecheck  → sin errores
NODE_ENV=test npm run test → 20 archivos, 106 pruebas aprobadas
npm run build      → dist generado
```

Flujo manual comprobado en navegador: editar el presupuesto de `PRJ-001`
de S/ 4,200,000 a S/ 5,040,000 (+20 %) crea la versión 5, registra el evento
de presupuesto, genera la alerta de advertencia y la de proyecto vencido,
y actualiza monitor, centro de alertas, actividad y badge del topbar.
También se revisaron monitor, alertas, historial y comparador en 1440, 768
y 390 px.

## Fase 4 — completada en lo funcional

| Tarea                     | Resultado                                                                                        | Commits     |
| ------------------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| Actividad `/activity`     | Timeline de auditoría con filtros por proyecto, usuario, acción, origen y periodo; paginación    | este bloque |
| Configuración `/settings` | Perfil demo, dataset, umbrales y severidades de reglas editables                                 | este bloque |
| Reset demo                | Confirmación desde `/settings`; invalida todas las queries y vuelve al dataset inicial           | este bloque |
| E2E Playwright            | Configuración, script `test:e2e` y flujo estrella: editar → versión → alerta → monitor → revisar | este bloque |
| CI                        | Workflow de lint, typecheck, pruebas, build y E2E con reporte como artefacto                     | este bloque |
| Capturas reales           | 11 imágenes en `docs/screenshots/` y README actualizado                                          | este bloque |

### Verificación ejecutada

```text
npm run lint       → 0 errores, 0 advertencias
npm run typecheck  → sin errores
NODE_ENV=test npm run test → 23 archivos, 113 pruebas aprobadas
npm run test:e2e   → 2 pruebas aprobadas (Chromium)
npm run build      → dist generado
```

El flujo E2E arranca un servidor Vite en el puerto 4173, restablece el dataset,
edita `PRJ-001` de S/ 4,200,000 a S/ 5,040,000, comprueba la versión 5, la alerta,
el monitor y la acción de revisión. Un segundo test valida el reset.

## Pendiente inmediato

- Auditoría formal de accesibilidad AA (teclado, foco, lectores, contraste
  ampliado) y ampliar la E2E a móvil.
- Escenarios de simulación de actualizaciones y CTA en el monitor.
- Portada social y metadata del repositorio en GitHub; ejecutar el workflow CI
  tras el push.
- Guion de demo en `docs/DEMO_GUIDE.md`.

## Pendiente posterior

- **Fases 5–7:** API Express, Prisma + PostgreSQL, adaptador HTTP y despliegue.

## Bloqueos conocidos

- Ninguno funcional. El entorno local define `NODE_ENV=production`, por lo que
  hay que instalar con `npm install --include=dev` y ejecutar las pruebas con
  `NODE_ENV=test`.
- El cambio a esquema 2 / semilla 3 fuerza una resiembra del dataset demo y
  descarta ediciones locales previas (comportamiento esperado del entorno mock).
- La instalación de Google Chrome para Playwright requiere privilegios de
  administrador; se usan Chromium (E2E) y Edge (playwright-cli).
- La skill global `playwright-cli` vive en `~\.agents\skills\playwright-cli`.
