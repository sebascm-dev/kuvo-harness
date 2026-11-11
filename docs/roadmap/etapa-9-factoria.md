# 🏗️ Etapa 9 · Modo factoría

**Objetivo:** que las 4 fases corran solas, sin nadie al teclado, parando solo cuando de verdad haga falta una persona. Y que dos modelos discutan el resultado antes de que lo mires tú.

**Al acabar tendrás:** las skills preparadas para modo automático, `scripts/headless.mjs` (el piloto automático de un ticket), `scripts/factory.mjs` con **6 modos de ejecución** (de un ticket por sesión a sin parar hasta que haga falta una persona), métricas de tiempo y coste, `scripts/adversarial-review.mjs` las herramientas para **medir dónde se va el cupo y recortarlo**, incluido un carril rápido para tickets pequeños, y **varios tickets a la vez**, cada uno en su propia carpeta, sin pisarse.

**Requisitos previos:** Etapas 5 a 8 (las fases funcionan en interactivo, los documentos están vivos, el proyecto se define con el descubrimiento y la memoria está cerrada).
**Tiempo:** 23–25 h.

> 💡 **De la charla:** "Desatendido no es lo mismo que sin decisiones." En modo automático, donde la fase te preguntaría, elige la opción más conservadora y lo apunta. Y si no hay opción segura, para.

---

## Fase 9.1 · Preparar las skills para ir solas

- [ ] **9.1.1 · Los valores conservadores** · ⏱️ 30 min
  - **Qué:** la referencia `harness-help/references/headless.md` con qué hacer en cada punto donde normalmente decides tú.
  - **Por qué:** sin una tabla escrita, cada fase inventaría su propia forma de "ir a lo seguro".
  - **Cómo:** copia y adapta su tabla:

    | Punto | En interactivo | En automático |
    |---|---|---|
    | Duda en clarify | Te pregunta | La lectura más estrecha del ticket, sin alcance nuevo |
    | Clarify sin respuesta segura | Te pregunta | `BLOCKED NEEDS_DECISION` |
    | Gate A | Apruebas tú | Aprueba tal cual y lo apunta |
    | Gate B `Split` | Te propone trocear | `BLOCKED NEEDS_DECISION` |
    | Gate M (migraciones) | Apruebas tú | `BLOCKED NEEDS_DECISION`, siempre |
    | Gate C tras 3 vueltas | Decides tú | `BLOCKED NEEDS_DECISION` |
    | Agente bloqueado | Te pregunta | `BLOCKED.md` con su motivo |
    | Supresiones de lint | Decides tú | Todas bloqueantes, veredicto `RED` |
    | Design QA | Se ejecuta | Se salta (necesita navegador) |
    | Decisiones del proyecto en Gate A | Las apruebas tú | Se registran con `Source: <ID> · Gate A (headless)` |
    | Una decisión que sustituye a otra vigente | Te pregunta | `BLOCKED NEEDS_DECISION` |
    | `Architecture impact` | Se aplica al terminar | Se aplica igual: lo revisas en la PR |
    | `/project-roadmap` y Gate R | Los usas tú | Nunca en automático: el roadmap solo lo cambias tú |
    | `/discovery`, `/discovery update` y `/milestone-review` | Los usas tú | Nunca en automático: definir el producto y validar hitos es tuyo |
    | Proyecto `NOT READY` | — | La factoría no arranca |

    Cada elección automática va al journal como `decision` con `actor: headless`.
  - **Hecho cuando:** la referencia existe y está en el índice de `harness-help`.
  - **Referencia:** `.claude/skills/spec-help/references/headless.md`

- [ ] **9.1.2 · Sección `Headless` en cada skill** · ⏱️ 45 min
  - **Qué:** una sección final en las 4 skills de fase.
  - **Por qué:** cada fase tiene que saber cuándo está sola y qué hacer entonces.
  - **Cómo:** la sección dice: "Si el prompt de sistema contiene `SPEC_HEADLESS=1`: nunca preguntes; aplica la tabla de `headless.md`; apunta cada elección; ante un bloqueo, usa `write-blocked.mjs` y para". Importante: la skill lo lee del prompt, **no** probando variables de entorno con Bash.
  - **Hecho cuando:** las 4 skills tienen la sección. Actualiza el test de skills para exigirla.

### ✅ Checkpoint 9.1
`pnpm test` en verde con el test de skills actualizado.

---

## Fase 9.2 · El piloto automático `headless.mjs`

- [ ] **9.2.1 · Comprobaciones de arranque** · ⏱️ 30 min
  - **Qué:** el comienzo de `scripts/headless.mjs <TICKET>`.
  - **Por qué:** arrancar sobre un estado sucio produce resultados imposibles de revisar.
  - **Cómo:**
    1. Valida el ID con `ticketPattern`. Si no vale, sale con 2.
    2. Si existe `specs/<ID>/BLOCKED.md`, se niega: "Lee el bloqueo, resuélvelo y bórralo". Sale con 4.
    3. Si hay cambios sin guardar en `projectRoot` (`git status --porcelain`), se niega salvo que pases `--allow-dirty`. Sale con 2.
  - **Hecho cuando:** las tres comprobaciones funcionan a mano.
  - **Referencia:** `scripts/headless.sh`

- [ ] **9.2.2 · Lanzar una fase** · ⏱️ 60 min
  - **Qué:** la función que ejecuta una fase con `claude -p`.
  - **Por qué:** es el corazón del modo automático.
  - **Cómo:**
    ```js
    import { spawnSync } from 'node:child_process';

    function runPhase(phase, ticket, profile) {
      const args = [
        '-p', `/spec-${phase} ${ticket}`,          // la skill es el prompt
        '--append-system-prompt', 'SPEC_HEADLESS=1', // así sabe que va sola
        '--permission-prompts', 'none',            // nadie puede contestar
        '--output-format', 'json',                 // para leer coste y turnos
        '--model', profile.main.model,             // del perfil activo
        '--max-budget-usd', String(config.headless.maxBudgetPerPhase),
      ];
      return spawnSync('claude', args, {
        encoding: 'utf8',
        shell: process.platform === 'win32',       // ver riesgos
        maxBuffer: 50 * 1024 * 1024,
      });
    }
    ```
    Añade a la configuración `headless.maxBudgetPerPhase` (por ejemplo, 4) y `headless.claudeCommand` (por defecto `claude`; los tests pondrán uno falso). Pasa también `--allowedTools` con la misma lista de permisos de `settings.json`.
  - **Hecho cuando:** `node scripts/headless.mjs FEATURE-4 --only clarify` ejecuta solo la primera fase y devuelve el JSON.
  - **Referencia:** `docs/claude-code-reference.md` (apartado Headless)

- [ ] **9.2.3 · Comprobar cada fase al terminar** · ⏱️ 30 min
  - **Qué:** tras cada fase, el runner pasa él mismo el validador del artefacto.
  - **Por qué:** una fase que termina con texto en vez de con su artefacto parece un éxito y no lo es.
  - **Cómo:** después de `clarify`, valida `00`; de `plan`, `02` y `03`; de `validate`, `04` y que diga `GREEN`. Si falla o aparece `BLOCKED.md`, para y sale con 4.
  - **Hecho cuando:** si borras el artefacto a mano tras una fase, el runner lo detecta.

- [ ] **9.2.4 · Encadenar y salir con el código correcto** · ⏱️ 20 min
  - **Qué:** las 4 fases en serie y los códigos de salida.
  - **Por qué:** otro programa (un cron, la Etapa 11) sabrá qué pasó solo mirando el código.
  - **Cómo:** `0` las 4 hechas; `1` falló `claude` o `git`; `2` error de uso; `4` bloqueado. Imprime una línea por fase: `✓ clarify 1m12s` o `✗ plan BLOCKED NEEDS_DECISION`.
  - **Hecho cuando:** cada código se puede provocar a propósito.

- [ ] **9.2.5 · Tests con un `claude` falso** · ⏱️ 45 min
  - **Qué:** `scripts/fixtures/fake-claude.mjs`, que imita a Claude Code: escribe los artefactos de ejemplo y devuelve un JSON como el real.
  - **Por qué:** probar el runner con el Claude real costaría cupo en cada test. El falso es gratis e instantáneo.
  - **Cómo:** el falso lee la fase del argumento `-p` y copia el fixture que toca. Una variable de entorno le hace fallar o crear un `BLOCKED.md`. Casos: todo bien → 0; bloqueo en plan → 4; artefacto que falta → 4; ID inválido → 2; `BLOCKED.md` previo → 4.
  - **Hecho cuando:** los 5 tests pasan.

- [ ] **9.2.6 · Elegir el siguiente ticket solo: `--next`** · ⏱️ 30 min
  - **Qué:** `node scripts/headless.mjs --next`, que pregunta a `next-ticket.mjs` qué toca y lo ejecuta.
  - **Por qué:** es lo que convierte el roadmap en la cola de trabajo de la factoría. Tú decides el orden en `roadmap.md`; la factoría lo sigue.
  - **Cómo:**
    1. Ejecuta `next-ticket.mjs`. Si sale con 1, imprime su motivo y sal con 0 (no hay trabajo no es un error).
    2. Si devuelve un ID, sigue como si lo hubieras pasado a mano.
    3. Al terminar (bien o bloqueado), ejecuta `sync-roadmap.mjs` para que el roadmap refleje el resultado.
    4. Opción `--max <n>`: encadena hasta `n` tickets seguidos, parando en el primer bloqueo.
    5. Añade 2 tests con el `claude` falso: `--next` elige el ticket correcto y, sin trabajo, sale con 0.
  - **Hecho cuando:** los tests pasan y `--next` sobre el roadmap del sandbox elige lo mismo que `next-ticket.mjs`.

### ✅ Checkpoint 9.2
`pnpm test` en verde con los tests del runner, sin haber gastado nada de cupo.

---

## Fase 9.3 · Métricas

- [ ] **9.3.1 · Guardar tiempo y coste por fase** · ⏱️ 30 min
  - **Qué:** que el runner añada una fila a `docs/run-metrics.md` por cada fase.
  - **Por qué:** "medido, no supuesto". Sin cifras no sabes si un cambio en el harness lo hizo mejor o peor.
  - **Cómo:** del JSON de `claude -p` saca `duration_ms`, `num_turns`, `total_cost_usd` y, de `modelUsage`, los tokens por modelo. Una fila: `| ticket | fase | estado | duración | turnos | coste | modelos |`. Con suscripción, el coste es una estimación a precio de lista: úsalo para comparar, no como factura.
  - **Hecho cuando:** tras una fase aparece su fila.
  - **Referencia:** `docs/run-metrics.md`

- [ ] **9.3.2 · Apuntar también los intentos fallidos** · ⏱️ 10 min
  - **Qué:** que las fases bloqueadas también dejen fila, con su motivo.
  - **Por qué:** el coste real de un ticket incluye sus fallos. En la charla, el coste real fue más del doble del anunciado.
  - **Cómo:** el estado de la fila es `blocked <MOTIVO>`.
  - **Hecho cuando:** una fase bloqueada deja su fila.

### ✅ Checkpoint 9.3
Con el `claude` falso, una ejecución deja 4 filas y una ejecución bloqueada deja las filas hasta el bloqueo.

---

## Fase 9.4 · Revisión adversarial

- [ ] **9.4.1 · Los tres prompts** · ⏱️ 45 min
  - **Qué:** `scripts/prompts/reviewer.md`, `rebuttal.md` y `reviewer-reply.md`.
  - **Por qué:** un modelo busca fallos y otro, distinto, intenta rebatirlos. Lo que sobrevive a la discusión es lo que merece tu atención.
  - **Cómo:** el revisor devuelve hallazgos con un formato fijo (`F1 · fichero · problema · por qué importa`); el rebatidor responde a cada uno con `AGREE` o `DISPUTE` y su motivo; el revisor contesta a las disputas.
  - **Hecho cuando:** existen los tres con su formato de salida.
  - **Referencia:** `scripts/prompts/`

- [ ] **9.4.2 · Lector de respuestas** · ⏱️ 30 min
  - **Qué:** `scripts/lib/parse-review.mjs`, que convierte las respuestas en una lista de hallazgos con su estado.
  - **Por qué:** decidir si hay consenso lo hace un script, no un modelo.
  - **Cómo:** con tests sobre respuestas de ejemplo: todo de acuerdo, una disputa, formato roto.
  - **Hecho cuando:** sus tests pasan.
  - **Referencia:** `scripts/lib/parse-review.mjs`

- [ ] **9.4.3 · `adversarial-review.mjs`** · ⏱️ 45 min
  - **Qué:** `node scripts/adversarial-review.mjs <base> <head>`.
  - **Por qué:** es la última comprobación antes de que tú revises la PR.
  - **Cómo:**
    1. Saca el diff limpio con `node .claude/scripts/diff-pack.mjs --range <base>..<head>`.
    2. Revisor con el modelo de `reviewer` del perfil; rebatidor con otro distinto (añade `adversarial.rebuttalModel` a la configuración).
    3. Hasta 3 rondas. Si no queda ninguna disputa: imprime `CONSENSUS` y los hallazgos aceptados, sale con 0. Si quedan: `NO CONSENSUS` con los argumentos de ambos, sale con 3.
  - **Hecho cuando:** con un diff vacío sale `CONSENSUS` sin llamar a ningún modelo.
  - **Referencia:** `scripts/adversarial-review.sh`

### ✅ Checkpoint 9.4
Tests del lector en verde y el script probado con un diff vacío.

---

## Fase 9.5 · Modos de ejecución

> 📌 **Ojo con la palabra "fase".** En esta sección, "fase" y "etapa" son las del **roadmap del proyecto** (Fase 1.2, Etapa 1), no las 4 fases de un ticket (clarify, plan, implement, validate).

| Modo | Qué hace | Cuándo usarlo |
|---|---|---|
| `manual` | Nada automático: lanzas tú las 4 fases de cada ticket (como en la Etapa 5) | Tickets delicados o cuando quieres aprender qué hace cada fase |
| `ticket` | Un ticket y para. **Un ticket por sesión**, semiautomático | Al empezar un proyecto, para revisar cada resultado |
| `phase` | Sigue hasta terminar la fase del roadmap en curso | Cuando ya confías en la factoría para un bloque de trabajo |
| `stage` | Sigue hasta terminar la etapa del roadmap en curso | Bloques grandes y bien definidos |
| `milestone` | Sigue hasta llegar al siguiente hito | Preparar una demo o una entrega |
| `continuous` | No para hasta que haga falta una persona | Noches y fines de semana, con límites de gasto |

**En todos los modos la factoría se para si:** la siguiente tarea es `MANUAL`; algo se bloquea; se llega a un hito (si `stopAtMilestones` es `true`); la siguiente tarea está congelada por un `CR`; se alcanza un límite de tickets, gasto o tiempo; no queda nada disponible; o el proyecto no está `READY`.

- [ ] **9.5.1 · La configuración `execution`** · ⏱️ 30 min
  - **Qué:** la sección nueva de `harness.config.json`.
  - **Por qué:** el modo es una decisión de cada proyecto y de cada momento: el mismo proyecto puede empezar en `ticket` y pasar a `phase` cuando ya confíes.
  - **Cómo:**
    ```json
    "execution": {
      "mode": "ticket",
      "stopAtMilestones": true,
      "designApproval": "auto",
      "limits": { "maxTickets": 10, "maxBudgetUsd": 20, "maxHours": 4 }
    }
    ```
    `designApproval` es `auto` (Gate A se aprueba solo, como en headless) o `human` (la factoría prepara el diseño y espera a que lo apruebes). Actualiza el lector de configuración y sus tests, y apunta en el contrato la tabla de modos y las condiciones de parada.
  - **Hecho cuando:** un modo inventado da error y los tests pasan.

- [ ] **9.5.2 · `factory.mjs`: el bucle** · ⏱️ 75 min
  - **Qué:** `node scripts/factory.mjs`, que encadena tickets según el modo. Se puede cambiar el modo en una ejecución con `--mode phase`.
  - **Por qué:** `headless.mjs` sabe hacer un ticket; `factory.mjs` decide cuántos y cuándo parar.
  - **Cómo:**
    1. Crea un fichero de bloqueo (`specs/.factory.lock`): si ya existe, otra factoría está trabajando y sale.
    2. Comprueba `validate-readiness.mjs`. Si es `NOT READY`, sale explicando por qué.
    3. Apunta dónde empieza: la fase, la etapa y el hito del primer ticket.
    4. Bucle: pide `next-ticket.mjs` → si está fuera del alcance del modo (otra fase, otra etapa, después del hito), para → si no, `headless.mjs <ID>` → `sync-roadmap.mjs` → comprueba las condiciones de parada y los límites.
    5. Al salir, siempre borra el bloqueo y escribe el informe (9.5.4).
  - **Hecho cuando:** con el `claude` falso, `--mode ticket` hace uno y para.

- [ ] **9.5.3 · Aprobación de diseño humana** · ⏱️ 40 min
  - **Qué:** el comportamiento de `designApproval: "human"`.
  - **Por qué:** un punto medio muy útil: la factoría hace el trabajo pesado (clarify y plan), y tú solo apruebas el diseño antes de que escriba código.
  - **Cómo:** tras Gate A, `/spec-plan` escribe `specs/<ID>/AWAITING_APPROVAL.md` con el resumen del diseño y para. El roadmap muestra ` · ⏸️ awaiting approval`. Lo revisas y continúas con `node scripts/factory.mjs --approve <ID>`, que registra tu aprobación como `user_decision` y sigue desde `/spec-plan` (el diseño ya está hecho). Mientras tanto, la factoría puede seguir con otros tickets que no dependan de este. Añade el estado al contrato y al lector del roadmap.
  - **Hecho cuando:** un ticket se queda esperando, otro independiente avanza, y `--approve` lo desbloquea.

- [ ] **9.5.4 · Informe de cada ejecución** · ⏱️ 40 min
  - **Qué:** `specs/runs/<fecha>.md`, escrito al terminar cada ejecución.
  - **Por qué:** cuando vuelves, en un minuto sabes qué ha pasado y qué te toca.
  - **Cómo:** con fecha de `stamp()`. Secciones: `Done` (tickets terminados, con coste y duración), `Stopped because` (el motivo exacto), `Your turn` (lo que te toca: tareas `MANUAL` siguientes, bloqueos, hitos por validar, diseños por aprobar, CR por resolver) y `Next` (qué haría la factoría si la relanzas).
  - **Hecho cuando:** tras una ejecución de prueba, el informe dice por qué paró y qué te toca.

- [ ] **9.5.5 · Tests de los modos** · ⏱️ 60 min
  - **Qué:** tests de `factory.mjs` con el `claude` falso y roadmaps de prueba.
  - **Por qué:** un modo que no para donde debe puede gastar mucho cupo o construir detrás de un hito sin validar.
  - **Cómo:** un test por modo comprobando dónde para; y casos para: tarea `MANUAL` siguiente, bloqueo, hito alcanzado, CR abierto, límite de tickets, proyecto `NOT READY`, bloqueo de dos factorías a la vez y `--approve`.
  - **Hecho cuando:** los 14 casos pasan.

- [ ] **9.5.6 · Aviso al terminar** (opcional) · ⏱️ 20 min
  - **Qué:** que te llegue un aviso cuando la factoría para.
  - **Por qué:** en modos largos te vas a hacer otra cosa; el aviso te dice cuándo volver.
  - **Cómo:** una notificación de Windows desde PowerShell, o un mensaje por el canal que prefieras. Que diga en una línea por qué paró.
  - **Hecho cuando:** te llega el aviso tras una ejecución de prueba.

### ✅ Checkpoint 9.5
`pnpm test` en verde con los tests de los modos, sin gastar cupo.

---

## Fase 9.6 · Prueba real

- [ ] **9.6.1 · Un ticket entero en automático** · ⏱️ 60 min
  - **Qué:** un ticket nuevo y pequeño del sandbox, de principio a fin con `node scripts/headless.mjs <ID>`.
  - **Por qué:** la prueba que demuestra que la factoría funciona sola.
  - **Cómo:** escribe el ticket, guarda tus cambios, apunta `/usage` y lánzalo. No toques nada hasta que termine.
  - **Hecho cuando:** sale con 0, `04-dod.md` dice `GREEN`, el journal tiene las decisiones con `actor: headless`, `run-metrics.md` tiene sus 4 filas y el roadmap tiene la tarea en `[x]`. Mejor aún si lo lanzas con `--next` en vez de con el ID.

- [ ] **9.6.2 · Un bloqueo en automático** · ⏱️ 30 min
  - **Qué:** lanzar en automático un ticket que deba bloquearse (por ejemplo, el grande de Gate B).
  - **Por qué:** parar bien es tan importante como terminar bien.
  - **Cómo:** `node scripts/headless.mjs FEATURE-2`.
  - **Hecho cuando:** sale con 4, existe `BLOCKED.md` con `NEEDS_DECISION` y relanzarlo se niega hasta que lo borras.

- [ ] **9.6.3 · Revisión adversarial del ticket automático** · ⏱️ 20 min
  - **Qué:** `adversarial-review.mjs` sobre el diff del ticket de 9.6.1.
  - **Por qué:** cerrar el circuito completo: ticket → código → discusión → tu revisión.
  - **Cómo:** compara la rama antes y después del ticket.
  - **Hecho cuando:** obtienes `CONSENSUS` o `NO CONSENSUS` y lees los argumentos.

- [ ] **9.6.4 · Usar los créditos de API de Max** (opcional) · ⏱️ 30 min
  - **Qué:** si tienes Max, usar sus 100 $/mes de API para el modo automático.
  - **Por qué:** el modo automático con una clave de API de tu organización de Console gasta esos créditos y no tu cupo de suscripción.
  - **Cómo:** reclama los créditos en Console, crea una clave y pásasela **solo** al runner con una variable de entorno en su propia ejecución, nunca de forma global (recuerda la tarea 0.1.4). Comprueba en Console que el gasto aparece ahí.
  - **Hecho cuando:** una ejecución automática aparece en Console y tu barra de `/usage` no se movió.

- [ ] **9.6.5 · Probar los modos de verdad** · ⏱️ 45 min
  - **Qué:** dos ejecuciones reales en el sandbox: una con `--mode ticket` y otra con `--mode phase`.
  - **Por qué:** los tests con el `claude` falso prueban la lógica; esto prueba que la experiencia es la que quieres.
  - **Cómo:** prepara una fase del roadmap con dos tickets y una tarea `MANUAL` al final. Lanza las dos ejecuciones y lee sus informes.
  - **Hecho cuando:** `ticket` hace uno y para; `phase` hace los dos y para en la tarea `MANUAL`, que aparece en `Your turn`.

### ✅ Checkpoint 9.6
Un ticket automático en `GREEN`, un bloqueo correcto y una revisión adversarial leída. Compara en `run-metrics.md` el coste de este ticket con los manuales de la Etapa 5.

---

## Fase 9.7 · Medir y recortar

> 💡 **Primero medir, luego recortar.** Con los tickets reales de la Fase 9.6 ya tienes datos. Esta fase los usa para gastar menos sin bajar la calidad.

- [ ] **9.7.1 · `cost-report.mjs`** · ⏱️ 60 min
  - **Qué:** un informe que lee `docs/run-metrics.md` y te dice dónde se va el cupo.
  - **Por qué:** sin datos optimizas a ciegas. Puede que tu mayor gasto sea una fase que ni sospechabas.
  - **Cómo:** totales y medias por fase, por modelo y por tipo de ticket (`FEATURE`, `FIX`, `CHORE`); el top 5 de ejecuciones más caras; cuántos tokens fueron de caché (los baratos) y cuántos no; y la evolución por semana. Lo escribe en `docs/cost-report.md`.
  - **Hecho cuando:** con tus métricas reales, sabes qué fase gasta más y cuál ha empeorado.

- [ ] **9.7.2 · Presupuesto de contexto** · ⏱️ 30 min
  - **Qué:** un test que mide el tamaño de cada skill, agente, `CLAUDE.md` y referencia, y falla si alguno pasa de su límite.
  - **Por qué:** estos ficheros se cargan en cada ejecución. Si una skill engorda 200 líneas, lo pagas en cada ticket sin darte cuenta.
  - **Cómo:** estima los tokens como caracteres entre 4 (es aproximado, pero sirve para comparar). Límites en `harness.config.json`, por ejemplo 2.500 por skill y 1.500 por agente. Lo que sobre, a una referencia de `harness-help` que se carga solo cuando hace falta.
  - **Hecho cuando:** el test pasa y conoces el tamaño de cada pieza.

- [ ] **9.7.3 · `classify-ticket.mjs`: el carril rápido** · ⏱️ 90 min
  - **Qué:** un script que, tras `/spec-clarify`, decide si un ticket va por el **carril rápido**.
  - **Por qué:** cambiar un texto o arreglar un fallo pequeño no necesita inventario, dos alternativas de diseño ni una auditoría con Opus. Es donde más se nota el ahorro.
  - **Cómo:**
    1. Reglas del carril rápido: tipo `FIX` o `CHORE`, una sola capa en el alcance de `00-clarification.md`, no toca migraciones ni zonas marcadas como críticas, y no tiene `Project decisions`. Los umbrales, en la configuración.
    2. Escribe `Lane: fast` o `Lane: standard` en `00-clarification.md`.
    3. En carril rápido: sin `01-research.md` (una sola pregunta al `explorer`), `02-design.md` con una alternativa permitida, y auditor con esfuerzo bajo. **Gate B, Gate M, el reviewer y `run-checks` se mantienen siempre.**
    4. Actualiza el contrato, los validadores de diseño y plan (que acepten `Lane: fast`) y `/spec-plan`.
  - **Hecho cuando:** un `FIX` de una capa va por el carril rápido y un `FEATURE` de tres capas no.

- [ ] **9.7.4 · Modelo según el carril** · ⏱️ 30 min
  - **Qué:** que en carril rápido el hilo principal use el modelo más barato del perfil, aunque estés en `max`.
  - **Por qué:** para un ticket pequeño, Opus no aporta lo que cuesta.
  - **Cómo:** añade a los perfiles una entrada `main-fast` y que `headless.mjs` la use cuando el ticket diga `Lane: fast`.
  - **Hecho cuando:** en `run-metrics.md`, el ticket rápido aparece con el modelo barato.

- [ ] **9.7.5 · Recortar con datos** · ⏱️ 60 min
  - **Qué:** comparar el gasto antes y después de las mejoras de esta fase.
  - **Por qué:** una mejora que ahorra cupo pero baja la calidad no es una mejora.
  - **Cómo:** ejecuta 3 tickets parecidos a los de la Fase 9.6 y compara con `cost-report.mjs`: coste por ticket y cuántos acabaron en `GREEN` a la primera. Quédate con los cambios que ahorran sin bajar ese porcentaje y apunta cada uno como decisión.
  - **Hecho cuando:** tienes la comparación en `CHANGELOG.md` y las decisiones apuntadas.

### ✅ Checkpoint 9.7
`cost-report.mjs` muestra que el coste medio por ticket bajó (o explica por qué no) y la tasa de `GREEN` a la primera no empeoró.

---

## Fase 9.8 · Varios tickets a la vez

> 🏭 **Una factoría de verdad tiene varias líneas de producción.** Si dos tickets no dependen el uno del otro y no tocan los mismos ficheros, no hay motivo para esperar. Pero el paralelo tiene tres riesgos, y cada tarea de esta fase cierra uno:
> 1. **Que se pisen:** dos agentes editando el mismo fichero a la vez. → Cada ticket trabaja en **su propia carpeta** (`git worktree`), y dos tickets que tocan lo mismo no van juntos.
> 2. **Que cada uno funcione solo y juntos no:** A cambia una función que B usa. → Antes de dártelos, un script **los junta todos** y vuelve a pasar las comprobaciones.
> 3. **Que se coman el cupo:** dos líneas gastan el doble de rápido. → El número de líneas va con tu plan y con los datos de la Fase 9.7. Por eso esta fase va al final.
>
> Quién va en paralelo lo decide **un script**, con las dependencias del roadmap y los ficheros que lista cada `03-plan.md`. El modelo no opina.

- [ ] **9.8.1 · Las reglas del paralelo** · ⏱️ 30 min
  - **Qué:** escribir en el contrato cuándo dos tickets pueden ir a la vez.
  - **Por qué:** si las reglas están escritas, el script solo las aplica. Si no, acabas decidiendo a ojo.
  - **Cómo:** dos tickets pueden ir a la vez **solo si**:
    1. Sus dependencias (`after:` y `Depends:`) están hechas.
    2. Los ficheros que listan sus `03-plan.md` no se cruzan.
    3. Ninguno de los dos tiene migraciones (Gate M): la base de datos, de uno en uno.
    4. Ninguno toca un fichero **exclusivo** de la configuración (`execution.exclusive`, por ejemplo `package.json`, el lockfile o el esquema de la base de datos).
    5. Hay líneas libres (`schedule.resources.factory.lanes`).

    La fase de plan sí puede ir en paralelo sin límites: solo escribe en `specs/<ID>/`. `set-profile.mjs` propone las líneas por defecto: 1 en el perfil Pro y 2 en el Max. Tú lo cambias con datos.
  - **Hecho cuando:** las reglas están en el contrato con un ejemplo de cada caso.

- [ ] **9.8.2 · `worktree.mjs`: una carpeta por ticket** · ⏱️ 45 min
  - **Qué:** crear, preparar y limpiar una carpeta de trabajo aislada para cada ticket.
  - **Por qué:** con `git worktree` cada ticket tiene su copia del código en su propia rama (`factory/<ID>`), sin clonar el repo otra vez. Dos agentes nunca escriben en la misma carpeta.
  - **Cómo:**
    1. `worktree.mjs add <ID>`: `git worktree add ../<repo>-lanes/<ID> -b factory/<ID>` e instala dependencias (con pnpm comparten almacén y es rápido).
    2. **Aislar lo que se comparte sin querer:** cada línea recibe su número (`LANE=1`, `LANE=2`), y la configuración usa `{lane}` para el puerto y la base de datos de tests (`"testEnv": { "PORT": "30{lane}0" }`). Si los tests de dos líneas usan la misma base de datos, se estropean entre sí.
    3. `worktree.mjs remove <ID>`: quita la carpeta. **Nunca** borra la rama si tiene cambios sin revisar.
    4. La factoría **sigue sin hacer commits**: lo que deja en cada carpeta lo revisas y lo confirmas tú, como siempre. Cada ticket tiene su rama, así que es una PR por ticket.
  - **Hecho cuando:** dos carpetas de dos tickets conviven, cada una con su puerto, y `remove` se niega a borrar una con cambios.

- [ ] **9.8.3 · `lanes.mjs`: el repartidor** · ⏱️ 60 min
  - **Qué:** el script que decide qué tickets entran a trabajar ahora y cuáles esperan.
  - **Por qué:** es el semáforo de la factoría. Si se equivoca, o se pisan o se queda parada sin motivo.
  - **Cómo:**
    1. Toma los tickets disponibles en el orden del roadmap (`next-ticket.mjs --all`).
    2. Los planes los deja pasar a la vez. Para implementar, aplica las reglas de 9.8.1: el primero que cumple entra, el que choca con uno en marcha espera su turno.
    3. Guarda en `specs/runs/lanes.json` qué hace cada línea y por qué espera cada ticket ("comparte `src/core/match.ts` con FEATURE-4").
    4. Mismo estado de entrada → misma decisión. Sin hora del sistema ni nada aleatorio.
  - **Hecho cuando:** con tres tickets de ejemplo (dos independientes y uno que choca), entran los dos independientes y el tercero espera con su motivo.

- [ ] **9.8.4 · `integration-check.mjs`: que juntos también funcionen** · ⏱️ 60 min
  - **Qué:** comprobar que los tickets terminados en paralelo funcionan juntos, antes de dártelos para revisar.
  - **Por qué:** dos tickets pueden pasar sus tests por separado y romperse al juntarlos. Ese fallo no lo ve ninguno de los dos.
  - **Cómo:**
    1. Crea una carpeta temporal desde tu rama principal.
    2. Aplica encima los cambios de todos los tickets en `GREEN` (`git diff` de cada carpeta y `git apply`), en el orden del roadmap. Si uno no encaja, se marca **conflicto**.
    3. Pasa `run-checks.mjs` sobre el conjunto.
    4. Si falla, busca el culpable aplicándolos de uno en uno, y ese ticket vuelve a `RED` con el motivo en su journal.
    5. Borra la carpeta temporal. Nunca toca tu rama principal.
  - **Hecho cuando:** con dos tickets que funcionan por separado pero rompen juntos (uno renombra una función que el otro usa), el script lo detecta y señala al culpable.

- [ ] **9.8.5 · La factoría con varias líneas** · ⏱️ 45 min
  - **Qué:** que `factory.mjs` lleve varias líneas a la vez.
  - **Por qué:** es lo que hace que un proyecto avance prácticamente solo mientras no estás.
  - **Cómo:**
    1. En cada vuelta pregunta a `lanes.mjs` qué tickets entran y lanza un `headless.mjs` por línea, cada uno en su carpeta (procesos hijos de Node).
    2. Los límites de `execution.limits` cuentan para **todas las líneas juntas**: tickets, gasto y horas.
    3. Si una línea se para por una puerta tuya (Gate M, un `BLOCKED`), **las demás siguen**. La factoría solo para del todo cuando no queda nada que puedan hacer las líneas.
    4. Si se alcanza el límite de uso del plan, todas las líneas esperan a la vez. Nada de reintentar en bucle.
    5. Al terminar, `integration-check.mjs` y un único informe en `specs/runs/` con lo de todas las líneas.
  - **Hecho cuando:** en modo `phase` con 2 líneas, los tickets independientes de una fase avanzan a la vez y el informe dice qué hizo cada línea.

- [ ] **9.8.6 · Prueba y medida** · ⏱️ 45 min
  - **Qué:** comparar la misma tanda de tickets en serie y en paralelo.
  - **Por qué:** el paralelo solo compensa si ahorra tiempo **sin** bajar la calidad ni disparar el cupo.
  - **Cómo:** 4 tickets del sandbox (tres independientes y uno que choca con otro). Lánzalos con 1 línea y luego con 2. Compara con `cost-report.mjs`: tiempo total, coste, `GREEN` a la primera y conflictos detectados. Apunta como decisión cuántas líneas usas con tu plan.
  - **Hecho cuando:** tienes la comparación en `CHANGELOG.md` y `lanes` ajustado con datos.

### ✅ Checkpoint 9.8
Con 2 líneas, dos tickets independientes avanzan a la vez en carpetas distintas, el que choca espera con su motivo, `integration-check.mjs` da verde con todo junto, y el cronograma de Notion muestra las dos fases en paralelo. Tu rama principal no tiene ni un commit de la factoría.

---

## 🏁 Hito Etapa 9

- Commit `etapa-9: modo factoría, métricas, revisión adversarial y trabajo en paralelo` y etiqueta `etapa-9`.
- `CHANGELOG.md`: tiempo y coste del ticket automático frente a los manuales.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| `spawnSync('claude')` no encuentra el ejecutable en Windows | Con `shell: true` usa el PATH de la terminal. Si sigue, pon la ruta completa en `headless.claudeCommand` |
| Con `shell: true`, los argumentos con espacios se rompen | Pon cada argumento con espacios entre comillas, o prueba sin `shell` usando la ruta completa del ejecutable |
| Una fase automática se come el cupo | `--max-budget-usd` por fase la para. Empieza bajo y súbelo con datos de `run-metrics.md` |
| No usar nunca `--bare` | Se salta hooks, skills, subagentes y `CLAUDE.md`: el harness entero desaparece |
| Escribir en `.claude/` en automático | Claude Code lo bloquea aunque lo permitas. Por eso todo lo que escriben las fases va en `specs/` |
| Dos líneas usan la misma base de datos o el mismo puerto en los tests | Usa `{lane}` en `testEnv`. Si los fallos aparecen solo en paralelo, casi siempre es esto |
| El paralelo dispara el gasto | Vuelve a 1 línea. Más líneas solo compensan si `cost-report.mjs` dice que el coste por ticket no sube |
| Te llegan demasiadas PR a la vez para revisar | Tu revisión es el cuello de botella. Ajusta `lanes` a lo que puedes revisar de lunes a jueves, no a lo que puede producir la factoría |
