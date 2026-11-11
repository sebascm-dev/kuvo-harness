# 📜 Etapa 1 · Contrato y configuración

**Objetivo:** escribir las reglas del juego antes de construir a ningún jugador. El contrato dice qué forma tiene cada cosa; la configuración dice cómo es cada proyecto concreto.

**Al acabar tendrás:** `docs/contracts.md`, `harness.config.json` con su lector y sus tests, fronteras de capas generadas desde la configuración, las normas para el agente y los permisos.

**Requisitos previos:** Etapa 0 terminada.
**Tiempo:** 13–15 h.

> 💡 **La idea clave de esta etapa:** en el original, todo lo específico del proyecto (capas, comandos, umbrales) está escrito a mano dentro de skills y scripts. En el tuyo, todo eso sale de `harness.config.json`. Así el mismo harness sirve para cualquier proyecto.

---

## Fase 1.1 · Decidir antes de escribir

- [ ] **1.1.1 · Decidir el idioma de cada cosa** · ⏱️ 15 min
  - **Qué:** en qué idioma van los prompts de los agentes, los artefactos, el código y los mensajes al usuario.
  - **Por qué:** el idioma es parte del contexto. Mezclarlo confunde al modelo y a los validadores, que buscan títulos por texto exacto.
  - **Cómo:** decide y apúntalo. Recomendación: prompts, artefactos y código en inglés (los modelos rinden mejor y los títulos son estables); las conversaciones contigo, en español.
  - **Hecho cuando:** tienes la decisión escrita en una línea.

- [ ] **1.1.2 · Decidir los nombres de todo** · ⏱️ 20 min
  - **Qué:** la lista de nombres que usarás: fases, agentes, artefactos, carpetas y tipos de ticket.
  - **Por qué:** un nombre cambiado a mitad del proyecto rompe validadores, hooks y skills a la vez. Mejor fijarlos ahora.
  - **Cómo:** parte de los del original (`spec-clarify`, `explorer`, `00-clarification.md`…) y cambia solo lo que tenga un motivo claro.
  - **Hecho cuando:** tienes la lista completa en tu nota de diseño.

- [ ] **1.1.3 · Repasar tus notas de la Etapa 0** · ⏱️ 15 min
  - **Qué:** las 3 cosas que cambiarías del original.
  - **Por qué:** es el momento de decidir si las cambias. Después sale caro.
  - **Cómo:** para cada una, decide sí o no y apunta el motivo.
  - **Hecho cuando:** las 3 tienen decisión.

- [ ] **1.1.4 · Abrir el registro de decisiones del harness** · ⏱️ 15 min
  - **Qué:** `docs/decisions.md` en el repo `harness`, con una entrada por cada decisión de esta fase.
  - **Por qué:** desde hoy tomas decisiones (idioma, nombres, tus 3 cambios). Si no las apuntas con fecha y motivo, dentro de un mes no sabrás por qué el harness es como es. En la Etapa 6 un script lo hará por ti; hasta entonces, a mano.
  - **Cómo:** una entrada por decisión con este formato (es el mismo que automatizarás en la Etapa 6):
    ```markdown
    ## ADR-001 · Prompts y artefactos en inglés
    - Date: 2026-11-08 12:08 (Europe/Madrid)
    - Status: accepted
    - Source: manual

    ### Context        por qué hubo que decidir
    ### Decision       qué se decidió
    ### Consequences   qué implica
    ```
    Mete también las filas de la tabla "Decisiones de diseño" del índice.
  - **Hecho cuando:** cada decisión de esta fase y del índice tiene su entrada con fecha.

- [ ] **1.1.5 · Abrir el documento de arquitectura del harness** · ⏱️ 20 min
  - **Qué:** `docs/architecture.md` en el repo `harness`.
  - **Por qué:** es el mapa del propio harness. Lo irás ampliando al terminar cada etapa, y en el portfolio explica de un vistazo cómo está hecho.
  - **Cómo:** secciones `Overview` (qué es, con el árbol de carpetas del índice), `Components` (una línea por pieza, la irás llenando), `Constraints` (las reglas de "Decisiones de diseño", citando su `ADR-n`) y `Changelog` (una línea por etapa terminada).
  - **Hecho cuando:** existe con las 4 secciones y una primera línea en el `Changelog`.

### ✅ Checkpoint 1.1
Tienes escritos el idioma de cada cosa, la lista de nombres y la decisión sobre tus 3 cambios, y todas están en `docs/decisions.md` con su fecha.

---

## Fase 1.2 · Escribir `docs/contracts.md`

Una tarea por sección. Copia la estructura del original y adáptala. **Pídeselo a Claude sección por sección**, pasándole el contrato original y tus decisiones, y revisa cada una.

- [ ] **1.2.1 · Sección 1: estructura del harness** · ⏱️ 20 min
  - **Qué:** qué hay en cada carpeta del repo `harness` y qué carpetas crea en un proyecto al instalarse (`specs/`, `tickets/`).
  - **Por qué:** los agentes buscan las cosas donde el contrato dice que están.
  - **Cómo:** escribe el árbol de carpetas con una línea por carpeta.
  - **Hecho cuando:** cada carpeta del índice tiene su línea.
  - **Referencia:** `docs/contracts.md` §1

- [ ] **1.2.2 · Sección 2: configuración** · ⏱️ 30 min
  - **Qué:** qué campos tiene `harness.config.json` y qué significa cada uno (lo construyes en la Fase 1.3).
  - **Por qué:** es lo que sustituye a todo lo que en el original está escrito a mano.
  - **Cómo:** una tabla campo | tipo | ejemplo | para qué sirve.
  - **Hecho cuando:** la tabla cubre capas, comandos, umbrales, extensiones de interfaz, ruta de migraciones y modelos.

- [ ] **1.2.3 · Sección 3: reglas de capas** · ⏱️ 20 min
  - **Qué:** cómo se definen las capas y las reglas que siempre se cumplen.
  - **Por qué:** "código predecible, agente fiable" empieza aquí.
  - **Cómo:** escribe las reglas generales: dependencias solo hacia abajo, tests junto al fichero, orden de implementación según el orden de capas en la configuración, un `CLAUDE.md` por capa.
  - **Hecho cuando:** las reglas no mencionan ningún proyecto concreto.
  - **Referencia:** `docs/contracts.md` §2

- [ ] **1.2.4 · Sección 4: tickets** · ⏱️ 15 min
  - **Qué:** el formato de un ticket.
  - **Por qué:** es la entrada de la factoría. Si la entrada es mala, todo lo demás también.
  - **Cómo:** copia el formato del original y guárdalo además como plantilla en `templates/ticket.md`:
    ```markdown
    ---
    id: FEATURE-1
    title: Título corto
    type: feature        # feature o fix
    ---

    ## Description
    Qué se quiere y por qué, como lo contaría alguien de producto.

    ## Acceptance criteria
    - Comportamientos observables, uno por línea.
    ```
  - **Hecho cuando:** la sección y la plantilla existen.
  - **Referencia:** `docs/contracts.md` §3

- [ ] **1.2.5 · Sección 5: artefactos** · ⏱️ 45 min
  - **Qué:** los títulos exactos, en orden, de cada artefacto (`00` a `05`) y qué va en cada uno.
  - **Por qué:** los validadores de la Etapa 3 comprobarán exactamente esto. Si aquí hay ambigüedad, el validador no se puede escribir.
  - **Cómo:** una subsección por artefacto con sus títulos de nivel 2 y una línea de explicación. Incluye el formato de paso del plan y la línea EARS:
    ```
    - [ ] S1 `ruta/al/fichero.ts` — instrucción en una línea
    WHEN <disparador> THE <capa> SHALL <resultado observable>
    ```
  - **Hecho cuando:** los 6 artefactos tienen sus títulos y no hay ninguna palabra como "más o menos" o "normalmente".
  - **Referencia:** `docs/contracts.md` §4

- [ ] **1.2.6 · Sección 6: puertas** · ⏱️ 20 min
  - **Qué:** las puertas A (diseño), B (tamaño), C (auditoría) y una nueva, **M (migraciones)**: si el plan toca la carpeta de migraciones de la base de datos, decides tú siempre.
  - **Por qué:** con Supabase, una migración mal hecha puede borrar datos de un cliente. Merece su propia puerta.
  - **Cómo:** para cada puerta: cuándo salta, quién decide, qué pasa en modo automático. Para Gate B, define exactamente qué cuenta como fichero, línea y símbolo nuevo.
  - **Hecho cuando:** las 4 puertas tienen las tres respuestas.
  - **Referencia:** `.claude/skills/spec-help/references/gates.md`

- [ ] **1.2.7 · Sección 7: journal y lecciones** · ⏱️ 30 min
  - **Qué:** el esquema de cada línea del journal, los valores permitidos de `phase`, `actor` y `kind`, el bloque `JOURNAL` de los agentes y el esquema de `lessons.json`.
  - **Por qué:** el script que escribe el journal (Etapa 3) y el hook que lo captura (Etapa 8) dependen de esto.
  - **Cómo:** copia el original y añade `actor` para tus agentes si cambiaste nombres.
  - **Hecho cuando:** hay un ejemplo JSON válido de una línea y de una lección.
  - **Referencia:** `docs/contracts.md` §5 y §6

- [ ] **1.2.8 · Sección 8: bloqueos** · ⏱️ 10 min
  - **Qué:** los motivos de bloqueo y el formato de `BLOCKED.md`.
  - **Por qué:** todos los agentes paran de la misma forma. Así el piloto automático sabe leer cualquier parada.
  - **Cómo:** los 4 motivos del original (`PLAN_MISMATCH`, `TEST_FAIL_BUDGET`, `SETUP_ERROR`, `NEEDS_DECISION`) y el formato del fichero.
  - **Hecho cuando:** la sección existe.
  - **Referencia:** `.claude/skills/spec-help/references/block-reasons.md`

- [ ] **1.2.9 · Secciones 9 a 12: agentes, skills, hooks y scripts** · ⏱️ 30 min
  - **Qué:** una tabla por tipo de pieza: nombre, qué hace, qué no puede hacer y en qué etapa se construye.
  - **Por qué:** es el índice de todo lo que vas a construir. Cuando dudes de qué hace una pieza, mira aquí.
  - **Cómo:** copia las tablas del original y añade tus piezas nuevas (`set-profile.mjs`, `validate-dod.mjs`, `install.mjs`).
  - **Hecho cuando:** cada pieza del índice aparece en alguna tabla.
  - **Referencia:** `docs/contracts.md` §8 a §12

- [ ] **1.2.10 · Primera línea del contrato** · ⏱️ 5 min
  - **Qué:** la frase que gobierna todo.
  - **Por qué:** cuando un agente, un script y el contrato no coincidan, esta frase dice quién tiene razón.
  - **Cómo:** escribe arriba del todo: "Este documento es la única fuente de verdad. Si una implementación y el contrato no coinciden, la implementación está mal."
  - **Hecho cuando:** está escrita.

### ✅ Checkpoint 1.2
Lee el contrato entero de una vez. Pídele a Claude que busque contradicciones, ambigüedades y referencias a proyectos concretos. Corrige todo lo que encuentre.

---

## Fase 1.3 · `harness.config.json`

- [ ] **1.3.1 · Escribir la configuración del sandbox** · ⏱️ 30 min
  - **Qué:** el fichero `harness.config.json` en la raíz del repo, configurado para el sandbox.
  - **Por qué:** es lo único que cambiará cuando instales el harness en otro proyecto.
  - **Cómo:** escríbelo con esta forma (los comentarios son para que lo entiendas; JSON no los admite, quítalos):
    ```jsonc
    {
      "project": "sandbox",
      "projectRoot": "sandbox",           // dónde vive el código ("." al instalarlo en un proyecto)
      "ticketPattern": "^[A-Z]+-\\d+$",   // formato de ID de ticket
      "dirs": { "tickets": "tickets", "specs": "specs" },
      "layers": [                         // en orden de implementación
        { "name": "core", "path": "src/core", "mayImport": [],
          "forbiddenPackages": ["react", "react-dom"] },
        { "name": "ui",   "path": "src/ui",   "mayImport": ["core"] },
        { "name": "app",  "path": "src/app",  "mayImport": ["ui", "core"] }
      ],
      "commands": {                       // se ejecutan dentro de projectRoot
        "lint": "pnpm lint",
        "lintFile": "pnpm lint:file",
        "typecheck": "pnpm typecheck",
        "test": "pnpm test",
        "build": "pnpm build",
        "dev": "pnpm dev"
      },
      "lintExtensions": [".ts", ".tsx"],  // qué ficheros revisa el hook
      "uiExtensions": [".tsx", ".css"],   // qué cambios disparan design-qa
      "migrationsPath": null,             // ej. "supabase/migrations" → Gate M
      "gateB": { "maxFiles": 15, "maxLines": 500, "maxNewExports": 6 },
      "models": { "active": "pro" }       // los perfiles se añaden en la Etapa 4
    }
    ```
  - **Hecho cuando:** el fichero existe y es JSON válido (`node -e "JSON.parse(require('fs').readFileSync('harness.config.json','utf8'))"` no da error).

- [ ] **1.3.2 · Escribir el lector de configuración** · ⏱️ 45 min
  - **Qué:** `.claude/scripts/lib/config.mjs`, una función `loadConfig()` que lee el fichero y comprueba que tiene todos los campos.
  - **Por qué:** todos los scripts leerán la configuración por aquí. Si falta un campo, mejor un error claro al principio que un fallo raro a mitad de un ticket.
  - **Cómo:**
    1. Lee la ruta de la variable de entorno `HARNESS_CONFIG` si existe; si no, `harness.config.json` en la raíz. La variable te servirá para los tests.
    2. Comprueba cada campo obligatorio y su tipo.
    3. Si algo falla, lanza un error que diga qué campo y qué se esperaba.
    4. Solo módulos internos de Node (`node:fs`, `node:path`). Nada de dependencias.
  - **Hecho cuando:** `node -e "import('./.claude/scripts/lib/config.mjs').then(m => console.log(m.loadConfig().project))"` imprime `sandbox`.

- [ ] **1.3.3 · Tests del lector** · ⏱️ 45 min
  - **Qué:** `.claude/scripts/lib/config.test.mjs` con fixtures en `.claude/scripts/fixtures/config/`.
  - **Por qué:** "valida con scripts" también aplica a tus propios scripts. Un lector roto rompe todo el harness.
  - **Cómo:** un fixture válido y uno por cada error (falta `layers`, capa sin `path`, `mayImport` con una capa que no existe…). Cada test usa `HARNESS_CONFIG` para apuntar a su fixture.
  - **Hecho cuando:** `pnpm test` pasa con al menos 5 tests.
  - **Referencia:** `.claude/scripts/validators.test.mjs` (estilo de test)

- [ ] **1.3.4 · Un único punto de entrada para los comandos: `run.mjs`** · ⏱️ 45 min
  - **Qué:** `.claude/scripts/run.mjs`, que recibe un nombre (`lint`, `test`, `build`…), busca el comando en la configuración y lo ejecuta dentro de `projectRoot`. Por ejemplo: `node .claude/scripts/run.mjs test`.
  - **Por qué:** resuelve tres problemas de golpe. Los agentes no necesitan saber dónde vive el código ni qué gestor de paquetes usas; basta un permiso (`node .claude/scripts/*`) para todo; y no hacen falta comandos encadenados como `cd sandbox && pnpm test`, que se saltan los permisos.
  - **Cómo:**
    1. Lee el nombre del primer argumento y el resto como argumentos extra (para `lintFile <ruta>`).
    2. Ejecuta con `spawnSync(comando, { cwd: projectRoot, shell: true, stdio: 'inherit' })`.
    3. Sal con el mismo código que el comando.
    4. Si el nombre no existe en la configuración, imprime los válidos y sal con 2.
  - **Hecho cuando:** `node .claude/scripts/run.mjs test` pasa los tests del sandbox, `node .claude/scripts/run.mjs nada` lista los nombres válidos, y el código de salida coincide con el del comando.

- [ ] **1.3.5 · Tests de `run.mjs`** · ⏱️ 30 min
  - **Qué:** tests con una configuración de prueba cuyos comandos son `node -e "process.exit(0)"` y `node -e "process.exit(3)"`.
  - **Por qué:** hooks, validadores y el piloto automático dependerán de que el código de salida llegue intacto.
  - **Cómo:** comprueba que devuelve 0, que devuelve 3 y que un nombre desconocido devuelve 2.
  - **Hecho cuando:** los 3 tests pasan.

### ✅ Checkpoint 1.3
Si borras un campo obligatorio de `harness.config.json`, el lector da un error que dice exactamente cuál falta. Vuelve a ponerlo y todo pasa. Y `node .claude/scripts/run.mjs test` ejecuta los tests del sandbox desde la raíz del repo.

---

## Fase 1.4 · Fronteras de capas desde la configuración

- [ ] **1.4.1 · Generar las reglas de ESLint** · ⏱️ 60 min
  - **Qué:** `.claude/scripts/lib/eslint-boundaries.mjs`, una función que lee las capas de la configuración y devuelve las reglas `no-restricted-imports` de cada una.
  - **Por qué:** en el original las fronteras están escritas a mano. En el tuyo, cambiar las capas en la configuración cambia las reglas solas.
  - **Cómo:**
    1. Para cada capa, calcula qué capas tiene prohibidas: todas las que no están en su `mayImport`, excepto ella misma.
    2. Devuelve un bloque de ESLint con `files` igual a la ruta de la capa (relativa a `projectRoot`, que es donde corre ESLint) y la regla `no-restricted-imports` con esos patrones y los `forbiddenPackages`.
    3. Mensaje de error claro, por ejemplo: "core no puede importar de ui (ver docs/contracts.md §3)".
  - **Hecho cuando:** la función devuelve un bloque por capa con las prohibiciones correctas.
  - **Referencia:** `eslint.config.js`

- [ ] **1.4.2 · Tests de las fronteras** · ⏱️ 30 min
  - **Qué:** tests que comprueban qué prohíbe cada capa.
  - **Por qué:** si esta función falla, el agente podría saltarse capas sin que nadie se entere.
  - **Cómo:** con la configuración del sandbox, comprueba que `core` prohíbe `ui`, `app` y `react`; que `ui` prohíbe `app`; y que `app` no prohíbe nada.
  - **Hecho cuando:** los tests pasan.

- [ ] **1.4.3 · Usarlas en el sandbox** · ⏱️ 30 min
  - **Qué:** importar la función en `sandbox/eslint.config.js` y añadir sus bloques.
  - **Por qué:** es la prueba real de que funciona.
  - **Cómo:** importa la función con una ruta relativa al repo y añade su resultado al array de configuración.
  - **Hecho cuando:** si en `sandbox/src/core/sum.ts` importas algo de `../ui`, `node .claude/scripts/run.mjs lint` falla con tu mensaje.

### ✅ Checkpoint 1.4
Prueba las tres fronteras a mano: un import prohibido en `core`, otro en `ui` y uno permitido en `app`. Los dos primeros fallan con tu mensaje y el tercero pasa. Deshaz los cambios.

---

## Fase 1.5 · Normas para el agente

- [ ] **1.5.1 · `CLAUDE.md` del repo `harness`** · ⏱️ 30 min
  - **Qué:** las normas para trabajar en el propio harness.
  - **Por qué:** vas a usar Claude Code para construir el harness. Necesita saber las reglas: Node puro, sin dependencias en `.claude/scripts`, tests con `node:test`, el contrato manda.
  - **Cómo:** menos de 100 líneas. Qué es el repo, dónde está cada cosa, las 5 reglas más importantes y cómo ejecutar los tests. Incluye la regla de búsqueda:
    - **Para buscar en el código:** primero la herramienta de búsqueda de Claude Code (ya usa ripgrep); si hace falta la terminal, `rg`, nunca `grep -r` ni `find`, que se meten en `node_modules` y llenan el contexto de basura.
    - **Dentro de los scripts del harness, nunca `rg`:** buscan con `fs` de Node, para que funcionen en cualquier ordenador sin instalar nada.
  - **Hecho cuando:** existe y le preguntas a Claude "¿dónde va un validador nuevo?" y responde bien sin buscar.
  - **Referencia:** `CLAUDE.md`

- [ ] **1.5.2 · Plantilla de `CLAUDE.md` por capa** · ⏱️ 20 min
  - **Qué:** `templates/CLAUDE.layer.md` con las secciones fijas.
  - **Por qué:** todas las capas de todos tus proyectos describirán sus normas igual, y los agentes sabrán dónde mirar.
  - **Cómo:** estas secciones:
    ```markdown
    # <nombre de la capa>
    Una frase: qué es esta capa.
    ## Belongs here            qué va aquí
    ## Never here              qué está prohibido
    ## Conventions             nombres, exports, tests
    ## How a feature lands here  orden de trabajo dentro de la capa
    ```
  - **Hecho cuando:** existe la plantilla.
  - **Referencia:** `packages/core/CLAUDE.md`

- [ ] **1.5.3 · `CLAUDE.md` de cada capa del sandbox** · ⏱️ 30 min
  - **Qué:** tres ficheros, uno en cada carpeta de capa del sandbox.
  - **Por qué:** es lo que leerá el developer antes de tocar una capa.
  - **Cómo:** rellena la plantilla para `core`, `ui` y `app`.
  - **Hecho cuando:** los tres existen y ninguno contradice las fronteras de ESLint.

- [ ] **1.5.4 · Lo que no está en el código** · ⏱️ 30 min
  - **Qué:** `templates/team-agreements.md`: acuerdos de trabajo, tu criterio al revisar una PR y el idioma.
  - **Por qué:** la charla insiste: el agente encuentra el código solo, lo que le falta es lo que no está escrito. Por ejemplo: "no añadas dependencias sin preguntar" o "prefiero funciones pequeñas a clases".
  - **Cómo:** escribe 10 reglas tuyas. Piensa en qué corregirías al revisar el código de otra persona.
  - **Hecho cuando:** tiene 10 reglas concretas, sin frases vagas como "código limpio".

- [ ] **1.5.5 · Skill `project-conventions`** · ⏱️ 45 min
  - **Qué:** `.claude/skills/project-conventions/SKILL.md`, que carga las capas de la configuración, el `CLAUDE.md` de cada capa y los acuerdos del equipo.
  - **Por qué:** todas las fases cargarán esta skill. Así las normas entran siempre en el contexto, de la misma forma.
  - **Cómo:** que indique leer `harness.config.json`, luego el `CLAUDE.md` de cada capa y luego los acuerdos. Añade `user-invocable: false` en la cabecera si solo la van a usar otras skills.
  - **Hecho cuando:** en Claude Code, al pedir "carga las convenciones del proyecto", lee los ficheros correctos.
  - **Referencia:** `.claude/skills/monorepo-conventions/SKILL.md`

### ✅ Checkpoint 1.5
Abre Claude Code en el repo y pídele: "Sin buscar en el código, ¿qué puede importar la capa ui y dónde van los tests?". Debe responder bien usando solo las normas.

---

## Fase 1.6 · Permisos

- [ ] **1.6.1 · `allow` en `.claude/settings.json`** · ⏱️ 30 min
  - **Qué:** la lista de comandos que el agente puede ejecutar sin preguntar.
  - **Por qué:** sin esto, el agente te pide permiso cada dos pasos. Con demasiado, puede hacer daño.
  - **Cómo:** gracias a `run.mjs`, un solo permiso cubre todos los comandos del proyecto. Añade los de solo lectura de Git:
    ```json
    {
      "permissions": {
        "allow": [
          "Read", "Grep", "Glob", "Edit", "Write", "Agent",
          "Bash(node .claude/scripts/*)",
          "Bash(node --test*)",
          "Bash(git diff*)", "Bash(git status*)", "Bash(git log*)",
          "Bash(rg *)"
        ]
      }
    }
    ```
    `rg` va permitido porque solo lee. `grep` y `find` no se permiten: si el agente los pide, te enterarás y verás que se está saltando la norma de 1.5.1.
  - **Hecho cuando:** el agente ejecuta `node .claude/scripts/run.mjs test` y `rg` sin pedirte permiso.
  - **Referencia:** `.claude/settings.json`

- [ ] **1.6.2 · `deny`** · ⏱️ 10 min
  - **Qué:** lo que el agente nunca puede hacer.
  - **Por qué:** el commit y el push son tuyos. Siempre das tú el último visto bueno.
  - **Cómo:** añade `"deny": ["Bash(git push*)", "Bash(git commit*)", "Bash(rm -rf*)"]`.
  - **Hecho cuando:** si le pides un commit, Claude Code lo bloquea.

- [ ] **1.6.3 · Probar la trampa de los comandos encadenados** · ⏱️ 15 min
  - **Qué:** comprobar que `node .claude/scripts/run.mjs test && git push` no se ejecuta solo.
  - **Por qué:** los permisos van por prefijo. Encadenar comandos con `&&`, `|` o `;` puede colar uno prohibido. Tienes que saber cómo se comporta.
  - **Cómo:** pídele al agente que ejecute el comando encadenado y mira si te pide permiso.
  - **Hecho cuando:** te pide permiso (o lo deniega). Apunta en el contrato la regla: "una orden por llamada a Bash".

### ✅ Checkpoint 1.6
El agente ejecuta los tests sin preguntar, no puede hacer commit ni push, y un comando encadenado no se cuela.

---

## 🏁 Hito Etapa 1

- Commit `etapa-1: contrato, configuración, capas, normas y permisos` y etiqueta `etapa-1`.
- Línea en el `Changelog` de `docs/architecture.md`, y en `docs/decisions.md` las decisiones que hayas tomado por el camino. **Haz lo mismo al cerrar cada etapa.**
- `CHANGELOG.md`: qué secciones tiene el contrato y cuántos tests pasan.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| El contrato se vuelve enorme y no lo terminas | Ciñete al original. Las mejoras van en una sección "Pendiente" al final |
| `eslint.config.js` del sandbox no encuentra tu función | Usa una ruta relativa con extensión `.mjs` y comprueba que el sandbox también es `"type": "module"` |
| Rutas con barras invertidas de Windows en los patrones | Escribe siempre las rutas con `/` en la configuración y normalízalas con `path.posix` en los scripts |
| Te bloqueas decidiendo nombres | Usa los del original. Cambiar después un nombre es buscar y reemplazar |
