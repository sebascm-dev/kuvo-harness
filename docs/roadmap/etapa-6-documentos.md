# 📄 Etapa 6 · Documentos vivos

**Objetivo:** que cada proyecto tenga cuatro documentos que la factoría lee y mantiene al día: el brief, la arquitectura, el registro de decisiones y el roadmap. Y que **las tareas del roadmap sean los tickets de la factoría**.

**Al acabar tendrás:** el contrato y las plantillas de los cuatro documentos, los scripts que los validan y actualizan, dos skills nuevas (`/project-roadmap` y `/decision`) las 4 fases conectadas a los documentos (los leen antes de trabajar y los actualizan al terminar), un reloj que apunta cuándo empieza y termina cada fase, un **planificador tipo Microsoft Project** (dependencias, recursos, calendario, ruta crítica y línea base) y un panel en Notion donde ves el avance de **todos tus proyectos** en un diagrama de Gantt.

**Requisitos previos:** Etapa 5 (las 4 fases funcionan en interactivo).
**Tiempo:** 28–31 h. Es la etapa más grande: si vas justo de tiempo, la tarea 6.8.4 es opcional, y las Fases 6.9 y 6.10 (Notion y cronograma) se pueden dejar para después de la Etapa 7.

> 💡 **La idea de esta etapa:** la documentación que se actualiza a mano acaba desfasada. Aquí cada documento tiene un **dueño** (una fase o un script), un **formato** (el contrato) y un **validador**. Así se mantiene vivo porque forma parte del proceso, no porque alguien se acuerde.

---

## 🗂️ Los cuatro documentos

| Documento | Qué es | Quién lo escribe | Quién lo lee |
|---|---|---|---|
| `brief.md` | Qué es el producto, para quién y qué no hará | Tú, con ayuda de `/project-roadmap` | `/project-roadmap` y `/spec-clarify` |
| `roadmap.md` | Etapas → fases → tareas. **Cada tarea de la factoría es un ticket** | `/project-roadmap`, y los scripts marcan el estado | `sync-roadmap.mjs`, `next-ticket.mjs`, `/spec-clarify` |
| `architecture.md` | Cómo está construido el sistema ahora mismo | `/spec-validate` al terminar cada ticket | `/spec-plan` y el `plan-auditor` |
| `decisions.md` | Decisiones del proyecto con fecha y hora, solo se añade | `decision-append.mjs`, desde Gate A, `/decision` y `/project-roadmap` | `/spec-plan` y el `plan-auditor` |

**Journal y decisiones no son lo mismo:**
- El **journal** (`specs/<ID>/journal.jsonl`) es la fricción de **un ticket**: lo que falló o se desvió. Sirve para aprender.
- El **registro de decisiones** (`decisions.md`) son las elecciones **del proyecto** que tienen que respetar los tickets futuros: "usamos Supabase Auth", "los precios se guardan en céntimos". Sirve para no contradecirse.

**Cómo se relacionan el roadmap y los tickets:**

```
roadmap.md                        tickets/                specs/
Etapa 1 · MVP
  Fase 1.1 · Datos
    - [ ] FEATURE-1 · ...  ──sync──▶ FEATURE-1.md ──fases──▶ FEATURE-1/04-dod.md (GREEN)
    - [ ] MANUAL-1 · ...             (no es de la factoría)            │
                           ◀──────────── sync marca [x] ◀──────────────┘
```

- `roadmap.md` manda: la lista y el orden de las tareas viven ahí.
- `tickets/<ID>.md` es el detalle de cada tarea de la factoría. Lo crea el script, y `/spec-clarify` lo afina.
- Las tareas `MANUAL-n` son tuyas (comprar un dominio, hablar con el cliente): están en el roadmap, pero la factoría no las toca.

---

## Fase 6.1 · Ampliar el contrato

- [ ] **6.1.1 · Sección: documentos del proyecto** · ⏱️ 20 min
  - **Qué:** una sección nueva en `docs/contracts.md` con la tabla de arriba: documento, dueño, quién lo lee y cuándo se actualiza.
  - **Por qué:** igual que con los artefactos, si el contrato no dice quién puede tocar un documento, acabarán tocándolo todos.
  - **Cómo:** copia la tabla y añade la regla: "ningún agente edita un documento del proyecto salvo la fase o el script que es su dueño".
  - **Hecho cuando:** la sección existe y cada documento tiene un único dueño.

- [ ] **6.1.2 · Formato de `brief.md`** · ⏱️ 15 min
  - **Qué:** los títulos exactos del brief.
  - **Por qué:** es la entrada del roadmap. Sin un "para qué" claro, el roadmap es una lista de ocurrencias.
  - **Cómo:**
    ```markdown
    # <Proyecto> · Brief
    ## Problem       qué problema resuelve, en un párrafo
    ## Users         para quién
    ## Goals         qué tiene que conseguir (medible si se puede)
    ## Non-goals     qué no va a hacer, al menos una línea
    ## Constraints   stack, plazos, presupuesto, normativa
    ```
  - **Hecho cuando:** el formato está en el contrato.

- [ ] **6.1.3 · Formato de `architecture.md`** · ⏱️ 25 min
  - **Qué:** los títulos exactos y las reglas del documento de arquitectura.
  - **Por qué:** `/spec-plan` lo leerá en vez de explorar el repo entero. Si está al día, el plan es más rápido, más barato y más coherente.
  - **Cómo:**
    ```markdown
    # <Proyecto> · Architecture
    ## Overview      qué es el sistema, en un párrafo, y un diagrama sencillo
    ## Layers        tabla capa | carpeta | responsabilidad
    ## Modules       piezas importantes y dónde viven
    ## Data model    tablas o entidades y sus relaciones, o "- None"
    ## Integrations  servicios externos (Supabase, Vercel, APIs), o "- None"
    ## Constraints   reglas que no se rompen, cada una con su decisión: (ADR-003)
    ## Changelog     - 2026-11-08 12:08 · FEATURE-3 · qué cambió
    ```
    Reglas: la tabla `Layers` tiene exactamente las capas de `harness.config.json`, en el mismo orden; cada `Constraint` cita una decisión que existe y sigue vigente; el `Changelog` solo crece y va en orden de fecha.
  - **Hecho cuando:** el formato y las 3 reglas están en el contrato.

- [ ] **6.1.4 · Formato de `decisions.md`** · ⏱️ 25 min
  - **Qué:** el formato de cada entrada del registro.
  - **Por qué:** una decisión sin fecha ni contexto se olvida o se discute dos veces. Este formato es el clásico ADR (Architecture Decision Record).
  - **Cómo:**
    ```markdown
    ## ADR-007 · Guardar los precios en céntimos
    - Date: 2026-11-08 12:08 (Europe/Madrid)
    - Ts: 2026-11-08T11:08:00.000Z
    - Status: accepted              ← accepted o rejected
    - Source: FEATURE-3 · Gate A    ← un ticket y su puerta, manual o roadmap
    - Supersedes: ADR-002           ← o "- None"

    ### Context        por qué hubo que decidir
    ### Decision       qué se decidió
    ### Consequences   qué implica, bueno y malo
    ```
    Reglas: solo se añade, nunca se edita una entrada. Cambiar de opinión es añadir una decisión nueva con `Supersedes`. El estado "sustituida" no se escribe: lo calcula el script. También se apuntan las decisiones **rechazadas** (`Status: rejected`): saber qué se descartó y por qué evita volver a proponerlo.
  - **Hecho cuando:** el formato y las reglas están en el contrato.

- [ ] **6.1.5 · Formato de `roadmap.md`** · ⏱️ 30 min
  - **Qué:** la estructura etapa → fase → tarea y el formato exacto de una tarea.
  - **Por qué:** los scripts lo leen para crear tickets, marcar estados y elegir el siguiente. Tiene que ser exacto.
  - **Cómo:**
    ```markdown
    # <Proyecto> · Roadmap

    ## Etapa 1 · MVP
    Objetivo de la etapa en una frase.

    ### Fase 1.1 · Datos básicos
    > ⏱️ Estimate: 6 h · Started: 2026-11-10 17:42 · Finished: —
    - [ ] FEATURE-1 · Modelo de jugadores — tabla y funciones para crear y listar jugadores
      - AC: se puede crear un jugador con nombre y nivel
      - AC: la lista sale ordenada por nombre
    - [ ] MANUAL-1 · Crear el proyecto en Supabase — lo hago yo desde el panel
    - [ ] FEATURE-2 · Alta de partidos — formulario para registrar un partido (after: FEATURE-1)
    ```
    Reglas:
    - Cada tarea: casilla, ID, ` · `, título, ` — `, descripción. Opcional al final: `(after: ID, ID)` con sus dependencias.
    - Las líneas `  - AC:` debajo de una tarea son sus criterios de aceptación y pasan al ticket.
    - IDs únicos en todo el roadmap. Los tipos de la factoría están en la configuración (`FEATURE`, `FIX`, `CHORE`); cualquier otro tipo (`MANUAL`) es tuyo.
    - El estado lo escriben los scripts al final de la línea: `[x]` hecha, ` · 🟡 in progress`, ` · ⛔ blocked`, ` · ✂️ split into FEATURE-7, FEATURE-8`.
    - **La línea del reloj de cada fase** (`> ⏱️ ...`) va justo debajo de su título y es obligatoria:
      - `Estimate` lo pones tú (o `/project-roadmap` contigo) al planificar: horas de trabajo que crees que costará la fase, admite decimales (`2.5 h`).
      - `Started` y `Finished` los escriben **solo los scripts**, con `stamp()` en tu zona horaria (`YYYY-MM-DD HH:mm`). Mientras no ha pasado, se escribe `—`.
      - Una fase **empieza** cuando arranca su primera tarea, y **termina** cuando todas sus tareas están hechas.
    - Si en la tarea 1.1.1 elegiste inglés para todo, usa `Stage` y `Phase` en vez de `Etapa` y `Fase`. El contrato manda.
    - En la Fase 6.10 añadirás a la línea del reloj las **dependencias** y el **recurso** de cada fase, y en la Etapa 7 los **hitos**.
  - **Hecho cuando:** el formato y las reglas están en el contrato, con un ejemplo de cada estado.

- [ ] **6.1.6 · Campos nuevos en la configuración** · ⏱️ 30 min
  - **Qué:** tres campos en `harness.config.json`: `dirs.docs`, `timezone` y `factoryTypes`.
  - **Por qué:** dónde viven los documentos cambia según el proyecto, las fechas tienen que salir en tu hora, y los scripts tienen que saber qué tareas son de la factoría.
  - **Cómo:**
    ```json
    "dirs": { "tickets": "tickets", "specs": "specs", "docs": "sandbox/docs" },
    "timezone": "Europe/Madrid",
    "factoryTypes": ["FEATURE", "FIX", "CHORE"]
    ```
    En el repo del harness, `dirs.docs` apunta a `sandbox/docs` porque los documentos son del sandbox. En un proyecto instalado será `docs`. Actualiza el lector de configuración y sus tests: `timezone` debe ser una zona válida (`new Intl.DateTimeFormat('es', { timeZone })` no debe lanzar error).
  - **Hecho cuando:** los tests del lector pasan y una zona inventada da error.

### ✅ Checkpoint 6.1
Lee las 6 secciones nuevas del contrato. Pídele a Claude que busque contradicciones con las secciones de artefactos y del journal. Corrige lo que encuentre.

---

## Fase 6.2 · Plantillas y documentos del sandbox

- [ ] **6.2.1 · Plantillas de los cuatro documentos** · ⏱️ 30 min
  - **Qué:** `templates/docs/brief.md`, `architecture.md`, `decisions.md` y `roadmap.md`.
  - **Por qué:** el instalador de la Etapa 10 los copiará a cada proyecto nuevo.
  - **Cómo:** cada plantilla con sus títulos y una línea de ejemplo comentada. `decisions.md` empieza con solo el título.
  - **Hecho cuando:** existen las cuatro.

- [ ] **6.2.2 · Documentos del sandbox** · ⏱️ 30 min
  - **Qué:** los cuatro documentos en `sandbox/docs/`.
  - **Por qué:** necesitas documentos reales para probar los scripts.
  - **Cómo:**
    1. `brief.md`: una calculadora de estadísticas de listas de números (es lo que ya hace el sandbox).
    2. `architecture.md`: las 3 capas del sandbox y sus módulos actuales.
    3. `decisions.md`: vacío por ahora (lo llenará el script).
    4. `roadmap.md`: mete los tickets que escribiste a mano en la Etapa 5 (`FEATURE-1`, `FIX-1`, `FEATURE-2`…) en una etapa "Pruebas del harness", marcando con `[x]` los que acabaron en `GREEN`. Cada fase con su línea `> ⏱️ Estimate: … · Started: — · Finished: —` (las horas de inicio y fin de estas tareas antiguas no las sabes: déjalas en `—` y el sync las rellenará la primera vez).
  - **Hecho cuando:** existen los cuatro y el roadmap recoge todos los tickets de `tickets/`.

### ✅ Checkpoint 6.2
Cuatro plantillas y cuatro documentos del sandbox. Todavía no hay validadores: revísalos tú contra el contrato.

---

## Fase 6.3 · Fechas y decisiones

- [ ] **6.3.1 · Una única fuente de fechas: `lib/time.mjs`** · ⏱️ 30 min
  - **Qué:** una función `stamp()` que devuelve la fecha y hora actuales en dos formatos.
  - **Por qué:** **las fechas nunca las escribe un modelo**. Un modelo no sabe qué hora es y puede inventarla. Todo lo que lleve fecha en el harness pasa por aquí.
  - **Cómo:**
    ```js
    // lib/time.mjs — la única fuente de fechas del harness
    export function stamp(timezone) {
      // En los tests fijamos la hora con HARNESS_NOW para que sean repetibles
      const now = process.env.HARNESS_NOW ? new Date(process.env.HARNESS_NOW) : new Date();

      // Para ordenar y comparar: siempre UTC, formato ISO
      const ts = now.toISOString();                      // 2026-11-08T11:08:00.000Z

      // Para leer: tu hora local. 'sv-SE' da el formato AAAA-MM-DD HH:MM
      const local = new Intl.DateTimeFormat('sv-SE', {
        timeZone: timezone, dateStyle: 'short', timeStyle: 'short',
      }).format(now);

      return { ts, local: `${local} (${timezone})` };   // 2026-11-08 12:08 (Europe/Madrid)
    }
    ```
    Añade también un pequeño `stamp.mjs` ejecutable que imprima la fecha local, para que una skill pueda pedirla con `node .claude/scripts/stamp.mjs` en vez de escribirla.
  - **Hecho cuando:** con `HARNESS_NOW=2026-11-08T11:08:00Z` devuelve `2026-11-08 12:08 (Europe/Madrid)`, y en julio (horario de verano) la diferencia con UTC es de 2 horas.

- [ ] **6.3.2 · `decision-append.mjs`** · ⏱️ 60 min
  - **Qué:** el script que añade una decisión: `node .claude/scripts/decision-append.mjs --title "..." --status accepted --source "FEATURE-3 · Gate A" --context "..." --decision "..." --consequences "..." [--supersedes ADR-002]`.
  - **Por qué:** igual que el journal, el registro de decisiones lo escribe un script. Así el ID, la fecha y el formato son siempre correctos.
  - **Cómo:**
    1. Valida los argumentos: `status` es `accepted` o `rejected`; si hay `supersedes`, esa decisión existe y no estaba ya sustituida.
    2. Calcula el siguiente ID leyendo el último `## ADR-` del fichero (`ADR-001` si está vacío).
    3. Pone la fecha con `stamp()`.
    4. Oculta correos y claves igual que `journal-append` (reutiliza esa función).
    5. Añade la entrada al final con `appendFileSync`. Nunca reescribe el fichero.
    6. Imprime el ID creado, para que la skill que lo llamó pueda citarlo.
  - **Hecho cuando:** dos llamadas seguidas crean `ADR-001` y `ADR-002` con su fecha.

- [ ] **6.3.3 · `validate-decisions.mjs`** · ⏱️ 45 min
  - **Qué:** el validador del registro.
  - **Por qué:** alguien (o algún agente) podría editar el fichero a mano. El validador lo detecta.
  - **Cómo:** comprueba que los IDs son consecutivos y sin huecos; que cada `Ts` es posterior al anterior; que cada entrada tiene los 5 campos y las 3 subsecciones; que cada `Supersedes` apunta a una decisión anterior; y que ninguna decisión está sustituida dos veces.
  - **Hecho cuando:** sus tests pasan (6.3.5).

- [ ] **6.3.4 · Las decisiones vigentes: `lib/active-decisions.mjs`** · ⏱️ 20 min
  - **Qué:** una función que devuelve las decisiones `accepted` que nadie ha sustituido, con su ID, título y resumen.
  - **Por qué:** es lo que leerán `/spec-plan` y el auditor. Las sustituidas y las rechazadas no son restricciones, solo historia.
  - **Cómo:** recorre las entradas, marca como sustituidas las que aparecen en algún `Supersedes` y quédate con el resto que esté `accepted`. Añade un ejecutable `active-decisions.mjs` que las imprima en una tabla corta.
  - **Hecho cuando:** con un registro de 3 decisiones donde la 3 sustituye a la 1, devuelve solo la 2 y la 3.

- [ ] **6.3.5 · Tests** · ⏱️ 45 min
  - **Qué:** tests de los tres scripts con fixtures en `fixtures/decisions/`.
  - **Por qué:** si el registro se corrompe, los planes empezarán a respetar decisiones que ya no valen.
  - **Cómo:** casos: registro vacío → `ADR-001`; IDs consecutivos; `Supersedes` a una decisión que no existe → error; sustituir dos veces la misma → error; fechas desordenadas → inválido; correo ocultado; vigentes calculadas bien. Fija la hora con `HARNESS_NOW`.
  - **Hecho cuando:** `pnpm test` en verde con al menos 7 casos nuevos.

### ✅ Checkpoint 6.3
Añade a mano 3 decisiones al `decisions.md` del sandbox con el script (la tercera sustituyendo a la primera), pasa el validador y mira qué devuelve `active-decisions.mjs`.

---

## Fase 6.4 · Arquitectura viva

- [ ] **6.4.1 · `validate-architecture.mjs`** · ⏱️ 45 min
  - **Qué:** el validador de `architecture.md`.
  - **Por qué:** es el documento que más fácil se desfasa. El validador comprueba que sigue cuadrando con la configuración y con las decisiones.
  - **Cómo:**
    1. Títulos exactos y en orden.
    2. Las capas de la tabla `Layers` son exactamente las de `harness.config.json`, en el mismo orden.
    3. Cada `(ADR-n)` de `Constraints` existe y está vigente (usa `active-decisions`).
    4. Cada línea del `Changelog` tiene el formato `- <fecha local> · <ID o manual> · <texto>` y van en orden de fecha.
  - **Hecho cuando:** sus tests pasan (siguiente tarea).

- [ ] **6.4.2 · Tests** · ⏱️ 30 min
  - **Qué:** fixtures y tests en `fixtures/architecture/`.
  - **Por qué:** como todos los validadores: un fixture por regla.
  - **Cómo:** casos: válido; capa que falta; capas en otro orden; restricción que cita una decisión sustituida; changelog desordenado.
  - **Hecho cuando:** los 5 tests pasan.

### ✅ Checkpoint 6.4
Cambia el nombre de una capa en la configuración del sandbox sin tocar `architecture.md`: el validador debe fallar diciendo qué capa no cuadra. Deshaz el cambio.

---

## Fase 6.5 · Roadmap y tickets

- [ ] **6.5.1 · Lector del roadmap: `lib/roadmap.mjs`** · ⏱️ 45 min
  - **Qué:** una función que convierte `roadmap.md` en una estructura: etapas, con sus fases, con sus tareas. Cada tarea con ID, tipo, título, descripción, criterios, dependencias y estado.
  - **Por qué:** los tres scripts de esta fase leen el roadmap. Un solo lector, probado una vez.
  - **Cómo:** para la línea de tarea, trocea por partes en vez de una sola expresión gigante:
    ```js
    // - [ ] FEATURE-2 · Alta de partidos — formulario para registrar (after: FEATURE-1) · 🟡 in progress
    //   │   │           │                  │                         │                    │
    //   │   │           │                  │                         │                    └─ estado (opcional)
    //   │   │           │                  │                         └─ dependencias (opcional)
    //   │   │           │                  └─ descripción
    //   │   │           └─ título
    //   │   └─ ID: tipo-número
    //   └─ casilla
    ```
    Primero quita el estado del final, luego las dependencias, y lo que queda se separa por ` · ` y ` — `. Las líneas `  - AC:` se añaden a la tarea anterior. Normaliza `\r\n`.
  - **Hecho cuando:** con el roadmap del sandbox devuelve todas las tareas con sus datos.

- [ ] **6.5.2 · `validate-roadmap.mjs`** · ⏱️ 45 min
  - **Qué:** el validador del roadmap.
  - **Por qué:** si el roadmap está mal, la factoría elige mal el siguiente ticket o crea tickets rotos.
  - **Cómo:** comprueba que cada etapa tiene al menos una fase y cada fase al menos una tarea; que la numeración de etapas y fases es correlativa; que los IDs son únicos y cumplen `ticketPattern`; que cada dependencia existe; que no hay dependencias circulares (A espera a B y B espera a A); que los estados son de la lista del contrato; y que **cada fase tiene su línea de reloj** con un `Estimate` mayor que 0 y, si tiene `Started` o `Finished`, con fecha válida y `Finished` posterior a `Started`.
  - **Hecho cuando:** sus tests pasan (6.5.6).

- [ ] **6.5.3 · `sync-roadmap.mjs`: crear tickets** · ⏱️ 45 min
  - **Qué:** la primera mitad del sincronizador: crea `tickets/<ID>.md` para cada tarea de la factoría que todavía no lo tenga.
  - **Por qué:** escribes la tarea una vez, en el roadmap, y el ticket sale solo.
  - **Cómo:**
    1. Solo tareas cuyo tipo está en `factoryTypes`.
    2. Rellena la plantilla del ticket: ID, título, tipo, la descripción y los criterios `AC:`. Si no hay criterios, escribe `- To be defined in /spec-clarify`.
    3. **Nunca** sobrescribe un ticket que ya existe: puede que `/spec-clarify` ya lo haya afinado.
    4. **Nunca** borra tickets, aunque desaparezcan del roadmap: avisa.
  - **Hecho cuando:** ejecutarlo dos veces seguidas no cambia nada la segunda vez.

- [ ] **6.5.4 · `sync-roadmap.mjs`: marcar estados y el reloj de las fases** · ⏱️ 45 min
  - **Qué:** la segunda mitad: actualiza el estado de cada tarea mirando `specs/`, y apunta cuándo empieza y termina cada fase.
  - **Por qué:** el roadmap siempre dice la verdad sin que tú lo toques. Y con la hora de inicio y fin de cada fase, más tu estimación, sabrás si estimas bien o siempre te quedas corto (que es lo normal al principio).
  - **Cómo:**
    - `specs/<ID>/04-dod.md` dice `GREEN` → `[x]` y sin sufijo.
    - Existe `BLOCKED.md` → ` · ⛔ blocked`.
    - Existe la carpeta pero no ha terminado → ` · 🟡 in progress`.
    - Las tareas `MANUAL` las marcas tú: el script no las toca.
    - **El reloj:** después de marcar las tareas, compara cada fase con su línea `> ⏱️`:
      - Tiene alguna tarea empezada o hecha y `Started: —` → escribe `Started` con `stamp()`.
      - Todas sus tareas hechas y `Finished: —` → escribe `Finished`.
      - Tenía `Finished` pero se ha reabierto una tarea (un `FIX` nuevo dentro de la fase, por ejemplo) → vuelve a `Finished: —`. `Started` nunca se toca una vez escrito.
    - Devuelve la lista de fases que **cambiaron de reloj** en esta ejecución (`started` o `finished`). La Fase 6.9 usará esa lista para avisar a Notion solo cuando haga falta.
    - Solo cambia la casilla, el sufijo de cada línea y la línea del reloj: nunca reordena ni reescribe el resto del fichero.
  - **Hecho cuando:** tras terminar un ticket en `GREEN`, el sync lo marca `[x]` y el resto del fichero queda igual (`git diff` de una sola línea, o dos si además cerró la fase).

- [ ] **6.5.5 · `next-ticket.mjs`** · ⏱️ 30 min
  - **Qué:** un script que imprime el siguiente ticket que la factoría debería hacer.
  - **Por qué:** el piloto automático de la Etapa 9 lo usará para trabajar solo, en el orden que tú decidiste.
  - **Cómo:** recorre el roadmap en orden y devuelve la primera tarea de la factoría sin hacer, sin bloquear, no dividida y con todas sus dependencias hechas. Una tarea dividida (`✂️ split into`) cuenta como hecha cuando lo están todas sus partes. Sale con 0 e imprime el ID, o con 1 si no queda ninguna disponible (y dice por qué: todo hecho, o todo esperando a algo).
  - **Hecho cuando:** con el roadmap del sandbox devuelve el ID correcto.

- [ ] **6.5.6 · Tests** · ⏱️ 45 min
  - **Qué:** tests del lector, el validador, el sync y `next-ticket` con fixtures en `fixtures/roadmap/`.
  - **Por qué:** estos scripts deciden qué construye la factoría. Tienen que ser los más fiables del harness.
  - **Cómo:** casos mínimos: ID duplicado; dependencia que no existe; dependencia circular; el sync crea un ticket y no pisa uno existente; `GREEN` → `[x]`; `BLOCKED.md` → `⛔`; `MANUAL` no genera ticket; `next-ticket` salta una tarea con dependencias pendientes; tarea dividida; fase sin `Estimate` es inválida; la primera tarea empezada escribe `Started` y la última hecha escribe `Finished` (con un reloj falso, para que la hora del test sea siempre la misma).
  - **Hecho cuando:** `pnpm test` en verde con al menos 12 casos nuevos.

### ✅ Checkpoint 6.5
Añade a mano dos tareas al roadmap del sandbox (una dependiendo de la otra), ejecuta `sync-roadmap.mjs` y comprueba que aparecen sus tickets. Después, `next-ticket.mjs` debe devolver la primera, no la segunda.

---

## Fase 6.6 · Skills de los documentos

- [ ] **6.6.1 · `/project-roadmap`** · ⏱️ 60 min
  - **Qué:** `.claude/skills/project-roadmap/SKILL.md`, la skill con la que planificas un proyecto conversando.
  - **Por qué:** dividir bien un proyecto en etapas, fases y tareas del tamaño de un ticket es difícil. Esta skill lo hace contigo y deja el resultado en el formato exacto que la factoría entiende.
  - **Cómo:** dos modos:
    - **Crear** (no hay roadmap): si no existe `brief.md`, primero lo escribe contigo. (En la Etapa 7, `/discovery` hará este paso a fondo, con reuniones y documentos; esta skill queda para planificar.) Luego propone etapas, fases y tareas, cada tarea pensada para no pasar Gate B (pocos ficheros, una idea). Separa lo que hace la factoría (`FEATURE`, `FIX`, `CHORE`) de lo que haces tú (`MANUAL`). Para cada fase propone sus **dependencias** (las mínimas de verdad, para que lo independiente pueda ir en paralelo) y una **estimación en horas**, y te explica de dónde sale (número de tareas, si hay migraciones, si hay algo nuevo para ti); tú la ajustas. Cuando ya haya fases terminadas, usa su desviación real para corregir las siguientes.
    - **Actualizar** (ya hay roadmap): añade, reordena o reformula tareas **pendientes**. Nunca toca las hechas.
    - En los dos modos: **Gate R**, te enseña el roadmap y espera tu aprobación. Después pasa `validate-roadmap.mjs`, ejecuta `sync-roadmap.mjs` y apunta el cambio con `decision-append.mjs` (`--source roadmap`).
    - `disable-model-invocation: true` en la cabecera: solo la lanzas tú.
  - **Hecho cuando:** la skill existe.

- [ ] **6.6.2 · `/decision`** · ⏱️ 30 min
  - **Qué:** `.claude/skills/decision/SKILL.md`, para apuntar una decisión que tomas fuera de un ticket.
  - **Por qué:** muchas decisiones no salen de un ticket: "el cliente quiere que todo esté en euros", "nada de dependencias de pago". Tienen que quedar apuntadas igual.
  - **Cómo:** te pregunta título, contexto, decisión y consecuencias; te enseña las decisiones vigentes que podrían chocar o que esta podría sustituir; te pide confirmación y llama a `decision-append.mjs` con `--source manual`.
  - **Hecho cuando:** la skill existe.

- [ ] **6.6.3 · Ampliar el test de skills** · ⏱️ 20 min
  - **Qué:** que `skills.test.mjs` también compruebe estas dos.
  - **Por qué:** igual que las fases: si se rompen, quieres enterarte por un test.
  - **Cómo:** que tengan `disable-model-invocation: true` y que mencionen sus scripts (`validate-roadmap`, `sync-roadmap`, `decision-append`).
  - **Hecho cuando:** el test pasa.

### ✅ Checkpoint 6.6
`/decision` sobre una decisión inventada deja una entrada válida en `decisions.md` del sandbox, con la fecha correcta de tu zona.

---

## Fase 6.7 · Conectar los documentos con las fases

- [ ] **6.7.1 · `/spec-clarify` lee el contexto del proyecto** · ⏱️ 20 min
  - **Qué:** que clarify lea `brief.md`, la línea del ticket en el roadmap (con su etapa y fase) y las decisiones vigentes.
  - **Por qué:** con el contexto del proyecto hace mejores preguntas, y no propone nada que vaya contra el brief o una decisión tomada.
  - **Cómo:** añade estos tres pasos a su sección `Context`. Y una protección: si el tipo del ticket no está en `factoryTypes` (por ejemplo `MANUAL-1`), se niega.
  - **Hecho cuando:** `/spec-clarify MANUAL-1` se niega explicando que es una tarea tuya.

- [ ] **6.7.2 · Dos secciones nuevas en `02-design.md`** · ⏱️ 45 min
  - **Qué:** `## Architecture impact` y `## Project decisions` al final del diseño.
  - **Por qué:** obliga a preguntarse en cada ticket "¿esto cambia la arquitectura?" y "¿esto es una decisión que deben respetar los tickets futuros?".
  - **Cómo:**
    1. `Architecture impact`: lista de cambios por sección de `architecture.md` (`- Modules: nuevo módulo ranking en core`) o `- None`.
    2. `Project decisions`: las decisiones del diseño que afectan a todo el proyecto, con su título, o `- None`.
    3. Actualiza el contrato, `validate-design.mjs` y sus fixtures (falta una sección → inválido).
  - **Hecho cuando:** los tests del validador de diseño pasan con los casos nuevos.

- [ ] **6.7.3 · Gate A registra las decisiones del proyecto** · ⏱️ 20 min
  - **Qué:** que al aprobar el diseño, cada línea de `Project decisions` se apunte con `decision-append.mjs`.
  - **Por qué:** es el momento natural: acabas de aprobar esa decisión.
  - **Cómo:** en `/spec-plan`, tras tu aprobación en Gate A, una llamada por decisión con `--source "<ID> · Gate A"`. Si una decisión cambia otra vigente, te lo pregunta y usa `--supersedes`.
  - **Hecho cuando:** el paso está en la skill.

- [ ] **6.7.4 · `/spec-plan` y el auditor respetan lo decidido** · ⏱️ 30 min
  - **Qué:** que el plan lea `architecture.md` y las decisiones vigentes, y que el auditor tenga una familia nueva.
  - **Por qué:** `architecture.md` ahorra exploración (y cupo). Y un plan que contradice una decisión vigente es un error grave.
  - **Cómo:**
    1. En `/spec-plan`, antes del inventario: lee `architecture.md` y pasa al `explorer` solo las preguntas que el documento no responde.
    2. En el `plan-auditor`: familia **F13 · Contradice una decisión vigente o la arquitectura**, bloquea siempre. Pásale las decisiones vigentes en su encargo.
    3. Actualiza la referencia de familias en `harness-help`.
  - **Hecho cuando:** el test de agentes sigue en verde y el auditor tiene F13.

- [ ] **6.7.5 · Gate B `Split` actualiza el roadmap** · ⏱️ 30 min
  - **Qué:** cuando un ticket es demasiado grande y decides trocearlo, el troceo queda en el roadmap.
  - **Por qué:** si no, las partes nuevas solo existirían en tu cabeza.
  - **Cómo:** tras tu decisión, `/spec-plan` añade las tareas nuevas justo debajo de la original, con IDs nuevos (el siguiente número libre de su tipo), marca la original con ` · ✂️ split into ...`, pasa `validate-roadmap.mjs`, ejecuta `sync-roadmap.mjs` y apunta la decisión.
  - **Hecho cuando:** el paso está en la skill.

- [ ] **6.7.6 · `/spec-validate` actualiza arquitectura y roadmap** · ⏱️ 30 min
  - **Qué:** al terminar en `GREEN`, aplicar el `Architecture impact` y sincronizar el roadmap.
  - **Por qué:** es el cierre que mantiene los documentos vivos.
  - **Cómo:**
    1. Si `Architecture impact` no es `- None`: edita las secciones que diga en `architecture.md` y añade una línea al `Changelog` con la fecha de `stamp.mjs` y el ID del ticket.
    2. Pasa `validate-architecture.mjs`.
    3. Ejecuta `sync-roadmap.mjs`.
    4. Añade los validadores de arquitectura, decisiones y roadmap a la fila `contracts` de `run-checks.mjs`.
    5. Estos cambios van en el mismo diff que el código: los revisas en la misma PR.
  - **Hecho cuando:** el paso está en la skill y el test de skills pasa.

### ✅ Checkpoint 6.7
`pnpm test` en verde con todos los tests actualizados (diseño, agentes y skills).

---

## Fase 6.8 · Prueba completa

- [ ] **6.8.1 · Ampliar el roadmap del sandbox con `/project-roadmap`** · ⏱️ 30 min
  - **Qué:** usar la skill en modo actualizar para añadir una etapa nueva con 2 o 3 tareas.
  - **Por qué:** comprobar el circuito desde el principio: de la idea al ticket.
  - **Cómo:** por ejemplo: "añade una etapa de estadísticas con moda, rango y desviación típica".
  - **Hecho cuando:** el roadmap tiene la etapa nueva, existen sus tickets en `tickets/` y hay una decisión con `Source: roadmap`.

- [ ] **6.8.2 · Un ticket de punta a punta** · ⏱️ 60 min
  - **Qué:** ejecutar las 4 fases sobre el primer ticket de la etapa nueva (el que diga `next-ticket.mjs`).
  - **Por qué:** es la prueba de que los documentos viven solos.
  - **Cómo:** fuerza en el diseño al menos un `Architecture impact` y una `Project decision`. Apunta `/usage`.
  - **Hecho cuando:** al acabar en `GREEN`: el roadmap tiene la tarea en `[x]`, `architecture.md` tiene una línea nueva en el `Changelog`, `decisions.md` tiene la decisión de Gate A con su fecha y los tres validadores pasan.

- [ ] **6.8.3 · Comprobar que el auditor respeta lo decidido** · ⏱️ 20 min
  - **Qué:** escribir un ticket que contradiga a propósito la decisión que acabas de tomar.
  - **Por qué:** una regla que nunca has visto saltar no sabes si funciona.
  - **Cómo:** añádelo al roadmap y lanza `/spec-clarify` y `/spec-plan`.
  - **Hecho cuando:** el auditor lo para con un hallazgo F13. Borra el ticket después.

- [ ] **6.8.4 · Aplicar los documentos al propio harness** (opcional) · ⏱️ 30 min
  - **Qué:** pasar los validadores sobre el `docs/decisions.md` y el `docs/architecture.md` del propio repo `harness`, que empezaste a mano en la Etapa 1.
  - **Por qué:** tu harness también es un proyecto. Que sus documentos cumplan su propio contrato es la mejor prueba de que el formato es bueno (y queda muy bien en el portfolio).
  - **Cómo:** apunta los validadores al repo con una configuración de prueba. Corrige el formato de las entradas antiguas a mano **una sola vez**, y apúntalo como decisión. A partir de aquí, las decisiones nuevas del harness, con `decision-append.mjs`.
  - **Hecho cuando:** los dos validadores pasan sobre los documentos del harness.

### ✅ Checkpoint 6.8
Lee los cuatro documentos del sandbox como si fueras otra persona: ¿entiendes qué es el proyecto, cómo está hecho, qué se decidió y qué falta? Si algo no se entiende, el problema está en la plantilla o en la skill que lo escribe.

---

## Fase 6.9 · Panel de proyectos en Notion

> 📌 **Notion solo sirve para ver cómo va cada proyecto.** Todo el trabajo vive en el repo: los agentes nunca leen Notion ni dependen de él, así no van "de arriba abajo" gastando cupo. Notion recibe un aviso cuando una fase **empieza** o **termina**, y nada más. Si mañana borras Notion, la factoría sigue funcionando igual.

> 💡 **Por qué un script y no Claude:** Claude puede leer y escribir en Notion con su conector, pero cada actualización gastaría cupo. Un script con la API de Notion hace lo mismo **sin gastar un token**.

> 🏭 **Un solo panel para todos tus repos.** El panel se crea una vez en tu Notion y cada proyecto en el que instales el harness se añade a él cuando queda definido. De un vistazo ves en qué fase va cada proyecto, cuánto llevas y si vas por encima o por debajo de lo que estimaste.

```
🏭 Factoría                  página de tu Notion (se crea una sola vez)
├─ 📁 Proyectos              una fila por repo: estado, fase actual, progreso, horas estimadas y reales
├─ 🧱 Etapas                 una fila por etapa de cada proyecto
└─ 🧩 Fases                  una fila por fase: estimación, inicio, fin, duración y desviación
```

**Cuándo se escribe en Notion (y solo entonces):**

| Momento | Qué cambia en Notion | Quién lo lanza |
|---|---|---|
| El proyecto queda definido (`READY` por primera vez) | Se crea el proyecto con todas sus etapas y fases, cada fase con su estimación | `validate-readiness.mjs` (Etapa 7), o tú con `--init` |
| Empieza una fase | La fase pasa a `En curso` con la fecha y hora de inicio; el proyecto muestra esa fase como la actual | `sync-roadmap.mjs` |
| Termina una fase | La fase pasa a `Hecha` con su fecha y hora de fin, duración y desviación; sube el progreso del proyecto | `sync-roadmap.mjs` |
| Cambia el roadmap (un CR aceptado, un `Split`, fases nuevas) | Aparecen las fases nuevas y se actualizan nombres y estimaciones | `/project-roadmap` y `/discovery update`, tras su puerta |

Ni tareas sueltas, ni tickets, ni journal: eso se queda en el repo.

- [ ] **6.9.1 · Diseñar las tres bases** · ⏱️ 30 min
  - **Qué:** el esquema de `Proyectos`, `Etapas` y `Fases`, escrito en `docs/notion.md` del harness.
  - **Por qué:** el script de 6.9.3 crea exactamente lo que dice este documento. Si un día quieres otra propiedad, cambias el documento y el script, y no tocas Notion a mano.
  - **Cómo:**

    | Base | Propiedades |
    |---|---|
    | 📁 Proyectos | Nombre (título) · Repo (URL) · Estado (`Definiendo`, `Construyendo`, `Pausado`, `Terminado`) · Fase actual · Próximo hito · Fases hechas y Fases totales (números) · Progreso (fórmula: hechas entre totales) · Horas estimadas y Horas reales (sumas de sus fases) · Inicio · Fin · Última actualización |
    | 🧱 Etapas | Nombre · Proyecto (relación) · Nº · Estado · Progreso (porcentaje de fases hechas) · Horas estimadas (suma) · Inicio y Fin (los escribe el script: inicio de su primera fase y fin de la última) |
    | 🧩 Fases | Nombre (`1.2 · Alta de albaranes`) · Proyecto y Etapa (relaciones) · Código (`1.2`) · Estado (`Pendiente`, `En curso`, `Hecha`, `Descartada`) · Estimación (h) · Plan (rango de fechas previsto) · Inicio y Fin (fecha **con hora**) · Duración (h) · Desviación (h) · Tareas (`5/7`) |

    Las dos fórmulas de `Fases`:
    ```
    Duración (h)   = dateBetween(prop("Fin"), prop("Inicio"), "minutes") / 60
    Desviación (h) = prop("Duración (h)") - prop("Estimación (h)")     ← positiva: tardaste más de lo previsto
    ```
    > 🧠 **Ojo con lo que mide la duración:** es tiempo de reloj. Si una fase empieza el lunes a las 18:00 y termina el martes a las 12:00, marca 18 h aunque trabajaras 3. Al principio fíjate en la **tendencia** (¿siempre me paso?), no en el número exacto. En la Etapa 9, con las métricas de cada sesión, puedes añadir una propiedad "Horas de trabajo" con lo que la factoría estuvo trabajando de verdad.

    Vistas: `Proyectos` en tablero por Estado y en **cronograma** (`Inicio` → `Fin`), para ver todos tus proyectos en el tiempo; `Etapas` en cronograma agrupado por proyecto; en `Fases`, una vista "En curso", un **cronograma previsto** (`Plan`) y otro **real** (`Inicio` → `Fin`), los dos agrupados por proyecto, y una tabla con la desviación.
    > 🗓️ **Por qué fechas de verdad y no fórmulas:** los cronogramas de Notion solo se dibujan con propiedades de fecha, no con fechas calculadas por fórmula. Por eso el script escribe `Plan`, `Inicio` y `Fin` como fechas.
  - **Hecho cuando:** `docs/notion.md` describe las tres bases, sus propiedades, fórmulas y vistas.

- [ ] **6.9.2 · La clave y la configuración global** · ⏱️ 20 min
  - **Qué:** una integración de Notion con su clave, y un fichero de configuración **global**, fuera de los repos: `~/.harness/notion.json`.
  - **Por qué:** el panel es uno para todos tus proyectos, así que sus IDs no pertenecen a ningún repo. Y la clave nunca puede acabar en Git.
  - **Cómo:**
    1. Crea una integración interna en la configuración de Notion y una página vacía "🏭 Factoría" compartida con ella.
    2. Guarda la clave en una variable de entorno de Windows: `setx NOTION_TOKEN "secret_..."` y abre una terminal nueva.
    3. En cada proyecto, `harness.config.json` dice si se usa Notion y **cuándo trabajas tú**:
       ```json
       "notion": { "enabled": true, "tokenEnv": "NOTION_TOKEN" },
       "schedule": { "resources": { "you": { "hoursPerWeek": 12, "workdays": [1, 2, 3, 4] } } }
       ```
       `workdays` son los días que trabajas (1 = lunes … 7 = domingo). Con `[1, 2, 3, 4]` no trabajas viernes, sábado ni domingo, y tus 12 horas se reparten en 4 días (3 h al día). La Fase 6.10 añade aquí la factoría.
    4. `lib/notion-config.mjs` junta las dos cosas. Si falta algo, Notion se desactiva con un aviso: nunca rompe nada.
  - **Hecho cuando:** una llamada de prueba lee la página "🏭 Factoría" sin error.

- [ ] **6.9.3 · `notion-setup.mjs`: crear el panel una sola vez** · ⏱️ 45 min
  - **Qué:** un script que crea las tres bases dentro de "🏭 Factoría" con el esquema de 6.9.1 y guarda sus IDs en `~/.harness/notion.json`.
  - **Por qué:** así el panel es reproducible: si cambias de cuenta de Notion, lo lanzas otra vez y en un minuto lo tienes.
  - **Cómo:** con `fetch`, que viene con Node 24: sin dependencias. Si `notion.json` ya tiene IDs y esas bases existen, no hace nada. Las vistas no se pueden crear con la API: las haces a mano una sola vez (5 minutos) siguiendo `docs/notion.md`.
  - **Hecho cuando:** lanzarlo dos veces deja un único panel.

- [ ] **6.9.4 · `notion-sync.mjs --init`: dar de alta un proyecto** · ⏱️ 45 min
  - **Qué:** crea la fila del proyecto, sus etapas y sus fases con su estimación, todas en `Pendiente`.
  - **Por qué:** es el momento en que el proyecto "nace" en tu panel: cuando ya está definido y listo para construir, no antes.
  - **Cómo:**
    1. Lee el roadmap con `lib/roadmap.mjs`. El nombre sale del título del roadmap y el repo de `git remote get-url origin`.
    2. Calcula un `Plan` provisional de cada fase: pone las fases en fila a partir de hoy y reparte sus horas **solo en tus días de trabajo** (`schedule.resources.you`), así que una fase de 6 h que empieza un jueves acaba el lunes siguiente. En la Fase 6.10, `schedule.mjs` sustituye este cálculo por uno completo con dependencias, recursos y trabajo en paralelo.
    3. Guarda los IDs de Notion de cada cosa en `specs/notion-map.json`. Va en Git: no son secretos, y así, si clonas el repo en otro ordenador, el proyecto no se duplica.
    4. Si el mapa ya existe, no crea nada y te dice que el proyecto ya está dado de alta.
  - **Hecho cuando:** el sandbox aparece en el panel con todas sus fases y la suma de sus estimaciones.

- [ ] **6.9.5 · Eventos de fase y cambios de estructura** · ⏱️ 45 min
  - **Qué:** `notion-sync.mjs --phase 1.2 started|finished` y `notion-sync.mjs --structure`.
  - **Por qué:** son los únicos momentos en que Notion cambia. Una llamada por fase, no una por tarea: casi nada de tráfico y Notion siempre cuadra con el repo.
  - **Cómo:**
    1. `--phase <código> started`: la fase pasa a `En curso` con `Inicio` **copiado del roadmap** (no usa la hora del momento: manda el repo). El proyecto pasa a `Construyendo`, con esa fase como actual y su `Inicio` si era la primera.
    2. `--phase <código> finished`: la fase pasa a `Hecha` con su `Fin` y sus tareas (`7/7`), y su etapa actualiza `Inicio` y `Fin`. El proyecto actualiza fases hechas, próximo hito y última actualización. Si era la última fase: `Terminado` y `Fin`.
    3. `--structure`: añade etapas y fases nuevas, actualiza nombres y estimaciones, recalcula el `Plan` de las fases que aún no han empezado, y vuelve a copiar estado, inicio y fin de cada fase desde el roadmap (sirve también para reparar). Una fase que ya no está en el roadmap queda `Descartada`: nunca se borra.
    4. Sin conexión o con un error de la API, guarda el evento en `specs/notion-outbox.jsonl` y lo reenvía la próxima vez. Nunca hace fallar al comando que lo llamó.
    5. `sync-roadmap.mjs` llama a `--phase` con la lista de fases que cambiaron de reloj (6.5.4); si no cambió ninguna, no llama a nada. `/project-roadmap` llama a `--structure` después de Gate R. Opción `--no-notion` para las pruebas.
  - **Hecho cuando:** al cerrar la última tarea de una fase del sandbox, esa fase cambia en Notion sola, y repetir el sync no envía ninguna petición.

- [ ] **6.9.6 · Tests con un Notion falso** · ⏱️ 45 min
  - **Qué:** tests que sustituyen `fetch` por una función falsa que guarda las peticiones.
  - **Por qué:** probar contra el Notion real en cada test sería lento y te ensuciaría el panel.
  - **Cómo:** casos: el setup no duplica; `--init` crea proyecto, etapas, fases y el mapa; `--init` dos veces no duplica; `started` y `finished` solo tocan su fase y su proyecto; `--structure` añade una fase nueva y marca `Descartada` la que falta; un error de la API va a la bandeja de salida y se reenvía; sin configuración, avisa y sale con 0.
  - **Hecho cuando:** los 7 tests pasan.

### ✅ Checkpoint 6.9
Crea un segundo repo de prueba con un roadmap mínimo (una etapa, una fase) y da de alta los dos proyectos: el panel muestra dos proyectos. Termina una fase del sandbox: en Notion cambian **solo** esa fase (con inicio, fin, duración y desviación) y la fila de su proyecto. El journal, los specs y los tickets no han salido del repo.

---

## Fase 6.10 · El cronograma como en Microsoft Project

> 📐 **Qué hace Project, en cuatro ideas:**
> 1. **Dependencias:** una fase no puede empezar hasta que termine aquella de la que depende ("fin a inicio").
> 2. **Recursos y calendario:** quién hace cada fase y cuántas horas tiene cada semana, sin contar festivos ni vacaciones.
> 3. **Ruta crítica:** la cadena de fases que, si se retrasa un día, retrasa todo el proyecto. Las demás tienen **holgura**: margen para retrasarse sin que se note al final.
> 4. **Línea base:** una foto del plan aprobado. Al avanzar, comparas lo previsto con lo real y ves cuánto te has desviado.
>
> Notion sabe **dibujar** un Gantt con flechas de dependencia, pero **no sabe calcular** fechas, recursos ni ruta crítica. Así que el cálculo lo hace un script, `schedule.mjs`, siempre igual con los mismos datos, y Notion solo lo dibuja. Es la misma regla de siempre: lo calcula un script, nunca el modelo.

**Los recursos de tu factoría** son dos, cada uno con su calendario: **tú** (horas por semana y los días que trabajas, de lunes a jueves) y **la factoría** (horas por semana según tu plan Pro o Max, cualquier día, y con varias **líneas** para hacer tickets a la vez). Una fase de la factoría también te consume a ti un poco: aprobar puertas y revisar el diff.

- [ ] **6.10.1 · Dependencias, recursos y calendario en el formato** · ⏱️ 30 min
  - **Qué:** ampliar la línea del reloj de cada fase y la configuración.
  - **Por qué:** sin dependencias ni capacidad no hay cronograma que calcular: solo una lista.
  - **Cómo:**
    1. La línea del reloj gana dos campos opcionales:
       ```markdown
       > ⏱️ Estimate: 6 h · Depends: 1.1, 1.2 · Resource: factory · Started: — · Finished: —
       ```
       - `Depends`: fases que tienen que terminar antes, o `—` si no depende de ninguna. **Es obligatorio**: si el script supusiera "depende de la anterior", nunca habría nada en paralelo; y si supusiera "de ninguna", lanzaría a la vez cosas que se pisan. Lo decide `/project-roadmap` contigo en Gate R, buscando a propósito qué fases son **independientes** para que la factoría las haga a la vez.
       - `Resource`: `factory`, `you` o `both`. Si no lo pones, se deduce de las tareas: todas de la factoría → `factory`; todas `MANUAL` → `you`; mezcla → `both`.
    2. En `harness.config.json`:
       ```json
       "schedule": {
         "resources": {
           "you":     { "hoursPerWeek": 12, "workdays": [1, 2, 3, 4] },
           "factory": { "hoursPerWeek": 20, "workdays": [1, 2, 3, 4, 5, 6, 7], "lanes": 2 }
         },
         "reviewShare": 0.2,
         "daysOff": ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"]
       }
       ```
       - **Cada recurso tiene su calendario**, como en Project. Tú trabajas de lunes a jueves; la factoría puede trabajar cualquier día que la dejes encendida.
       - `lanes`: cuántos tickets puede llevar la factoría **a la vez** (Fase 9.8). Depende de tu plan: más líneas acaban antes, pero gastan el cupo más rápido.
       - `reviewShare`: la parte de cada fase de la factoría que te toca a ti (20 %: puertas y revisión). Esa parte va en **tu** calendario: si la factoría termina un viernes, tu revisión cae el lunes, y el cronograma lo refleja.
       - `daysOff`: festivos y vacaciones, que no cuentan para nadie.
    3. `validate-roadmap.mjs` comprueba que las dependencias existen, que no hay ciclos entre fases y que el recurso es uno de los tres.
  - **Hecho cuando:** el contrato y la configuración lo describen, y el validador rechaza una fase que depende de sí misma a través de otra.

- [ ] **6.10.2 · `schedule.mjs`: el planificador** · ⏱️ 90 min
  - **Qué:** el script que calcula el inicio y el fin previstos de cada fase.
  - **Por qué:** es el corazón de lo que hace Project, y escrito por ti en 150 líneas entiendes de verdad cómo funciona un planificador.
  - **Cómo:** con lo que hay en el roadmap y en la configuración:
    1. **Ordena las fases** de forma que cada una vaya después de las que necesita (ordenación topológica).
    2. Para cada fase, **la fecha más temprana** en que puede empezar es cuando termina la última de sus dependencias.
    3. Desde esa fecha, **reparte sus horas** solo en los días laborables **de su recurso** y según la capacidad que le quede libre: si tú ya estás ocupado esos días con otra fase, esta espera. Así se **nivelan los recursos**: nunca te planifica 20 horas en una semana de 12, ni trabajo tuyo en viernes.
    4. **Paralelo:** la factoría tiene `lanes` líneas. Si dos fases de la factoría no dependen la una de la otra y hay líneas libres, van **a la vez**; si no, esperan. Tú siempre eres una sola línea.
    5. Las fases ya terminadas usan sus fechas reales, y las que están en curso, su inicio real.
    6. El resultado va a `specs/schedule.json`: por fase, inicio y fin previstos, horas por recurso y línea de la factoría que usa.
    Sin dependencias externas y sin hora del sistema dentro del cálculo: la fecha "hoy" entra como parámetro, así los tests dan siempre lo mismo.
  - **Hecho cuando:** con el roadmap del sandbox, `schedule.json` pone las fases en un orden coherente, ninguna semana supera la capacidad de ningún recurso, no hay horas tuyas en viernes, sábado ni domingo, y dos fases independientes de la factoría salen en paralelo.

- [ ] **6.10.3 · Ruta crítica y holgura** · ⏱️ 45 min
  - **Qué:** marcar qué fases son críticas y cuánto margen tiene cada una.
  - **Por qué:** te dice dónde no te puedes retrasar. Si una fase crítica se retrasa, el fin del proyecto se mueve con ella.
  - **Cómo:** después de calcular las fechas hacia delante, recorre las fases **hacia atrás** desde el final: para cada una, la fecha más tardía en que podría terminar sin mover el fin del proyecto. **Holgura** = fin más tardío − fin previsto (en días laborables). Holgura 0 → **crítica**.
  - **Hecho cuando:** en un ejemplo pequeño hecho a mano (cuatro fases, dos caminos), el script marca como crítico el camino largo y da la holgura correcta al corto.

- [ ] **6.10.4 · Línea base y nueva previsión** · ⏱️ 45 min
  - **Qué:** guardar la foto del plan aprobado y recalcular la previsión cuando las cosas cambian.
  - **Por qué:** sin línea base no sabes si vas tarde; solo sabes la fecha nueva.
  - **Cómo:**
    1. Al aprobar el roadmap en Gate R, `schedule.mjs --baseline` copia las fechas previstas a `specs/baseline.json`, con su fecha de aprobación.
    2. Cada vez que una fase empieza o termina, `sync-roadmap` vuelve a lanzar `schedule.mjs`: las fechas reales sustituyen a las previstas y el resto de fases se recalcula a partir de ahí.
    3. Si se acepta un CR que cambia el roadmap, se guarda una **línea base nueva** (`baseline-2.json`) y la anterior se conserva, para ver cuánto se movió el proyecto por cada cambio.
    4. **Retraso** de cada fase = fin previsto − fin de la línea base. Del proyecto = lo mismo con su última fase.
  - **Hecho cuando:** terminas una fase del sandbox dos días tarde y `schedule.json` mueve las siguientes, mientras `baseline.json` sigue igual.

- [ ] **6.10.5 · Llevarlo al panel: el Gantt en Notion** · ⏱️ 60 min
  - **Qué:** ampliar las bases de la Fase 6.9 para que Notion dibuje el cronograma como un Gantt.
  - **Por qué:** es donde lo vas a mirar. Y en Notion lo puedes enseñar a un cliente.
  - **Cómo:**
    1. `Fases` gana: **Bloqueado por** y **Bloqueando** (las dependencias), **Recurso**, **Línea base** (rango de fechas), **Plan** (la previsión actual), **Crítica** (casilla), **Holgura (días)** y **Retraso (días)**. `Proyectos` gana **Fin previsto**, **Fin línea base** y **Retraso (días)**.
    2. Los **hitos** de la Etapa 7 entran como filas de un solo día al final de la fase que los cierra, como los rombos de Project.
    3. `notion-sync.mjs` escribe todo eso desde `schedule.json` y `baseline.json`, y solo en las filas que cambiaron.
    4. **Activar las dependencias, una sola vez.** La API de Notion no deja hacerlo, ni con script ni con el conector: solo desde la interfaz. Se hace así: en la vista de cronograma, **Configuración → Más ajustes → Dependencias**, elige **"No reprogramar automáticamente"** y pulsa **Activar dependencias**. Notion crea entonces sus propias relaciones `Bloqueado por` y `Bloqueando`, y `notion-sync.mjs` escribe en `Bloqueado por`, no en una relación inventada.
       > ⚠️ **"No reprogramar automáticamente" es obligatorio.** Si dejas que Notion mueva fechas al solaparse, Notion y `schedule.mjs` se pelean por el cronograma. Las fechas las decide el script; Notion solo dibuja.
       > 🤖 Este paso lo puedes delegar: Claude lo hace con el navegador (la extensión de Chrome o el navegador de la app) en un minuto. `notion-setup.mjs` termina recordándotelo.
    5. Vistas nuevas (a mano, una vez): **Gantt** (cronograma por `Plan`, con las dependencias del punto 4, agrupado por proyecto), **Ruta crítica** (filtro `Crítica`), **Previsto frente a línea base** (dos cronogramas, uno por `Línea base` y otro por `Plan`) y **Carga por recurso** (gráfico de horas por recurso y semana).
  - **Hecho cuando:** el sandbox se ve en Notion como un Gantt con flechas, sus fases críticas marcadas y la línea base al lado.

- [ ] **6.10.6 · El agente del panel: `/panel`** · ⏱️ 45 min
  - **Qué:** una skill con la que hablas del cronograma: "¿voy con retraso?", "¿qué fase es crítica?", "¿qué pasa si la fase 2.3 me lleva el doble?".
  - **Por qué:** los números los calculan los scripts, pero interpretarlos y proponer qué hacer sí es trabajo para un agente.
  - **Cómo:**
    1. Usa un modelo barato del perfil (Sonnet o Haiku) y lee solo `schedule.json`, `baseline.json` y el roadmap: nunca lee Notion.
    2. Para el "¿qué pasa si…?", lanza `schedule.mjs --what-if` con una copia modificada y compara: no toca ningún fichero real.
    3. Si propone cambiar estimaciones, dependencias o recursos, ese cambio va por `/project-roadmap` y Gate R, como cualquier cambio del roadmap.
    4. Si el panel no cuadra, lanza `notion-sync.mjs --structure`. Nunca escribe en Notion por su cuenta.
  - **Hecho cuando:** le preguntas qué pasa si una fase crítica se retrasa una semana y te responde con la nueva fecha de fin que da el script, no con una estimación suya.

- [ ] **6.10.7 · Tests del planificador** · ⏱️ 60 min
  - **Qué:** tests con proyectos de ejemplo cuya solución conoces.
  - **Por qué:** un planificador con un error da fechas que parecen razonables y están mal. Solo un test con la respuesta calculada a mano lo pilla.
  - **Cómo:** casos: cadena simple; dos caminos en paralelo (ruta crítica y holgura); dos fases del mismo recurso que no caben a la vez (una espera); dos fases de la factoría independientes con 2 líneas (van a la vez) y con 1 (una espera); tu revisión de una fase que la factoría acaba en viernes (cae el lunes); festivo en medio; fase terminada tarde que empuja a las siguientes; ciclo de dependencias (error); línea base intacta tras recalcular; `--what-if` que no toca ficheros.
  - **Hecho cuando:** los 10 casos pasan.

### ✅ Checkpoint 6.10
Abre el Gantt del sandbox en Notion: flechas de dependencia, fases críticas marcadas, y la carga de cada recurso sin pasarse de su capacidad en ninguna semana. Termina una fase tarde a propósito y comprueba que la previsión se mueve, la línea base no, y `/panel` te explica el retraso con las fechas del script.

---

## 🏁 Hito Etapa 6

- Commit `etapa-6: documentos vivos y roadmap como fuente de tickets` y etiqueta `etapa-6`.
- `CHANGELOG.md`: cuántas decisiones, líneas de arquitectura y tickets generados desde el roadmap tienes, y qué gastó el ticket de 6.8.2 frente a los de la Etapa 5 (debería gastar menos en `/spec-plan` gracias a `architecture.md`).

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| `architecture.md` crece sin control | Límite de unas 300 líneas. Si se pasa, que la retro de la Etapa 8 proponga resumirlo o dividirlo |
| El sync reescribe más de lo que debe | Solo toca la casilla y el sufijo de cada línea. Si en una prueba cambia algo más, para y arregla el script antes de seguir |
| Tareas del roadmap demasiado grandes | Si muchas acaban en `Split`, endurece `/project-roadmap`: que estime ficheros por tarea antes de proponerla |
| Fechas en UTC donde esperabas tu hora | Comprueba `timezone` en la configuración y usa siempre `stamp()`. Nunca `new Date().toLocaleString()` suelto |
| El panel de Notion no cuadra con el repo | Manda el repo: Notion solo recibe avisos y nunca se lee. Lanza `notion-sync.mjs --structure`, que vuelve a copiarlo todo desde el roadmap. Nunca edites fases a mano en Notion |
| Siempre te pasas de la estimación | Es lo normal al principio. Mira la desviación de las 3 o 4 primeras fases y deja que `/project-roadmap` corrija las siguientes |
| El cronograma promete fechas que luego no se cumplen | Es una previsión, no una promesa: se recalcula cada vez que una fase empieza o termina. Lo que no cambia es la línea base, y la diferencia entre las dos es lo que de verdad te dice cómo vas |
| Pones más capacidad de la real para que salgan fechas bonitas | El planificador es tan bueno como sus datos. Usa tus horas de verdad y revisa las horas y las líneas de la factoría con el informe de coste de la Etapa 9 |
