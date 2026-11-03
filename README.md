<h1 align="center">ProyTrack</h1>

<p align="center">
  <strong>Project Management &amp; Intelligence</strong><br />
  Tus proyectos bajo control.
</p>

<p align="center">
  <em>Proyecto personal de portafolio · demo funcional con datos simulados</em>
</p>

---

ProyTrack es una plataforma SaaS de gestión de proyectos empresariales que
centraliza portafolio, presupuestos, avances y alertas, y conserva el historial
de cada cambio para explicar qué se modificó, cuándo y por qué.

La demo usa **datos ficticios deterministas** y un reloj de referencia fijo, de
modo que el portafolio siempre se ve coherente sin depender de un backend.

## Estado del proyecto

| Fase | Alcance | Estado |
| --- | --- | --- |
| **F1 · Fundamentos + Dashboard** | Design system, layout responsive, dataset simulado, repositorios mock sobre IndexedDB, dashboard ejecutivo | **Disponible** |
| F2 · Proyectos | Listado con búsqueda y filtros, formulario de alta/edición, archivado, detalle | En progreso |
| F3 · Inteligencia de cambios | Versiones, comparador antes/después, motor de reglas, alertas, monitor e historial | Planificado |
| F4 · Pulido y QA | Actividad, ajustes y reset demo, accesibilidad AA, E2E con Playwright, CI | Planificado |
| F5–F7 · Backend | API REST con Node/Express, Prisma y PostgreSQL | Planificado |

### Disponible hoy

- Dashboard ejecutivo (`/dashboard`) con KPIs calculados desde los datos, tres
  gráficos, tabla de proyectos que requieren atención y actividad reciente.
- Filtro de periodo (3 / 6 / 12 meses) reflejado en la URL: ajusta la serie
  mensual y la comparación contra el periodo anterior, mientras los totales
  siempre representan el portafolio activo completo.
- Layout responsive completo: sidebar compacta, drawer móvil, topbar con
  breadcrumb, alertas abiertas y perfil demo.
- Dataset determinista de 50 proyectos, alertas y actividad persistidos en
  IndexedDB (sobreviven a la recarga).
- Estados de carga, error y vacío; navegación por teclado y foco visible.

Los módulos de Proyectos, Monitor, Alertas, Actividad y Configuración muestran
una pantalla honesta de "próximamente" con lo que incluirá cada uno. No hay
botones decorativos: cada acción navega, ejecuta algo real o está deshabilitada
con explicación.

## Stack

- **React 19 + Vite + TypeScript** (modo estricto)
- **Tailwind CSS v4** con tokens de diseño propios
- **shadcn/ui** sobre Base UI + **Lucide React**
- **React Router 7**, **TanStack Query 5**, **Recharts**
- **React Hook Form + Zod** (base de formularios de la Fase 2)
- **idb** para persistencia local
- **Vitest + React Testing Library** · **ESLint + Prettier**
- *Planificado:* TanStack Table, Playwright, Node.js + Express, Prisma, PostgreSQL

## Cómo ejecutar

Requisitos: Node.js ≥ 20.19 y npm ≥ 10.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Scripts disponibles:

```bash
npm run dev            # servidor de desarrollo
npm run build          # compilación de producción
npm run preview        # sirve el build
npm run typecheck      # TypeScript sin emitir
npm run lint           # ESLint
npm run format         # Prettier
npm run test           # Vitest
```

> Si tu entorno define `NODE_ENV=production`, instala con
> `npm install --include=dev` para incluir las dependencias de desarrollo.

## Arquitectura

```text
UI (features + components)
        ↓
Hooks / casos de uso (TanStack Query)
        ↓
Contratos de repositorio (src/data/contracts)
        ↓
Adaptador mock + IndexedDB  ← Fase 1
        ↓
Adaptador HTTP + API REST   ← Fase 5 (misma interfaz)
```

La UI nunca importa fixtures directamente. Para conectar el backend real solo se
sustituyen las instancias exportadas en `src/data/index.ts`; vistas y servicios
de dominio no cambian. Detalle completo en
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Datos simulados

- Semilla fija `20261031`, generador propio (mulberry32) y fecha de referencia
  `2026-10-31`, documentados en [`docs/DECISIONS.md`](docs/DECISIONS.md).
- 50 proyectos de tecnología, construcción y consultoría, 10 responsables
  ficticios, alertas y actividad derivadas del mismo estado.
- Dinero como enteros en céntimos; fechas en ISO-8601 UTC.
- La etiqueta **“Entorno de demostración · Datos simulados”** es visible en toda
  la aplicación.

## Pruebas y calidad

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Cobertura actual de la Fase 1: utilidades de dinero y fechas, agregación de KPIs,
determinismo del dataset, repositorios sobre IndexedDB y render del dashboard.

## Capturas

Se añadirán capturas reales de la aplicación al cerrar la Fase 4. Este README no
incluye renders ni mockups que no correspondan a pantallas implementadas.

## Limitaciones conocidas

- No hay backend, autenticación ni multiempresa: el perfil es fijo y de demo.
- Los módulos de la Fase 2 y 3 aún no están implementados.
- El periodo del dashboard afecta a la tendencia y a los deltas frente al
  periodo anterior; los totales y la distribución representan el portafolio
  activo completo.

## Licencia

[MIT](LICENSE) · Proyecto personal de demostración. Los nombres de clientes,
personas y montos son ficticios.
