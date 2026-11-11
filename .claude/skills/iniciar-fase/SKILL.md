---
name: iniciar-fase
description: "Trigger: /iniciar-fase, empezar fase, inicio de sesión. Reconstruye el estado de kuvo-harness desde los ficheros del repo, elige la fase de hoy y propone el plan de sus tareas sin tocar nada."
argument-hint: "[n.º de fase opcional, p. ej. 0.2]"
disable-model-invocation: true
---

# Inicio de fase · kuvo-harness

Fase que cree el usuario: `$ARGUMENTS` (si está vacío, dedúcela: la primera fase con tareas `[ ]`). Compruébala, no la des por hecho.

No recuerdas las sesiones anteriores: reconstruye el estado desde los ficheros del repo. CLAUDE.md ya está cargado; respeta sus reglas. Se trabaja **una fase por sesión**: sus tareas, en orden y de una en una. **Cada tarea se cierra en cuanto cumple su "Hecho cuando"** (ver "Cierre de cada tarea"); `/cerrar-fase` pasa el checkpoint de la fase al final.

> Esta skill sirve para construir el propio harness. No forma parte del producto: `install.mjs` (Etapa 10) no debe copiarla a otros proyectos.

## Dónde está el plan

- En `docs/roadmap/`. Mientras la Fase 0.3 no lo haya movido, en la raíz del repo.
- Un fichero por etapa: `etapa-N-*.md`. La jerarquía es Etapa → Fase → Tarea. Cada tarea tiene **Qué**, **Por qué**, **Cómo**, **Hecho cuando** y, a veces, **Referencia** (una ruta del repo original, `nucliweb/harness-engineering-biznagafest`).
- Nunca leas `ROADMAP-COMPLETO.md`: es todo lo demás junto y gasta mucho cupo.

## Paso 1 — Reconstruye el estado

1. Fichero de la etapa: las casillas `[x]` y `[ ]` de todas sus fases y la fase en curso. Lee entera solo la sección de la fase de hoy.
2. `00-indice.md`: solo "Determinista por diseño" y "Convenciones de este roadmap".
3. Si ya existen: `CHANGELOG.md`, las últimas entradas de `docs/decisions.md` y el `Changelog` de `docs/architecture.md`.
4. Si la carpeta ya es un repo Git: `git status` y `git log --oneline -15`.
5. Si ya existe `package.json`: `pnpm test`, para conocer el estado antes de tocar nada.
6. Engram (`mem_context`, `mem_search`) solo como pista del resumen de la última sesión. Si contradice a los ficheros, mandan los ficheros.

## Paso 2 — Contrasta

Avisa antes de seguir si:
- una tarea `[x]` no tiene su línea **Comprobado**, o su "Hecho cuando" ya no se cumple (repite las comprobaciones baratas: versiones, ficheros que deben existir, tests);
- la fase anterior tiene tareas `[ ]` o su checkpoint no tiene la línea **Superado**;
- hay trabajo hecho de una tarea que sigue `[ ]`;
- hay cambios sin commitear de una sesión anterior, o `pnpm test` falla;
- dos documentos se contradicen (cuando exista `docs/contracts.md`, manda el contrato).

## Paso 3 — Informe (breve)

- **✅ Hecho:** etapas con su hito, una línea por etapa; fases cerradas de la etapa en curso.
- **📍 Dónde estamos:** etapa, fase y primera tarea pendiente. Confirma o corrige lo que creía el usuario.
- **🎯 Fase de hoy:** objetivo y tiempo estimado (la suma de sus `⏱️`). Por cada tarea, en orden: su "Hecho cuando" literal, su tiempo y quién la hace: **el usuario** (leer, decidir, instalar en su máquina, mirar una pantalla), **Claude** (las de "Pídeselo a Claude" y las de escribir ficheros) o **los dos**.
- **⚠️ Avisos:** incoherencias, bloqueos y errores del propio roadmap.
- **🧭 Plan:** tarea a tarea, con el porqué de cada una. Incluye qué documentación leerás, dependencias nuevas (las aprueba el usuario), qué tareas dependen de una acción suya y si la fase cabe en la sesión.

## Reglas

- No crees ni edites nada hasta que el usuario apruebe el plan.
- Una tarea cada vez, en el orden del roadmap. No empieces una tarea hasta que la anterior esté cerrada.
- Antes de cada tarea, explica qué vas a hacer y por qué, y espera el visto bueno. El usuario está aprendiendo: una tarea no está hecha si no entiende el resultado.
- Todo en el hilo principal: no delegues en subagentes ni uses el flujo SDD de gentle-ai ni sus agentes `sdd-*`.
- Nunca hagas commit ni push: los hace el usuario.
- En los scripts, Node 24 puro (`.mjs`), sin dependencias externas. Nada de bash en hooks ni scripts.
- No toques tareas de otra fase.
- Si una tarea se bloquea (falta una acción del usuario), dilo y pregunta si se sigue con la siguiente.
- Si algo es ambiguo, una sola pregunta y espera.
- Cita de dónde sale cada dato importante (`fichero:línea`).
- Si el roadmap se equivoca (una orden que no existe, un "Hecho cuando" que no prueba lo que dice), dilo y propón la corrección. No la apliques sin el visto bueno.

## Cierre de cada tarea

En cuanto una tarea cumple su "Hecho cuando", y **antes de empezar la siguiente**:

1. **Comprueba** el "Hecho cuando" con evidencia: la salida de un comando, un fichero que existe, un test. Hazlo en PowerShell, que es donde trabaja el usuario: Git Bash no vale como prueba de que algo está instalado (allí `rg` es una función interna de Claude Code). Lo que solo pueda comprobar el usuario (algo que se ve en pantalla, algo que tiene que saber explicar), pídeselo.
2. Si existe `package.json`, ejecuta `pnpm test`.
3. **Tacha** la tarea en el fichero de su etapa. La línea **Comprobado** va al final de la tarea:
   ```markdown
   - [x] **0.1.1 · Instalar Git for Windows** · ⏱️ 15 min · ✅ 11/11
     - **Qué:** …
     - **Hecho cuando:** …
     - **Comprobado:** `git --version` responde `2.56.0` en PowerShell.
   ```
   La fecha sale del reloj del sistema (`Get-Date -Format "dd/MM"`, o `stamp()` cuando exista), nunca de memoria.
4. Si la evidencia es parcial, **no taches**: di qué falta. Si el criterio debe cambiar, se precisa con el usuario y se anota como `**Criterio precisado (dd/mm, con el usuario):** …`, nunca en silencio.
5. Si la tarea tomó una decisión de diseño y ya existe `docs/decisions.md`, añade su entrada (a mano hasta la Etapa 6; después, con `decision-append.mjs`).
6. **Resume en una línea** qué has comprobado y tachado, y pasa a explicar la siguiente tarea.
