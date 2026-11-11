# Changelog

Registro de lo que se añade al harness en cada etapa. Cada hito deja una línea aquí.

## etapa-0

- Fase 0.2: ticket de prueba `FIX-1` ejecutado en el repo original con su runner: 13 min 24 s, 85 turnos y 4,87 USD de coste equivalente de API.
- Fase 0.3: repo en GitHub con licencia MIT, `.gitattributes` (finales de línea LF), `.gitignore`, estructura de carpetas, `package.json` raíz (`"type": "module"`, `pnpm test` con `node --test`) y el roadmap en `docs/roadmap/`.
- Fase 0.4: sandbox React + TypeScript en `sandbox/` (Vite 8, ESLint 10, Vitest 5) con tres capas (`src/core`, `src/ui`, `src/app`), 2 tests y los scripts `lint`, `lint:file`, `typecheck`, `test` y `build`. El `pnpm test` de la raíz queda acotado a `.claude/` y `scripts/` para no ejecutar los tests de Vitest del sandbox.
- Hito `etapa-0` (11/11): entorno de Windows listo, el harness original ejecutado de punta a punta, el repo `kuvo-harness` en GitHub y un sandbox de tres capas con lint, tipos, tests y build. El ticket de prueba `FIX-1` del repo original gastó 4,87 USD de coste equivalente de API (13 min 24 s, 85 turnos).

## etapa-1

- Fase 1.1: `docs/decisions.md` con 22 decisiones fechadas (`ADR-001` a `ADR-022`: idioma, nombres, los 3 cambios sobre el original, las 17 decisiones de diseño del índice y el formato de las entradas) y `docs/architecture.md` con `Overview`, `Components`, `Constraints` y `Changelog`. Todavía no hay tests: `pnpm test` responde `tests 0`.
