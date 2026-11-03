# Design system — ProyTrack

Fuente: `PROYTRACK_MASTER_SPEC.md` §3. Implementación: `frontend/src/styles/tokens.css`.

## Paleta

| Token | HEX | Uso |
| --- | --- | --- |
| `--brand-navy` | `#0F172A` | Sidebar, títulos, marca |
| `--brand-primary` | `#2563EB` | CTAs, enlaces, datos activos |
| `--brand-primary-hover` | `#1D4ED8` | Hover de CTA |
| `--canvas` | `#F8FAFC` | Fondo de la app |
| `--surface` | `#FFFFFF` | Tarjetas, tablas, paneles |
| `--text-primary` | `#0F172A` | Texto principal |
| `--text-secondary` | `#64748B` | Texto secundario |
| `--border` | `#E2E8F0` | Bordes y divisores |
| `--success` | `#10B981` | Completado, variación positiva |
| `--warning` | `#F59E0B` | Riesgo moderado |
| `--danger` | `#EF4444` | Errores y riesgo alto |
| `--info` | `#3B82F6` | Información |
| `--focus` | `#93C5FD` | Anillo de foco |

Los tokens de shadcn (`--background`, `--primary`, `--card`, `--border`, `--ring`,
`--sidebar`…) se mapean sobre esta paleta para que las primitivas hereden la
identidad sin estilos ad-hoc.

## Tipografía

- **Inter Variable** autohospedada (sin CDN).
- Títulos: 600–700; cuerpo: 400–500.
- Escala: 12 · 14 · 16 · 18 · 20 · 24 · 28 · 36 px.
- Cifras de KPI con `tabular-nums` para evitar saltos al actualizar.

## Espaciado, radios y sombras

- Espaciado en múltiplos de 4 px (4 / 8 / 12 / 16 / 24 / 32).
- Radios: 8 px controles, 12 px tarjetas, 16 px paneles.
- Sombras discretas; el borde `#E2E8F0` hace el trabajo pesado.

## Layout

| Breakpoint | Sidebar | Contenido |
| --- | --- | --- |
| < 1024 px | Drawer (`Sheet`) | 1 columna, tablas con scroll |
| 1024–1279 px | Compacta 72 px | KPIs 2 columnas |
| ≥ 1280 px | Fija 256 px | KPIs 4 columnas, 3 columnas de paneles |

Topbar de 64 px, contenedor máximo 1600 px, padding 24–32 px.

## Componentes clave

- `KpiCard`: etiqueta, valor tabular, icono discreto, delta contextual y enlace
  al listado filtrado.
- `StatusBadge` / `PriorityBadge`: color **+ icono + texto** (nunca solo color).
- `SectionCard`, `ChartCard`: cabecera con título, descripción y acción.
- `EmptyState`, `ErrorState` (con reintento), `Skeleton` por tarjeta.
- `DemoBadge`: rotulación permanente de entorno simulado.
- `ProgressBar`: accesible con `role="progressbar"` y valores ARIA.

## Accesibilidad

- Skip-link al contenido, `aria-current="page"` en navegación.
- Foco visible con anillo `--focus`; contraste ≥ 4.5:1 en texto normal.
- Gráficos con leyenda y resumen textual `sr-only`.
- `prefers-reduced-motion` desactiva animaciones.
- Formularios (Fase 2) asociarán etiqueta, ayuda y error.
