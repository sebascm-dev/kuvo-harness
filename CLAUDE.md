# kuvo-harness

Harness propio para Claude Code, construido etapa a etapa siguiendo el roadmap de `docs/roadmap/`.

## Cómo trabajamos en este repo
- El plan está en docs/roadmap/. Una tarea cada vez, en orden.
- Antes de escribir código, explica qué vas a hacer y por qué.
- Una tarea no está hecha hasta que se cumple su "Hecho cuando".
- Nada de dependencias externas en los scripts: Node 24 puro (.mjs).
- Windows: nada de bash en hooks ni scripts.
- Fechas y horas siempre con stamp(), nunca a mano.
- Para buscar: tu herramienta de búsqueda o `rg`; nunca `grep -r` ni `find`. Dentro de los scripts, solo `fs` de Node.
- Nunca hagas commit ni push: los hago yo.
