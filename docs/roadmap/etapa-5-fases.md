# 🔄 Etapa 5 · Las 4 fases

**Objetivo:** convertir todo lo anterior en un proceso: cuatro comandos que llevan un ticket de la idea al código validado, cada uno con su artefacto, su validador y una pausa para que decidas tú.

**Al acabar tendrás:** `/spec-clarify`, `/spec-plan`, `/spec-implement` y `/spec-validate` funcionando en modo interactivo, con **SDD** (primero la especificación, después el código) y **TDD comprobado por script** (primero el test que falla, después el código que lo hace pasar), un test que vigila las skills y tu primer ticket del sandbox terminado en `GREEN`.

**Requisitos previos:** Etapas 3 y 4 (validadores, journal, bloqueos y agentes).
**Tiempo:** 16–18 h.

> 💡 **De la charla:** "Pasamos de pimponear con el modelo a una metodología sistemática." Las dos primeras fases son conversacionales (contigo); las dos últimas, mecánicas (subagentes aislados). El commit y la PR, siempre manuales.

> 🧪 **SDD y TDD, en una frase cada uno.** **SDD** (desarrollo guiado por especificación): nadie escribe código hasta que el ticket está aclarado (`00`), diseñado (`02`) y planificado con su Definition of done (`03`). **TDD** (desarrollo guiado por tests): en cada capa, primero se escriben los tests que demuestran esa Definition of done, se comprueba que **fallan**, y solo entonces se escribe el código hasta que **pasan**, sin tocar los tests. El agente no puede saltarse el orden porque lo comprueba `tdd-check.mjs`, no él.

> 📌 **El modo automático (headless) no entra aquí.** Lo añadirás en la Etapa 9. Ahora todo es interactivo, con pausas.

---

## Fase 5.1 · Preparar el terreno

- [ ] **5.1.1 · Tickets de prueba para el sandbox** · ⏱️ 30 min
  - **Qué:** tres tickets en `tickets/` con el formato del contrato.
  - **Por qué:** necesitas tickets pensados para probar cosas concretas del harness, no features "de verdad".
  - **Cómo:**
    - `FEATURE-1` · **Media de una lista**: una función `average` en `core`, un componente que la muestra en `ui` y su uso en `app`. Toca las 3 capas con pocas líneas: es el ticket del "camino feliz".
    - `FIX-1` · **El total no admite decimales**: un fallo pequeño en una sola capa. Sirve para comprobar que las capas sin cambios se saltan.
    - `FEATURE-2` · **Calculadora completa con historial guardado**: grande a propósito, para que Gate B diga `Split`.
  - **Hecho cuando:** los tres tickets existen con descripción y criterios de aceptación.
  - **Referencia:** `tickets/`
  - **Nota:** de momento los escribes a mano. En la Etapa 6 pasarán al `roadmap.md` del sandbox y, desde entonces, los tickets saldrán solos del roadmap.

- [ ] **5.1.2 · Plantilla común de skill de fase** · ⏱️ 30 min
  - **Qué:** `templates/phase-skill.md` con la cabecera y las secciones fijas.
  - **Por qué:** las 4 fases se comportan igual en lo básico: reciben un ID, comprueban la fase anterior, validan lo que escriben y paran.
  - **Cómo:**
    ```markdown
    ---
    name: spec-<fase>
    description: <qué hace esta fase, una frase>
    argument-hint: "[TICKET]"
    disable-model-invocation: true   # solo la lanzas tú, nunca sola
    model: <lo pone set-profile.mjs>
    effort: <lo pone set-profile.mjs>
    ---

    # spec-<fase> $0                 ← $0 es el ID del ticket

    ## Preconditions   qué tiene que existir antes
    ## Context         qué leer (configuración, convenciones, artefactos)
    ## Steps           pasos numerados
    ## Journal         qué apuntar y con qué kind
    ## Pause           qué decirte al terminar
    ```
  - **Hecho cuando:** la plantilla existe.
  - **Referencia:** `.claude/skills/spec-clarify/SKILL.md`

- [ ] **5.1.3 · Las 6 reglas comunes** · ⏱️ 20 min
  - **Qué:** una referencia `harness-help/references/phase-rules.md` con las reglas que cumplen todas las fases.
  - **Por qué:** escribirlas una vez y que cada skill diga "sigue phase-rules" evita 4 versiones distintas de la misma regla.
  - **Cómo:** las reglas:
    1. El único argumento es el ID, y debe cumplir `ticketPattern`.
    2. Si falta el artefacto de la fase anterior o no pasa su validador, no arrancas.
    3. Tras escribir un artefacto, pasas su validador y corriges hasta que pase.
    4. Nunca buscas por todo el repo: eso lo hace el `explorer`.
    5. Todo lo que falla, se desvía o decide el usuario va al journal con `journal-append.mjs`.
    6. Al terminar, paras y dices cuál es el siguiente comando.
    7. Los encargos a los subagentes los prepara `context-pack.mjs`, y las comprobaciones las hace `run-checks.mjs`: nunca se copian ni se rellenan a mano (economía de tokens, Etapa 3).
  - **Hecho cuando:** la referencia existe y está enlazada desde el índice de `harness-help`.
  - **Referencia:** `docs/contracts.md` §9

- [ ] **5.1.4 · Test de skills** · ⏱️ 30 min
  - **Qué:** `.claude/scripts/skills.test.mjs`, que comprueba las 4 skills de fase.
  - **Por qué:** igual que con los agentes: si borras sin querer una sección, el test lo dice.
  - **Cómo:** para cada `spec-*`: cabecera con `disable-model-invocation: true` y `argument-hint`, las 5 secciones en orden, y que mencione el validador de su artefacto y `phase-rules`.
  - **Hecho cuando:** el test existe. Fallará hasta que existan las skills.

- [ ] **5.1.5 · `context-pack.mjs`: los encargos los prepara un script** · ⏱️ 75 min
  - **Qué:** `node .claude/scripts/context-pack.mjs <agente> <ID> [capa]`, que imprime el encargo exacto de cada subagente.
  - **Por qué:** es el script que **más tokens ahorra**. Sin él, el hilo principal lee el plan, el `CLAUDE.md`, las lecciones y el journal, y luego **reescribe** trozos en el encargo. Lo que escribe un modelo es lo más caro.
  - **Cómo:** una función por agente:
    - `developer` y `reviewer`: el ticket, los pasos de esa capa copiados literalmente de `03-plan.md`, su bloque de interfaces, su `CLAUDE.md`, sus lecciones confirmadas y las 10 últimas líneas del journal.
    - `plan-auditor`: `00-clarification.md`, `02-design.md` y `03-plan.md` (más adelante, las decisiones vigentes).
    - `explorer`: el ticket, la pregunta y la ruta del mapa del código.
    - `design-qa`: la sección de diseño, las capturas y los viewports.

    Todo extraído con las utilidades de Markdown de la Etapa 3. Si falta algo (por ejemplo, una capa sin interfaz), sale con 1 y dice qué.
  - **Hecho cuando:** con el plan de ejemplo de los fixtures, el encargo del developer para `core` contiene sus pasos y su interfaz, y nada de las otras capas.

- [ ] **5.1.6 · Tests de `context-pack.mjs`** · ⏱️ 30 min
  - **Qué:** un test por tipo de encargo.
  - **Por qué:** un encargo incompleto hace que el agente pregunte o se invente lo que falta, y eso cuesta más que lo que ahorra.
  - **Cómo:** comprueba que cada encargo contiene lo que debe y no contiene lo de otras capas; y que falta de datos da error.
  - **Hecho cuando:** los tests pasan.

### ✅ Checkpoint 5.1
Tres tickets escritos, la plantilla y las reglas comunes listas, `context-pack.mjs` con sus tests en verde, y el test de skills fallando porque aún no hay skills.

---

## Fase 5.2 · `/spec-clarify` · entender qué hay que hacer

- [ ] **5.2.1 · Escribir la skill** · ⏱️ 60 min
  - **Qué:** `.claude/skills/spec-clarify/SKILL.md`.
  - **Por qué:** es la fase donde se ahorra más trabajo. Un ticket mal entendido produce un plan perfecto de la cosa equivocada.
  - **Cómo:** los pasos de la skill:
    1. Comprueba el ID y que existe `tickets/<ID>.md`.
    2. Carga `project-conventions`.
    3. Pide al `explorer` las anclas de código: qué ficheros existentes tienen que ver con el ticket.
    4. Pregúntate a ti (al usuario) lo que no esté claro, **citando código real**, de una en una o en grupos pequeños, con una respuesta recomendada.
    5. Escribe un resumen: qué se va a hacer y por qué. Espera tu confirmación.
    6. Escribe `specs/<ID>/00-clarification.md` y pasa `validate-clarification.mjs` hasta que esté en verde.
    7. Para y di: "Siguiente: `/spec-plan <ID>`".
  - **Hecho cuando:** pasa el test de skills (en lo que toca a esta skill).
  - **Referencia:** `.claude/skills/spec-clarify/SKILL.md`

- [ ] **5.2.2 · Probarla con `FEATURE-1`** · ⏱️ 30 min
  - **Qué:** `/spec-clarify FEATURE-1` en el sandbox.
  - **Por qué:** la primera prueba real de una fase.
  - **Cómo:** ejecuta, responde, confirma. Apunta `/usage` antes y después.
  - **Hecho cuando:** existe `specs/FEATURE-1/00-clarification.md`, pasa su validador, y las preguntas citaban ficheros reales del sandbox.

- [ ] **5.2.3 · Probar las protecciones** · ⏱️ 15 min
  - **Qué:** lanzar la skill mal a propósito.
  - **Por qué:** una puerta que no se cierra no protege.
  - **Cómo:** `/spec-clarify hola` (ID inválido) y `/spec-clarify FEATURE-99` (ticket que no existe).
  - **Hecho cuando:** en los dos casos se niega y explica por qué, sin escribir nada.

### ✅ Checkpoint 5.2
`00-clarification.md` válido para `FEATURE-1`, y las dos protecciones funcionan.

---

## Fase 5.3 · `/spec-plan` · decidirlo todo antes de programar

La fase más larga. Va en tres bloques: inventario, diseño y plan.

- [ ] **5.3.1 · Contexto y lecciones** · ⏱️ 20 min
  - **Qué:** el arranque de `.claude/skills/spec-plan/SKILL.md`.
  - **Por qué:** el plan tiene que saber qué capas toca el ticket y qué errores ya se cometieron en ellas.
  - **Cómo:** la skill lee `00-clarification.md` (y comprueba que pasa su validador), deduce las capas candidatas y carga de `specs/lessons.json` solo las lecciones `confirmed` y `applied` de esas capas. Si el fichero no existe todavía, sigue sin lecciones.
  - **Hecho cuando:** la sección de contexto está escrita.

- [ ] **5.3.2 · Inventario → `01-research.md`** · ⏱️ 30 min
  - **Qué:** el paso que pide al `explorer`, capa por capa, qué existe ya.
  - **Por qué:** el inventario solo describe; no decide nada. Separar "qué hay" de "qué haremos" evita diseñar sobre suposiciones.
  - **Cómo:** una llamada al explorer por capa candidata, y escribir `01-research.md` con `Inventory` (una subsección por capa), `Existing patterns` y `Gaps`.
  - **Hecho cuando:** el paso está escrito.
  - **Referencia:** `.claude/skills/spec-plan/SKILL.md`

- [ ] **5.3.3 · Diseño → `02-design.md` y Gate A** · ⏱️ 45 min
  - **Qué:** el paso de diseño y la primera puerta.
  - **Por qué:** obligarse a escribir al menos dos alternativas hace pensar de verdad. Y tú apruebas antes de seguir.
  - **Cómo:**
    1. Escribe `02-design.md`: alternativas con pros y contras, decisiones `D1…Dn` todas `Status: closed.`, asignación por capa y riesgos.
    2. Pasa `validate-design.mjs` hasta que esté en verde.
    3. **Gate A:** te enseña el diseño resumido y espera. Si pides cambios, vuelve al punto 1. Tu decisión va al journal como `user_decision`.
  - **Hecho cuando:** el paso está escrito.
  - **Referencia:** `.claude/skills/spec-help/references/gates.md`

- [ ] **5.3.4 · Plan → `03-plan.md`, Gate B y Gate M** · ⏱️ 60 min
  - **Qué:** el paso que escribe el plan, con sus tests decididos de antemano.
  - **Por qué:** es el documento del que vive la fase 3. Cada paso con su fichero y su instrucción, para que el developer no tenga que decidir nada. Y si los tests se deciden aquí, el developer no puede elegir después los que le resulten cómodos.
  - **Cómo:**
    1. Escribe `03-plan.md`: tabla de alcance con veredicto, interfaces por capa, pasos, Definition of done en EARS y la **tabla `Tests`**: cada criterio de la Definition of done con al menos un test (`T1 · D1 · fichero de test · capa · qué comprueba`). Una capa que no se puede probar con tests (solo estilos, solo configuración) lo dice con `Tests: none — <motivo>`. Deja la línea `Audit` pendiente.
    2. Amplía `validate-plan.mjs` con una comprobación más: cada criterio tiene al menos un test, cada test apunta a un criterio que existe, y cada `none` lleva motivo. Pasa el validador. Si falla por Gate B (`Split`), **para**: te propone cómo trocear el ticket y decides tú. Nunca cambia el diseño para pasar la puerta.
    3. Si falla por Gate M (migraciones), te pregunta; si apruebas, añade `Migration approved: yes` y lo apunta como `user_decision`.
  - **Hecho cuando:** el paso está escrito.

- [ ] **5.3.5 · Gate C · el bucle de auditoría** · ⏱️ 30 min
  - **Qué:** el paso que llama al `plan-auditor` y corrige.
  - **Por qué:** una segunda opinión, con otro contexto, antes de escribir código.
  - **Cómo:**
    1. Llama al auditor con el encargo de `context-pack.mjs plan-auditor <ID>`.
    2. Si hay bloqueantes (🔴), corrige el plan y vuelve a auditar. **Máximo 3 vueltas.**
    3. Cada hallazgo va al journal como `auditor_finding`.
    4. Con `Blocking: 0`, escribe la línea `Audit` y pasa `validate-plan.mjs` por última vez.
    5. Si tras 3 vueltas quedan bloqueantes, para y decides tú.
    6. Para y di: "Siguiente: `/spec-implement <ID>`".
  - **Hecho cuando:** pasa el test de skills para `spec-plan`.
  - **Referencia:** `.claude/agents/plan-auditor.md`

- [ ] **5.3.6 · Probarla con `FEATURE-1`** · ⏱️ 45 min
  - **Qué:** `/spec-plan FEATURE-1`.
  - **Por qué:** comprobar las tres puertas en un caso real.
  - **Cómo:** ejecuta, aprueba el diseño en Gate A y deja que el auditor trabaje. Apunta `/usage`.
  - **Hecho cuando:** existen `01`, `02` y `03`, los validadores pasan y `journal.jsonl` tiene tu decisión de Gate A.

- [ ] **5.3.7 · Probar Gate B con `FEATURE-2`** · ⏱️ 30 min
  - **Qué:** `/spec-clarify FEATURE-2` y `/spec-plan FEATURE-2`.
  - **Por qué:** comprobar que un ticket demasiado grande se para de verdad.
  - **Cómo:** sigue las dos fases hasta que el plan llegue a Gate B.
  - **Hecho cuando:** el plan se para con `Split` y te propone tickets más pequeños, sin haber cambiado el diseño para colarse.

### ✅ Checkpoint 5.3
`FEATURE-1` tiene su plan auditado con `Blocking: 0`. `FEATURE-2` se paró en Gate B. Lee los dos `03-plan.md`: ¿podrías implementar `FEATURE-1` tú solo siguiendo los pasos, sin decidir nada? Si no, mejora la skill.

---

## Fase 5.4 · `/spec-implement` · construir capa a capa

- [ ] **5.4.1 · El bucle por capas** · ⏱️ 45 min
  - **Qué:** `.claude/skills/spec-implement/SKILL.md`, con el bucle principal.
  - **Por qué:** en serie y capa a capa: primero lo que no depende de nadie, después lo que depende de ello.
  - **Cómo:**
    1. Comprueba que `03-plan.md` pasa su validador.
    2. Recorre las capas en el orden de la configuración, saltando las que tengan `- None`.
    3. Para cada capa, en este orden (TDD): el developer escribe **solo los tests** de la capa → `tdd-check.mjs red` (tienen que fallar) → el developer escribe el código → `tdd-check.mjs green` (tienen que pasar, con los tests sin tocar) → marcar pasos → reviewer. Las capas con `Tests: none` se saltan el rojo y el verde.
    4. Al acabar todas, para y di: "Siguiente: `/spec-validate <ID>`".
  - **Hecho cuando:** el bucle está escrito.
  - **Referencia:** `.claude/skills/spec-implement/SKILL.md`

- [ ] **5.4.2 · El encargo al developer** · ⏱️ 15 min
  - **Qué:** cómo la skill le pasa el trabajo al developer.
  - **Por qué:** el developer arranca sin contexto. Todo lo que necesita tiene que ir en el encargo, y nada más.
  - **Cómo:** la skill ejecuta `node .claude/scripts/context-pack.mjs developer <ID> <capa>` y pasa su salida tal cual. Nunca escribe el encargo a mano.
  - **Hecho cuando:** el paso está en la skill.

- [ ] **5.4.3 · Bloqueos y casillas** · ⏱️ 20 min
  - **Qué:** qué hacer cuando el developer termina.
  - **Por qué:** si se bloquea, para; si termina, el plan refleja el avance para poder reanudar.
  - **Cómo:**
    1. Si responde `BLOCKED <motivo>`: para y te pregunta.
    2. Si termina: ejecuta `node .claude/scripts/plan-check.mjs <ID> S1 S2…` con los pasos hechos. Nunca edites el plan a mano para esto.
  - **Hecho cuando:** el paso está escrito.

- [ ] **5.4.4 · El encargo al reviewer y su bucle** · ⏱️ 30 min
  - **Qué:** la revisión de cada capa.
  - **Por qué:** un segundo par de ojos con otro modelo, capa a capa, antes de pasar a la siguiente.
  - **Cómo:**
    1. Llama al reviewer con el encargo de `context-pack.mjs reviewer <ID> <capa>`. El diff lo saca él con `diff-pack.mjs`.
    2. Hallazgos `BLOCKING`: vuelven **una vez** al developer en modo arreglo. Si siguen, para y decides tú.
    3. Hallazgos `NOTE`: al journal como `reviewer_finding`, sin parar.
  - **Hecho cuando:** pasa el test de skills para `spec-implement`.

- [ ] **5.4.5 · Reanudar** · ⏱️ 20 min
  - **Qué:** que la fase pueda continuar donde se quedó.
  - **Por qué:** con tu cupo de 5 horas, un ticket se puede cortar a mitad. No quieres empezar de cero.
  - **Cómo:** al arrancar, si hay pasos `[x]`, salta las capas completas y empieza por la primera con pasos pendientes. Lee la cola del journal para no repetir lo que ya falló.
  - **Hecho cuando:** el paso está escrito.

- [ ] **5.4.6 · `tdd-check.mjs`: el rojo y el verde los comprueba un script** · ⏱️ 60 min
  - **Qué:** un script que comprueba las dos mitades del TDD de cada capa y deja constancia.
  - **Por qué:** un agente puede saltarse el TDD sin querer: escribir el código antes que el test, o retocar el test hasta que pase. Si lo comprueba un script, no depende de que el modelo se porte bien.
  - **Cómo:**
    1. Añade a `harness.config.json` el comando para ejecutar ficheros de test concretos: `"commands": { "testFiles": "pnpm vitest run {files}" }`.
    2. `tdd-check.mjs red <ID> <capa>`: ejecuta solo los tests de esa capa que lista `03-plan.md`. Tienen que **existir y fallar**. Si alguno ya pasa, avisa: ese test no prueba nada nuevo o el código ya existía. Guarda la huella (un hash) de cada fichero de test.
    3. `tdd-check.mjs green <ID> <capa>`: los mismos tests tienen que pasar y su huella tiene que ser **la misma** que en rojo. Si un test cambió entre medias, sale `TESTS_CHANGED` y la capa no avanza.
    4. Cada resultado va a `specs/<ID>/tdd.jsonl`, con la hora de `stamp()`.
    5. Amplía `validate-dod.mjs`: cada capa con tests necesita su `red` y luego su `green` en `tdd.jsonl`. Si falta alguno, el veredicto no puede ser `GREEN`.
    6. Tests del propio script: un test que ya pasa en rojo, un test que no existe, un test cambiado entre rojo y verde, y una capa con `none`.
  - **Hecho cuando:** los tests del script pasan y `validate-dod.mjs` rechaza un ticket sin rojo.

- [ ] **5.4.7 · El encargo en dos tiempos** · ⏱️ 30 min
  - **Qué:** separar el encargo de los tests y el del código.
  - **Por qué:** si un mismo encargo pide tests y código, el agente escribe las dos cosas a la vez y el rojo nunca existe.
  - **Cómo:**
    1. `context-pack.mjs` gana el modo `developer-tests`: recibe la tabla `Tests` de la capa y sus interfaces, y tiene prohibido tocar código que no sea de test.
    2. El modo `developer` recibe los tests ya escritos con la orden "haz que pasen sin modificarlos".
    3. Si el developer cree que un test está mal, responde `BLOCKED test-wrong <T-n> <motivo>` en vez de cambiarlo, y decides tú.
  - **Hecho cuando:** los dos encargos existen y el test de skills comprueba que `spec-implement` llama a `tdd-check` en rojo y en verde.

- [ ] **5.4.8 · Probarla con `FEATURE-1`** · ⏱️ 45 min
  - **Qué:** `/spec-implement FEATURE-1`.
  - **Por qué:** el primer código escrito por tu factoría.
  - **Cómo:** ejecuta y observa en cada capa: los tests del developer, el rojo, el código, el verde, el hook de lint actuando, las casillas marcándose y el reviewer. Apunta `/usage`.
  - **Hecho cuando:** todos los pasos están en `[x]`, los tests del sandbox pasan, el reviewer revisó cada capa y `tdd.jsonl` tiene un rojo antes de cada verde.

- [ ] **5.4.9 · Probar la reanudación** · ⏱️ 30 min
  - **Qué:** cortar una implementación a mitad y relanzarla.
  - **Por qué:** comprobar que funciona antes de necesitarlo de verdad.
  - **Cómo:** con `FIX-1` (tras clarify y plan), lanza `/spec-implement`, páralo con Esc en mitad de la primera capa y vuelve a lanzarlo.
  - **Hecho cuando:** continúa donde estaba sin rehacer lo marcado.

- [ ] **5.4.10 · Probar la trampa** · ⏱️ 30 min
  - **Qué:** comprobar que el sistema pilla un test debilitado.
  - **Por qué:** es justo lo que hace un agente con prisa: si un test no pasa, lo "arregla" para que pase con cualquier cosa. Quieres ver que eso no cuela.
  - **Cómo:** en `FIX-1`, después del rojo, cambia a mano un `expect` del test para que pase siempre, y lanza el verde.
  - **Hecho cuando:** sale `TESTS_CHANGED`, la capa no avanza y `validate-dod.mjs` no da `GREEN`.

### ✅ Checkpoint 5.4
`FEATURE-1` implementado con todos los pasos marcados y un rojo antes de cada verde, `FIX-1` reanudado correctamente y la trampa del test debilitado detectada. Mira el código: ¿respeta las capas y el plan? Si algo no cuadra, mejora el encargo al developer.

---

## Fase 5.5 · `/spec-validate` · comprobar el conjunto

- [ ] **5.5.1 · Validación global** · ⏱️ 30 min
  - **Qué:** `.claude/skills/spec-validate/SKILL.md`, primera parte.
  - **Por qué:** cada capa pasó sus checks, pero falta comprobar que todo junto funciona.
  - **Cómo:**
    1. Ejecuta `node .claude/scripts/run-checks.mjs <ID>`: lo comprueba todo, escribe `04-dod.md` y lo valida. Sin agente: no gasta tokens.
    2. Si sale `RED`, lee solo el resumen recortado de fallos que imprime el script.
    3. Si hay supresiones de lint, te enseña cada una y decides cuáles son aceptables (al journal como `user_decision`).
    4. Si es `RED`: te propone volver a `/spec-implement` o arreglarlo a mano, y decides tú. Al journal como `validator_red`.
  - **Hecho cuando:** la parte está escrita.
  - **Referencia:** `.claude/skills/spec-validate/SKILL.md`

- [ ] **5.5.2 · Bucle de diseño visual** · ⏱️ 30 min
  - **Qué:** la segunda parte, solo si el ticket tocó la interfaz.
  - **Por qué:** lint y tests no ven los problemas visuales.
  - **Cómo:**
    1. Mira con `git diff --name-only` si cambió algún fichero con extensión de `uiExtensions`.
    2. Si cambió: levanta el servidor de desarrollo y llama a `design-qa`.
    3. Hallazgos `FIX`: developer y reviewer de esa capa. **Máximo 3 rondas.** Hallazgos `DECIDE`: decides tú.
    4. Si se tocó código, repite `run-checks.mjs`.
    5. Termina con `04-dod.md` en verde (y `05-design-qa.md` si aplica). Di: "Listo. Revisa el diff y haz tú el commit".
  - **Hecho cuando:** pasa el test de skills para las 4 fases.

- [ ] **5.5.3 · Probarla con `FEATURE-1`** · ⏱️ 30 min
  - **Qué:** `/spec-validate FEATURE-1`.
  - **Por qué:** cerrar tu primer ticket completo.
  - **Cómo:** ejecuta y revisa `04-dod.md` y, si aplica, las capturas.
  - **Hecho cuando:** `04-dod.md` dice `GREEN` y pasa su validador.

### ✅ Checkpoint 5.5
`FEATURE-1` cerrado en `GREEN`. `pnpm test` en verde con el test de skills. Haz tú el commit del código de `FEATURE-1`.

---

## Fase 5.6 · Ajustar con lo aprendido

- [ ] **5.6.1 · Medir el primer ticket** · ⏱️ 15 min
  - **Qué:** sumar el cupo que gastó cada fase de `FEATURE-1`.
  - **Por qué:** es tu primera cifra real. Te dice cuántos tickets caben en tu plan.
  - **Cómo:** con tus apuntes de `/usage`, escribe una tabla fase | % de sesión | % semanal en el `CHANGELOG.md`.
  - **Hecho cuando:** la tabla existe.

- [ ] **5.6.2 · Lista de fricciones** · ⏱️ 30 min
  - **Qué:** todo lo que fue raro, lento o confuso en las pruebas.
  - **Por qué:** son las primeras mejoras del harness, y las que más rinden.
  - **Cómo:** apúntalas y arregla las 3 más importantes en las skills o los agentes.
  - **Hecho cuando:** has arreglado 3 y el resto está en una sección "Pendiente" del `CHANGELOG.md`.

### ✅ Checkpoint 5.6
Vuelve a ejecutar `FIX-1` entero tras tus arreglos. Debería ir más fluido que la primera vez.

---

## 🏁 Hito Etapa 5

- Commit `etapa-5: las 4 fases, primer ticket en verde` y etiqueta `etapa-5`. **Es el hito más importante: ya tienes una factoría que funciona.**
- `CHANGELOG.md`: la tabla de cupo por fase y las fricciones arregladas.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| Se te acaba el cupo de 5 horas a mitad de un ticket | Haz una fase por sesión al principio. La reanudación de 5.4.5 existe para esto |
| El plan sale vago y el developer decide por su cuenta | Endurece el auditor (familia F4, pseudocódigo vago) y añade un fixture al validador |
| Las skills son tan largas que el modelo se salta pasos | Mueve los detalles a referencias de `harness-help` y deja en la skill solo los pasos numerados |
| Te frustras porque va lento | Normal: es la primera vez. La Etapa 8 hace que cada ticket enseñe al siguiente |
| Una capa es difícil de probar antes de escribirla (interfaz visual, integración con un servicio externo) | Pruébala por su comportamiento (qué se ve, qué se envía), no por cómo está hecha. Si de verdad no se puede, `Tests: none — <motivo>`, y lo cubre la validación visual de 5.5.2 |
