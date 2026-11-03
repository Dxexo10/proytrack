# Adaptado HTTP (reservado para la Fase 5)

Esta carpeta queda vacía de código a propósito.

La UI consume los repositorios definidos en `src/data/contracts` a través de
`src/data/index.ts`. Para conectar la API REST real bastará con:

1. Implementar `HttpProjectRepository`, `HttpAlertRepository` y
   `HttpActivityRepository` contra `/api/v1`.
2. Cambiar las instancias exportadas en `src/data/index.ts`.

Ninguna vista, hook ni servicio de dominio necesita modificarse.
