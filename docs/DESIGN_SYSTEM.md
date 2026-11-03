# Design system — Trazo

Implementación: `frontend/src/styles/tokens.css`.
Identidad y criterios de marca: [`TRAZO_BRAND_GUIDELINES.md`](../TRAZO_BRAND_GUIDELINES.md).

## Paleta

| Token | HEX | Uso |
| --- | --- | --- |
| `--brand-graphite` | `#252824` | Sidebar, KPI destacada, superficies oscuras |
| `--brand-graphite-elevated` | `#323630` | Elevación sobre grafito |
| `--brand-terracotta` | `#C65D3A` | Acentos, iconos activos, series principales |
| `--brand-terracotta-hover` | `#A84B2C` | Texto pequeño y enlaces sobre fondos claros |
| `--brand-terracotta-strong` | `#B4522F` | Fondo de botones primarios |
| `--brand-terracotta-subtle` | `#F5E5DD` | Selección y estados suaves |
| `--brand-ivory` | `#F5F2EB` | Fondo general |
| `--brand-sand` | `#E7E0D5` | Bordes secundarios y superficies de apoyo |
| `--brand-olive` | `#60715A` | Éxito y series secundarias |
| `--text-primary` | `#252824` | Texto principal |
| `--text-secondary` | `#686C64` | Texto de apoyo |
| `--text-muted` | `#858A80` | Metadatos decorativos |
| `--border-subtle` | `#E8E4DC` | Divisores y bordes finos |

### Estados semánticos

| Estado | Texto | Fondo |
| --- | --- | --- |
| Success | `#4F6B47` | `#E8EDE4` |
| Warning | `#8A5714` | `#F6E9D8` |
| Danger | `#A63F32` | `#F7E3DF` |
| Info | `#4F6070` | `#E9EDF0` |

Los tokens `success`, `warning`, `danger` e `info` se exponen además como colores
Tailwind (`text-success`, `bg-success-soft`, etc.). Los estados nunca se
comunican solo con color.

## Tipografía

- **Encabezados:** Manrope Variable (`@fontsource-variable/manrope`).
- **Interfaz y cifras:** Inter Variable con `tabular-nums`.
- Escala: 12 · 13 · 14 · 15 · 16 · 18 · 20 · 24 · 30 · 32 px.
- Títulos: 600–700; cuerpo: 400–500; etiquetas KPI: 11 px en versalitas.

## Espaciado, radios y sombras

- Espaciado en múltiplos de 4 px (4 / 8 / 12 / 16 / 24 / 32).
- Radios: 8–12 px controles, 18 px tarjetas, 20 px paneles flotantes.
- `--shadow-card` y `--shadow-raised`: sombras discretas, nunca pesadas.
- Sin gradientes llamativos; el degradado radial terracota de la sidebar es
  sutil y decorativo.

## Layout

| Breakpoint | Navegación | Contenido |
| --- | --- | --- |
| < 1024 px | Drawer con cierre, Escape y foco gestionado | 1 columna |
| 1024–1279 px | Rail compacto de 72 px | KPIs 2 columnas |
| ≥ 1280 px | Sidebar expandible de 236 px | KPIs 4 columnas |

- Sidebar flotante: 12 px de separación, radio 20 px, grafito y sombra suave.
- Topbar flotante: superficie blanca, radio 20 px, borde arena.
- Contenido máximo 1600 px, padding 12–24 px.
- Sin scroll horizontal en ningún breakpoint.

## Componentes clave

- `KpiCard`: tarjeta blanca; la primera puede usar grafito como ancla visual.
  Etiqueta en versalitas, valor 32 px tabular, delta contextual y enlace.
- `Button`: primario terracota accesible; outline con borde arena; ghost.
- `Card` / `SectionCard` / `ChartCard`: radio 18 px, borde sutil y sombra discreta.
- `StatusBadge` / `PriorityBadge`: icono o punto + texto + color.
- `MetricDelta`: variación con icono, signo y color semántico.
- `ProgressBar`: `role="progressbar"`, oliva al 100 % y terracota en curso.
- `EmptyState`, `ErrorState`, `Skeleton`: estados honestos y accesibles.
- `DemoBadge`: rotulación permanente de entorno simulado.
- `LogoMark`: trazo ascendente con nodo; wordmark `trazo.`.

## Navegación flotante

- Sidebar compacta de 72 px con tooltips accesibles y `aria-label`.
- Expansión a 236 px con transición de 220 ms y preferencia en `localStorage`
  (`trazo:nav-collapsed`).
- Estado activo: rail terracota, icono terracota y texto marfil.
- Drawer móvil sobre grafito, cerrable con Escape; foco devuelto al disparador.
- Topbar: breadcrumb `trazo.`, sección, indicador demo, alertas y perfil.

## Accesibilidad

- Objetivo WCAG 2.2 AA.
- Skip-link, `aria-current`, foco visible y orden lógico.
- Contraste mínimo 4.5:1 en texto normal, verificado por
  `src/tests/trazo-brand.test.ts`.
- Estados con icono y texto; gráficos con leyenda y resumen `sr-only`.
- `prefers-reduced-motion` desactiva animaciones.
- Tooltips y menús accesibles mediante Base UI.

## Verificación

```bash
npm run lint
npm run typecheck
NODE_ENV=test npm run test
npm run build
```
