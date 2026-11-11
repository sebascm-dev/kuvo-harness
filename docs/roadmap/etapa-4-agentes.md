# 🤖 Etapa 4 · Perfiles de modelo y agentes

**Objetivo:** crear el equipo de 5 subagentes, cada uno con una sola tarea, y un selector para cambiar todos sus modelos entre perfil Pro y perfil Max con un comando.

**Al acabar tendrás:** `set-profile.mjs`, los 5 agentes en `.claude/agents/`, un test que comprueba que todos los agentes cumplen el contrato y la skill de ayuda `harness-help`.

**Requisitos previos:** Etapa 3 (los agentes usarán los validadores y el journal).
**Tiempo:** 9–11 h.

> 💡 **La regla 2 de la charla:** "Cada pieza en su sitio." Un subagente arranca con el contexto limpio, así que es más fácil que siga sus instrucciones. Cuanto más estrecha su tarea, mejor la hace.

---

## Fase 4.1 · Perfiles de modelo

- [ ] **4.1.1 · Definir los perfiles en la configuración** · ⏱️ 20 min
  - **Qué:** la sección `models` completa en `harness.config.json`.
  - **Por qué:** es lo que te permite cambiar de plan el día de mañana sin tocar ni un agente.
  - **Cómo:**
    ```json
    "models": {
      "active": "pro",
      "profiles": {
        "pro": {
          "main":             { "model": "sonnet", "effort": "medium" },
          "explorer":         { "model": "haiku",  "effort": "low" },
          "plan-auditor":     { "model": "sonnet", "effort": "high" },
          "developer":        { "model": "sonnet", "effort": "medium" },
          "reviewer":         { "model": "opus",   "effort": "high" },
          "design-qa":        { "model": "sonnet", "effort": "medium" }
        },
        "max": {
          "main":             { "model": "opus",   "effort": "high" },
          "explorer":         { "model": "haiku",  "effort": "low" },
          "plan-auditor":     { "model": "opus",   "effort": "high" },
          "developer":        { "model": "sonnet", "effort": "medium" },
          "reviewer":         { "model": "opus",   "effort": "high" },
          "design-qa":        { "model": "sonnet", "effort": "medium" }
        }
      }
    }
    ```
    Actualiza el lector de configuración y sus tests para que exija un perfil activo que exista y que todos los perfiles tengan las mismas piezas.
  - **Hecho cuando:** los tests del lector pasan y uno nuevo comprueba que `active: "ultra"` da error.

- [ ] **4.1.2 · `set-profile.mjs`** · ⏱️ 60 min
  - **Qué:** `node .claude/scripts/set-profile.mjs max`, que cambia `active` en la configuración y reescribe las líneas `model:` y `effort:` de la cabecera de cada agente y de cada skill de fase.
  - **Por qué:** Claude Code lee el modelo de la cabecera de cada fichero. Este script las mantiene sincronizadas con la configuración, así nunca editas 10 ficheros a mano.
  - **Cómo:**
    1. Lee el perfil pedido.
    2. Para cada fichero de `.claude/agents/`, busca su nombre en el perfil y sustituye solo las líneas `model:` y `effort:` de la cabecera (entre los dos `---`). No toques nada más.
    3. Haz lo mismo con las skills `spec-*` usando la entrada `main`.
    4. Cambia `active` en la configuración.
    5. Imprime un resumen: qué fichero cambió y de qué a qué.
    6. Opción `--check`: no cambia nada, solo dice si los ficheros coinciden con el perfil activo (sale con 1 si no).
  - **Hecho cuando:** `set-profile.mjs max` y luego `set-profile.mjs pro` dejan los ficheros exactamente como estaban (`git diff` vacío).

- [ ] **4.1.3 · Tests de `set-profile.mjs`** · ⏱️ 30 min
  - **Qué:** tests sobre copias de agentes en una carpeta temporal.
  - **Por qué:** un fallo aquí podría dejar un agente sin modelo o, peor, corromper su cabecera.
  - **Cómo:** casos: cambio de pro a max, ida y vuelta sin cambios, perfil que no existe, `--check` detecta un fichero desincronizado, el cuerpo del agente no cambia.
  - **Hecho cuando:** los 5 tests pasan.

### ✅ Checkpoint 4.1
Todavía no hay agentes: crea uno de prueba con cabecera mínima, cambia de perfil dos veces y comprueba con `git diff` que solo cambian las dos líneas esperadas. Bórralo.

---

## Fase 4.2 · La plantilla común de agente

- [ ] **4.2.1 · Escribir la plantilla** · ⏱️ 30 min
  - **Qué:** `templates/agent.md` con la estructura fija que tendrán todos los agentes.
  - **Por qué:** todos los agentes reciben y responden igual. Así el orquestador y el hook del journal saben leerlos todos.
  - **Cómo:**
    ```markdown
    ---
    name: <nombre>
    description: <qué hace y cuándo usarlo, una frase>
    tools: <solo las que necesita>
    model: <lo pone set-profile.mjs>
    effort: <lo pone set-profile.mjs>
    maxTurns: <freno anti-bucles>
    ---

    Una frase: qué haces y qué no haces nunca.

    ## Inputs        lo que el orquestador te pega, literal
    ## Procedure     pasos numerados
    ## Output        formato exacto de tu informe
    ## Hard limits   lo que no puedes hacer
    ## Block reasons cuándo parar y con qué motivo
    ## JOURNAL block obligatorio, últimas líneas del informe
    ```
  - **Hecho cuando:** la plantilla existe.
  - **Referencia:** `.claude/agents/developer-package.md`

- [ ] **4.2.2 · El pie común: bloqueos y journal** · ⏱️ 20 min
  - **Qué:** el texto exacto de las dos últimas secciones, igual en todos los agentes.
  - **Por qué:** el hook de la Etapa 8 rechazará cualquier informe que no acabe con el bloque `JOURNAL`. Tiene que estar escrito igual en todos.
  - **Cómo:** copia las secciones del original y apunta en el contrato que son obligatorias. El bloque:
    ```
    JOURNAL: none

    o bien:

    JOURNAL
    - kind: autofix_failed
      summary: <una frase>
      files: [ruta, ruta]
    END JOURNAL
    ```
  - **Hecho cuando:** el pie está en la plantilla.
  - **Referencia:** `docs/contracts.md` §5.1 y §7

- [ ] **4.2.3 · Test de agentes** · ⏱️ 45 min
  - **Qué:** `.claude/scripts/agents.test.mjs`, que comprueba cada fichero de `.claude/agents/`.
  - **Por qué:** "valida con scripts" también para tus agentes. Si un día editas uno y borras sin querer el pie del journal, el test te avisa.
  - **Cómo:** para cada agente comprueba: cabecera con `name`, `description`, `tools`, `model`, `effort` y `maxTurns`; que `name` coincide con el nombre del fichero; que está en todos los perfiles; que tiene las 6 secciones en orden; y que contiene el texto `END JOURNAL`.
  - **Hecho cuando:** el test existe. Fallará hasta que existan los agentes, y es lo esperado.

### ✅ Checkpoint 4.2
La plantilla está escrita y el test de agentes falla diciendo que no hay agentes que comprobar.

---

## Fase 4.3 · Los agentes que leen y deciden

Para cada agente: **pídele a Claude que lo escriba** a partir de tu plantilla, del agente equivalente del original y de tu contrato. Luego revísalo tú línea a línea.

- [ ] **4.3.1 · `explorer`** · ⏱️ 45 min
  - **Qué:** el buscador. Solo lectura: `Read`, `Grep`, `Glob`.
  - **Por qué:** el hilo principal nunca busca por todo el repo: se llenaría de contexto inútil. El explorer busca en su propio contexto y devuelve solo rutas y extractos.
  - **Cómo:**
    1. Inputs: el ticket, una sola pregunta y el formato de respuesta.
    2. Antes de buscar, lee el mapa del código (`repo-map.mjs`, Etapa 3): muchas preguntas se responden sin abrir ningún fichero.
    3. Output: lista de `ruta:línea` con una línea de por qué, más un resumen de 3 frases.
    4. Hard limits: no edita, no propone diseños, no opina.
    5. `maxTurns` bajo (por ejemplo 20).
  - **Hecho cuando:** pasa el test de agentes.
  - **Referencia:** `.claude/agents/explorer.md`

- [ ] **4.3.2 · `plan-auditor`** · ⏱️ 60 min
  - **Qué:** el auditor del plan, con las 13 familias de errores (F0 a F12).
  - **Por qué:** es Gate C. Revisa el plan contra la clarificación y el diseño antes de que se escriba una línea de código, que es cuando un error es más barato.
  - **Cómo:**
    1. Copia la tabla de familias del original, con cuándo bloquea cada una.
    2. Output: una línea por hallazgo `F<n> 🔴|🟡 <dónde> — <qué> — <arreglo>` y una línea final `Blocking: n · Recommendations: n`.
    3. Hard limits: no edita el plan, no escribe código.
  - **Hecho cuando:** pasa el test de agentes.
  - **Referencia:** `.claude/agents/plan-auditor.md`, `.claude/skills/spec-help/references/auditor-families.md`

### ✅ Checkpoint 4.3
Pídele al explorer, en una sesión normal de Claude Code: "Usa el agente explorer para encontrar dónde se calcula el total en el sandbox". Comprueba que responde con rutas y termina con un bloque `JOURNAL`.

---

## Fase 4.4 · Los agentes que construyen y revisan

- [ ] **4.4.1 · `developer`** · ⏱️ 60 min
  - **Qué:** el que programa. Implementa los pasos de **una sola capa**.
  - **Por qué:** con una sola capa y pasos explícitos, un modelo medio rinde como uno grande y cuesta mucho menos.
  - **Cómo:**
    1. Inputs: ticket, capa, pasos del plan literales, interfaces de esa capa, el `CLAUDE.md` de la capa, las lecciones confirmadas de esa capa y la cola del journal.
    2. Procedure: implementa paso a paso; tras cada paso, ejecuta `node .claude/scripts/run.mjs lintFile <ruta>`; al final, `typecheck` y `test`. Siempre con `--trim`, para leer solo los fallos.
    3. Hasta 3 intentos para arreglar fallos. Al tercero sin éxito: `BLOCKED TEST_FAIL_BUDGET`.
    4. Hard limits: no toca otra capa, no cambia el plan, no añade dependencias.
    5. `maxTurns` alrededor de 60.
  - **Hecho cuando:** pasa el test de agentes.
  - **Referencia:** `.claude/agents/developer-package.md`

- [ ] **4.4.2 · `reviewer`** · ⏱️ 45 min
  - **Qué:** el revisor. Solo lectura más el diff limpio de `diff-pack.mjs`.
  - **Por qué:** usa un modelo distinto al del developer para no compartir sus puntos ciegos.
  - **Cómo:**
    1. Inputs: capa, pasos del plan, reglas de la capa.
    2. Procedure: lee el diff de la capa con `node .claude/scripts/diff-pack.mjs --layer <capa>` y compáralo con el plan y las reglas.
    3. Output: hallazgos `BLOCKING` o `NOTE`, cada uno con fichero, problema y arreglo propuesto.
    4. Añade a `tools` solo `Bash`, y en Hard limits: "solo `diff-pack.mjs`, `git status` y `git log`".
  - **Hecho cuando:** pasa el test de agentes.
  - **Referencia:** `.claude/agents/reviewer-package.md`

- [ ] **4.4.3 · Comprobar que developer y reviewer usan modelos distintos** · ⏱️ 15 min
  - **Qué:** una regla en el lector de configuración.
  - **Por qué:** es una regla de la charla. Si algún día cambias un perfil y los igualas sin darte cuenta, pierdes la revisión independiente.
  - **Cómo:** el lector falla si en algún perfil `developer.model` es igual a `reviewer.model`. Añade su test.
  - **Hecho cuando:** un perfil con los dos en `sonnet` da error.

### ✅ Checkpoint 4.4
En el sandbox, pídele al developer que añada una función `multiply` en `core` con su test, y luego al reviewer que revise el diff. El developer debe usar `run.mjs` y el reviewer no debe editar nada.

---

## Fase 4.5 · Validar: un script y un agente

- [ ] **4.5.1 · Sin agente validador** · ⏱️ 15 min
  - **Qué:** decidir que **no** existe el agente `validator-global` del original, y apuntarlo.
  - **Por qué:** su trabajo (ejecutar comandos y rellenar `04-dod.md`) ya lo hace `run-checks.mjs` desde la Etapa 3, sin gastar tokens. Un agente aquí solo añadiría coste.
  - **Cómo:** apunta la decisión en `docs/decisions.md` del harness, quita `validator-global` de la tabla de agentes del contrato y comprueba que no aparece en los perfiles.
  - **Hecho cuando:** la decisión está apuntada y el contrato no menciona ese agente.

- [ ] **4.5.2 · `design-qa`** · ⏱️ 60 min
  - **Qué:** revisión visual con navegador: capturas en varios tamaños de pantalla comparadas con el diseño.
  - **Por qué:** lint y tests no ven que un botón se salga de la pantalla en el móvil.
  - **Cómo:**
    1. Instala Playwright en el sandbox: `pnpm --dir sandbox add -D playwright` y `pnpm --dir sandbox exec playwright install chromium`.
    2. Añade a la configuración un comando `screenshot` que haga capturas a 375, 768 y 1280 píxeles de ancho.
    3. El agente compara las capturas con `02-design.md` y escribe `05-design-qa.md` con hallazgos `GREEN`, `RED`, `FIX` o `DECIDE`.
    4. Hard limits: no edita código.
  - **Hecho cuando:** pasa el test de agentes y el comando `screenshot` genera 3 imágenes del sandbox.
  - **Referencia:** `.claude/agents/design-qa.md`

### ✅ Checkpoint 4.5
`pnpm test` en verde, **incluido el test de agentes**, que ahora encuentra los 5. Y `set-profile.mjs --check` sale con 0.

---

## Fase 4.6 · Skill de ayuda

- [ ] **4.6.1 · `harness-help`: índice** · ⏱️ 20 min
  - **Qué:** `.claude/skills/harness-help/SKILL.md`, un índice corto que dice qué referencia leer para cada tema.
  - **Por qué:** las skills largas se cargan enteras y gastan contexto. Con un índice y referencias, el agente solo lee lo que necesita.
  - **Cómo:** una tabla tema | fichero | cuándo leerlo.
  - **Hecho cuando:** existe el índice.
  - **Referencia:** `.claude/skills/spec-help/SKILL.md`

- [ ] **4.6.2 · Las referencias** · ⏱️ 45 min
  - **Qué:** un fichero por tema en `.claude/skills/harness-help/references/`: puertas, bloqueos, journal, familias del auditor, perfiles de modelo, modo automático.
  - **Por qué:** son las preguntas que te harás (y se harán los agentes) una y otra vez.
  - **Cómo:** cada referencia resume su sección del contrato en menos de 60 líneas y enlaza a ella.
  - **Hecho cuando:** existen las 6 referencias.
  - **Referencia:** `.claude/skills/spec-help/references/`

### ✅ Checkpoint 4.6
Pregunta en Claude Code "¿qué pasa si el plan dice Split?" y comprueba que lee la referencia de puertas, y solo esa.

---

## 🏁 Hito Etapa 4

- Commit `etapa-4: perfiles de modelo y 6 agentes` y etiqueta `etapa-4`.
- `CHANGELOG.md`: el perfil activo y cuánto cupo gastó probar los agentes.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| Los agentes escritos por Claude son larguísimos | Límite de 150 líneas por agente. Lo que sobre, a una referencia de `harness-help` |
| Un agente ignora sus límites (el reviewer edita) | Quítale la herramienta, no solo la instrucción. Si no tiene `Edit`, no puede editar |
| Playwright da problemas en Windows | Instala solo Chromium. Si sigue, deja `design-qa` como opcional y sigue adelante |
| Gastas mucho cupo probando | Prueba con el perfil Pro y peticiones pequeñas. Mira `/usage` tras cada prueba |
