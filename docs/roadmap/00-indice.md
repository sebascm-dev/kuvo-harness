# 🏭 Roadmap · Mi factoría harness

Plan completo para construir **tu propio harness de Claude Code**: una factoría reutilizable que convierte un ticket en código validado, inspirada en la charla "Harness Engineering" del BiznagaFest 2026 (Joan León y Carlos Villuendas) y adaptada a tu forma de trabajar.

Este roadmap es **solo del harness**. El proyecto real donde lo probaremos (el banco de pruebas) tendrá su propio roadmap más adelante. Mientras tanto, cada pieza se prueba en un **sandbox mínimo** que creas en la Etapa 0.

📈 **Para ver cómo trabajará tu factoría de principio a fin, empieza por `01-flujo-de-trabajo.md`**: tiene los diagramas del flujo completo.

---

## 🧭 Cómo usar este roadmap

- **Etapa → Fase → Tarea.** Las etapas son bloques grandes con un hito al final. Las fases agrupan tareas de un mismo tema. Las tareas duran entre 15 y 90 minutos.
- **Cada tarea tiene 5 partes:**
  - **Qué:** lo que vas a construir.
  - **Por qué:** para qué sirve dentro del sistema. Si no entiendes el porqué, para y pregúntalo antes de seguir.
  - **Cómo:** los pasos concretos.
  - **Hecho cuando:** la prueba que demuestra que está terminada. Si no se cumple, no está hecha.
  - **Referencia:** el fichero del repo original que puedes mirar como ejemplo.
- **✅ Checkpoint** al final de cada fase: una comprobación que tienes que pasar antes de empezar la siguiente fase. Es lo que hace el roadmap "seguro": los errores se pillan pronto, cuando son baratos.
- **🏁 Hito** al final de cada etapa: algo que funciona, un commit con etiqueta en Git (`etapa-0`, `etapa-1`…) y una línea en el `CHANGELOG.md`. Si algo se rompe más adelante, siempre puedes volver al último hito.
- **⚠️ Riesgos**: lo que suele fallar en esa etapa y qué hacer.
- **No te saltes etapas.** Cada una usa lo que construiste en la anterior.

**Repo de referencia:** [nucliweb/harness-engineering-biznagafest](https://github.com/nucliweb/harness-engineering-biznagafest) (licencia MIT, puedes reutilizar piezas). Cuando una tarea dice "Referencia: `ruta`", es una ruta dentro de ese repo.

---

## 🎯 Qué vas a tener al final

Un repositorio `harness` en tu GitHub que:

1. Se instala en **cualquier proyecto** tuyo o de un cliente con un comando.
2. Se configura con **un solo fichero** (`harness.config.json`): capas, comandos, umbrales y modelos.
3. Te deja cambiar entre **perfil Pro y perfil Max** con un comando, sin tocar los agentes a mano.
4. Funciona en **Windows directo** (todo en Node, sin depender de bash).
5. Lleva un ticket por **4 fases** (clarify, plan, implement, validate) con puertas, validadores por script y memoria de errores. Trabaja con **SDD** (nada de código sin especificación aprobada) y **TDD comprobado por script** (en cada capa, primero los tests que fallan y después el código que los hace pasar, sin tocarlos).
6. Puede correr **solo** (modo headless) y medir tiempo y coste de cada fase.
7. Mantiene **vivos los documentos de cada proyecto**: brief, arquitectura, registro de decisiones con fecha y hora, y un roadmap cuyas tareas **son los tickets de la factoría**.
8. **Arranca cada proyecto definiendo el producto contigo**: analiza grabaciones de reuniones, documentos y notas, detecta los hitos reales y deja todo trazado hasta el minuto de la reunión del que sale. Y gestiona los cambios a mitad de proyecto con su análisis de impacto.
9. Trabaja en el **modo que elijas**: un ticket por sesión, una fase o una etapa del roadmap, hasta el siguiente hito, o sin parar hasta que haga falta una persona. Y con **varias líneas a la vez**: los tickets que no dependen entre sí ni tocan los mismos ficheros avanzan en paralelo, cada uno en su carpeta, y un script comprueba que juntos también funcionan.
10. **Gasta solo donde aporta**: todo lo mecánico (preparar encargos, ejecutar comprobaciones, recortar logs, avisar a Notion) lo hacen scripts sin gastar tokens, y un informe te dice dónde se va el cupo.
11. Te enseña el avance de **todos tus proyectos en un solo panel de Notion**: cada proyecto aparece cuando queda definido, y cada fase muestra su estimación en horas, cuándo empezó, cuándo terminó y cuánto te desviaste. Lo ves como un **diagrama de Gantt al estilo Microsoft Project**: dependencias con flechas, recursos (tú y la factoría) con su capacidad, ruta crítica y línea base frente a previsión. Notion solo mira: las fechas las calcula un script y el trabajo vive en el repo.

---

## 🧱 Decisiones de diseño (y por qué)

| Decisión | Por qué |
|---|---|
| **El harness vive en su propio repo** y se instala en los proyectos | Lo escribes una vez y lo reutilizas en todos tus proyectos y en tu agencia |
| **Todo configurable desde `harness.config.json`** | Cada proyecto tiene capas y comandos distintos. El harness no debe saber nada de un proyecto concreto |
| **Hooks y scripts en Node (`.mjs`)** | Funcionan igual en Windows, Mac y Linux. Nada de `.sh` |
| **Scripts sin dependencias externas** | Funcionan nada más clonar, sin `pnpm install` ni programas extra. Igual que en el original |
| **Para buscar, ripgrep (`rg`); dentro de los scripts, Node** | `rg` es más rápido que `grep` y se salta lo que ignora Git, así que el agente no llena su contexto con `node_modules`. Claude Code ya lo usa por dentro. Los scripts buscan con `fs` para no depender de nada instalado |
| **Perfiles de modelo Pro y Max** | Puedes cambiar de plan el día de mañana sin reescribir nada |
| **Validadores antes que fases** | Primero construyes "el juez" y luego a los agentes. Así cada fase nace ya validada |
| **Contrato primero** | Ellos lo escribieron antes que cualquier agente. Si contrato y código no coinciden, el código está mal |
| **Stack por defecto: Next.js + TypeScript + Supabase + Vercel** | Es tu stack, pero todo se puede cambiar en la configuración |
| **El roadmap del proyecto manda sobre los tickets** | Planificas una vez, en un solo sitio. Los tickets salen del roadmap y su estado vuelve a él solo |
| **Cada documento tiene un dueño y un validador** | La documentación que se actualiza a mano se desfasa. Aquí la actualiza el proceso |
| **Las fechas las pone un script, nunca un modelo** | Un modelo no sabe qué hora es. Todo lo fechado pasa por `stamp()` |
| **Lo mecánico, siempre por script** | Los tokens se van en leer textos largos y en escribir lo que un script podría generar. El modelo solo hace lo que necesita criterio: entender, diseñar, programar y revisar |
| **SDD + TDD, comprobados por script** | El agente no puede programar sin plan aprobado ni escribir código antes que sus tests: lo impiden los validadores y `tdd-check.mjs`. Es la forma más eficaz de que no se invente que algo funciona |
| **El cronograma lo calcula un script, no Notion ni el modelo** | Notion dibuja Gantts pero no calcula dependencias, recursos ni ruta crítica. `schedule.mjs` lo hace igual siempre con los mismos datos |
| **Notion solo muestra el avance; el trabajo vive en el repo** | Los agentes nunca leen Notion, así no gastan cupo yendo y viniendo. Un script avisa a Notion solo cuando una fase empieza o termina, y un único panel recoge todos tus repos |
| **El propio harness usa sus documentos** | Desde la Etapa 1 el repo `harness` tiene su `decisions.md` y su `architecture.md`. Si el formato sirve para él, sirve para cualquiera |

---

## 🔒 Determinista por diseño

Un modelo nunca es 100 % determinista: con la misma pregunta puede responder distinto, y si le falta información, la rellena. Lo que sí se puede hacer determinista es **todo lo que lo rodea**. La regla de la factoría es: **el modelo propone, un script comprueba y solo un script cambia el estado.**

| Qué | Quién lo decide | Por qué no puede alucinar |
|---|---|---|
| Fechas y horas | `stamp()` | El modelo no sabe qué hora es; el script, sí |
| IDs de tickets, decisiones, fuentes y CR | Scripts: el siguiente número libre | Nunca se inventa un ID ni se repite |
| Estado de tareas y fases, reloj de cada fase, hitos `reached` | `sync-roadmap.mjs` | Sale de ficheros que existen: `04-dod.md` en `GREEN`, `BLOCKED.md` |
| Qué ticket toca ahora | `next-ticket.mjs` | Orden y dependencias del roadmap, no lo que "le parezca" al agente |
| Si un documento está bien hecho | Los validadores | Títulos, campos y citas comprobados por código |
| Si el código funciona | `run-checks.mjs`: lint, tipos, tests y build | El modelo no dice "funciona": lo dice la salida del comando |
| Si los tests se escribieron antes que el código y nadie los tocó | `tdd-check.mjs` | Exige un rojo antes de cada verde y compara la huella de cada test |
| Fechas del cronograma, ruta crítica y retrasos | `schedule.mjs` | Con el mismo roadmap y la misma capacidad, siempre las mismas fechas |
| Qué tickets van en paralelo | `lanes.mjs` | Dependencias del roadmap y ficheros de cada plan: si se cruzan, esperan |
| Si los tickets hechos en paralelo funcionan juntos | `integration-check.mjs` | Los junta todos y vuelve a pasar lint, tipos, tests y build |
| Si un ticket es demasiado grande | Gate B, por script | Cuenta ficheros y capas, no opina |
| Qué contexto recibe cada agente | `context-pack.mjs` y `repo-map.mjs` | El agente no busca a ciegas ni "recuerda" cosas del proyecto |
| Notion | `notion-sync.mjs` | Copia del repo, nunca al revés |
| Commit, push y PR | Tú (o `publish.mjs` en la Etapa 11) | El agente tiene prohibido hacerlo |

**Lo que sí hace el modelo:** entender, preguntar, diseñar, programar y revisar. Ahí está su valor, y por eso cada una de esas salidas va atada:
1. **Formato fijo** definido en el contrato: el modelo rellena una plantilla, no escribe libre.
2. **Validador antes de seguir**: si falta un campo o un título, la fase no avanza.
3. **Reintentos limitados**: si falla varias veces, se para con un `BLOCKED.md` que explica el motivo, en vez de improvisar.
4. **Citas comprobables**: todo lo que se afirma del producto lleva su fuente (`[SRC-003 @ 12:40]`) y el validador comprueba que esa fuente y ese minuto existen.
5. **Memoria solo en ficheros**: decisiones, arquitectura y lecciones están escritas en el repo. Nada depende de "lo que el agente recuerde" de otra sesión.

---

## 🗺️ Arquitectura del harness

```
harness/
├─ harness.config.json        ← lo único que cambia entre proyectos
├─ docs/
│  ├─ contracts.md            ← la única fuente de verdad
│  ├─ architecture.md         ← la arquitectura del propio harness
│  ├─ decisions.md            ← las decisiones del propio harness
│  └─ run-metrics.md          ← tiempo y coste medidos
├─ .claude/
│  ├─ settings.json           ← permisos y hooks
│  ├─ agents/                 ← 6 subagentes
│  ├─ skills/                 ← 4 fases, arranque, descubrimiento, hitos, roadmap, decisiones, retro y apoyo
│  ├─ hooks/                  ← lint tras editar, captura del journal
│  └─ scripts/                ← validadores, journal, decisiones, roadmap, perfiles, ahorro de tokens, Notion (Node puro)
├─ scripts/
│  ├─ factory.mjs             ← la factoría: encadena tickets según el modo
│  ├─ headless.mjs            ← piloto automático de un ticket
│  ├─ adversarial-review.mjs  ← dos modelos discuten
│  └─ install.mjs             ← instala el harness en otro proyecto
├─ templates/                 ← plantillas de ticket, CLAUDE.md por capa y docs/ del proyecto
└─ sandbox/                   ← proyecto mínimo para probar el harness
```

**Lo que produce cada ticket** (dentro del proyecto donde se instala):

```
specs/FEATURE-1/
├─ 00-clarification.md   qué hay que hacer (producto)
├─ 01-research.md        qué existe ya (inventario)
├─ 02-design.md          cómo hacerlo (decisiones cerradas)
├─ 03-plan.md            pasos con fichero y pseudocódigo, se marca [x]
├─ 04-dod.md             resultado de lint, tipos, tests y build
├─ 05-design-qa.md       revisión visual (solo si cambia la interfaz)
├─ journal.jsonl         diario de fricción
└─ BLOCKED.md            solo si algo paró la factoría
```

---

## 📁 Lo que se crea en cada proyecto

Al instalar el harness en un proyecto, se crea siempre la misma estructura. **Lo que se adapta es el código**, no las carpetas del harness: que todo esté siempre en el mismo sitio es lo que permite a los agentes encontrarlo.

```
mi-proyecto/
├─ harness.config.json     ← lo que se adapta: capas, comandos, modo, perfil
├─ .claude/                ← el harness (agentes, skills, hooks, scripts)
├─ discovery/              ← lo que se sabe del producto y de dónde sale (Etapa 7)
│  ├─ inbox/               ← aquí dejas grabaciones, transcripciones, documentos (no va a Git)
│  ├─ transcripts/         ← texto de cada grabación (no va a Git)
│  ├─ notes/SRC-001.md     ← lo extraído de cada fuente, citando el minuto
│  ├─ sources.md · open-questions.md · session.md
│  └─ changes/CR-001.md    ← peticiones de cambio a mitad de proyecto
├─ docs/                   ← los documentos vivos (Etapa 6)
│  ├─ brief.md             ← qué es el producto, para quién y qué no hará
│  ├─ roadmap.md           ← etapas → fases → tareas, con sus hitos. Cada tarea de la factoría ES un ticket
│  ├─ architecture.md      ← cómo está construido ahora mismo
│  ├─ decisions.md         ← decisiones con fecha y hora; solo se añade
│  └─ contracts.md         ← el contrato del harness (lo actualiza el instalador)
├─ tickets/                ← un fichero por ticket, generados desde el roadmap
├─ specs/                  ← el trabajo de cada ticket, informes de ejecución, lecciones y notion-map.json (dónde está el proyecto en tu panel)
└─ src/…                   ← tu código, con las capas que diga la configuración
```

Fuera de los repos, en tu usuario, solo hay un fichero: `~/.harness/notion.json`, con los IDs del panel "🏭 Factoría" que comparten todos tus proyectos. La clave de Notion va en la variable de entorno `NOTION_TOKEN`, nunca en un fichero.

| Siempre igual | Se adapta a cada proyecto |
|---|---|
| `.claude/`, `discovery/`, `docs/`, `tickets/`, `specs/` | Capas, carpetas de código y comandos (los detecta `/project-start`) |
| Nombres y formatos de documentos y artefactos | Migraciones, perfil de modelo y modo de ejecución |
| El contrato | Si usas grabaciones o no: `discovery/` existe siempre, aunque se quede vacía |

**El orden en un proyecto nuevo:** instalar → `/project-start` → material y descubrimiento (la parte larga, contigo) → `READY` → la factoría trabaja en el modo que elijas → tú validas hitos, haces las tareas manuales y decides los cambios.

---

## 🎚️ Perfiles de modelo

Se eligen con `node .claude/scripts/set-profile.mjs pro` o `max`. Lo construyes en la Etapa 4.

| Pieza | Perfil Pro | Perfil Max | Por qué este modelo |
|---|---|---|---|
| Hilo principal (fases) | Sonnet | Opus | Conversa contigo y orquesta |
| explorer | Haiku | Haiku | Solo busca: volumen, no criterio. Lee antes el mapa del código |
| plan-auditor | Sonnet (esfuerzo alto) | Opus | Juzga un plan sin código que ejecutar |
| developer | Sonnet | Sonnet | Pasos concretos y validados por scripts |
| reviewer | Opus | Opus | Distinto del developer, para no compartir puntos ciegos |
| design-qa | Sonnet | Sonnet | Mira capturas y juzga |
| analyst | Sonnet | Sonnet | Lee transcripciones y documentos largos y extrae requisitos: comprensión, no razonamiento profundo |

En Pro, Opus solo se usa para revisar diffs, que son cortos. Es donde más aporta por token gastado.

**No hay agente validador:** el original usa uno (`validator-global`, con Haiku) para ejecutar las comprobaciones y rellenar `04-dod.md`. Aquí lo hace `run-checks.mjs`, que no gasta tokens. Y en la Etapa 9, los tickets pequeños van por un **carril rápido** con el modelo más barato.

---

## 📚 Las etapas

| Etapa | Qué consigues | Tiempo | Fichero |
|---|---|---|---|
| **0 · Preparación** | Entorno Windows listo, el original entendido, repo y sandbox creados | 6–8 h | `etapa-0-preparacion.md` |
| **1 · Contrato y configuración** | `contracts.md`, `harness.config.json`, normas, permisos y las primeras decisiones | 13–15 h | `etapa-1-contrato.md` |
| **2 · Feedback inmediato** | El agente ve sus errores de lint al instante | 4–5 h | `etapa-2-feedback.md` |
| **3 · El juez** | Validadores, journal, bloqueos y los scripts que ahorran tokens: todo por script, con tests | 17–20 h | `etapa-3-juez.md` |
| **4 · Perfiles y agentes** | Selector Pro/Max y los 5 subagentes | 9–11 h | `etapa-4-agentes.md` |
| **5 · Las 4 fases** | `/spec-clarify`, `/spec-plan`, `/spec-implement`, `/spec-validate`, con encargos preparados por script, SDD y TDD comprobado por script | 16–18 h | `etapa-5-fases.md` |
| **6 · Documentos vivos** | Brief, arquitectura, decisiones con fecha y hora, el roadmap como fuente de tickets, el reloj de cada fase, un planificador tipo Project y el panel de Notion con el Gantt de todos tus proyectos | 28–31 h | `etapa-6-documentos.md` |
| **7 · Descubrimiento** | Grabaciones y documentos analizados, el producto definido contigo, hitos reales y cambios a mitad de proyecto | 22–25 h | `etapa-7-descubrimiento.md` |
| **8 · Memoria** | Hook del journal, retro y lecciones | 8–10 h | `etapa-8-memoria.md` |
| **9 · Modo factoría** | Piloto automático, 6 modos de ejecución, informes, revisión adversarial, medir y recortar el gasto, y varios tickets en paralelo | 23–25 h | `etapa-9-factoria.md` |
| **10 · Plantilla reutilizable** | Instalador, `/project-start` que adapta el harness a cada proyecto, documentación y versión 1.0 | 13–15 h | `etapa-10-plantilla.md` |
| **11 · Producción** *(opcional)* | Bandeja de ideas en Notion, trabajador 24/7, triaje de PRs, release progresiva | 10–20 h | `etapa-11-produccion.md` |

**Total Etapas 0 a 10: unas 171 horas** (sumando el tiempo de cada tarea: 308 tareas en total, 298 sin la Etapa 11). A 12 horas por semana de lunes a jueves (3 h al día), **unas 15 semanas**; a 15 horas por semana, unas 12.

> 📅 **Tus días de trabajo cuentan.** No trabajas viernes, sábado ni domingo, así que las fechas del cronograma solo avanzan de lunes a jueves. Las semanas totales no cambian mientras metas tus 12 horas en esos 4 días; si un día no llegas a 3 horas, el cronograma se alarga solo.

**No tienes que esperar al final para usarla.** Hay tres puntos donde ya te sirve en proyectos reales:
- **Al acabar la Etapa 5 (semana 6):** una factoría que funciona, lanzando tú las 4 fases de cada ticket, y ya ahorrando tokens con scripts.
- **Al acabar la Etapa 7 (semana 11):** además, arrancas proyectos con reuniones y documentos, el roadmap genera los tickets y ves todos tus proyectos en Notion como un Gantt.
- **Al acabar la Etapa 9 (semana 13):** además, trabaja sola en el modo que elijas, con varios tickets a la vez, y sabes exactamente cuánto gasta.

Es bastante más que lo que te dije al principio (35–50 h), y prefiero decírtelo claro: aquella cifra era para copiar su harness. Este es **reutilizable** (configurable para cualquier proyecto), **funciona en Windows** sin bash, trae piezas que el original no tiene (selector Pro/Max, validador de `04-dod.md`, Gate M para migraciones, documentos vivos con roadmap como fuente de tickets, descubrimiento con reuniones y trazabilidad, hitos reales, modos de ejecución, scripts de ahorro de tokens, TDD comprobado por script, planificador tipo Project con Gantt en Notion para todos tus proyectos, instalador que se adapta a cada proyecto) y lleva **checkpoints** en cada fase. Esas horas extra son las que lo hacen seguro.

Las estimaciones son para alguien que está aprendiendo. Las tareas marcadas "Pídeselo a Claude" pueden ir bastante más rápido.

---

## 📋 Ritmo recomendado (12 h por semana, de lunes a jueves)

| Semana | Fases | Al acabar la semana |
|---|---|---|
| 1 | 0 y 1.1 a 1.2 | Entorno listo, el original entendido y el contrato escrito |
| 2 | 1.3 a 1.6, 2.1 y 2.2 | Configuración, capas, normas, permisos y el hook de lint escrito |
| 3 | 2.3 a 3.5 | El hook probado y los validadores principales con sus tests en verde |
| 4 | 3.6 a 4.2 | Journal, bloqueos, scripts que ahorran tokens y el selector Pro/Max |
| 5 | 4.3 a 5.2 | Los 5 agentes probados, `context-pack.mjs` y `/spec-clarify` |
| 6 | 5.3 a 6.1 | **Un ticket del sandbox llega a `GREEN` con TDD: ya tienes una factoría** |
| 7 | 6.2 a 6.6 | Plantillas, decisiones, arquitectura, roadmap y sus skills |
| 8 | 6.7 a 6.9 | **El primer ticket que sale solo del roadmap**, y tus proyectos en el panel de Notion |
| 9 | 6.10, 7.1 y 7.2 | El Gantt tipo Project en Notion, y las fuentes registradas y transcritas |
| 10 | 7.3 a 7.6 | Analista, `/discovery`, hitos reales y cambios a mitad de proyecto |
| 11 | 7.7 y 8 | **Una reunión simulada llega hasta `READY`**, y lecciones funcionando |
| 12 | 9.1 a 9.5 | Piloto automático, métricas, revisión adversarial y los 6 modos |
| 13 | 9.6 a 9.8 | Prueba real, informe de coste y **varios tickets a la vez** |
| 14 | 10.1 a 10.5 | Instalador, `/project-start`, prueba en un proyecto de verdad y documentación |
| 15 | 10.6 | **Versión 1.0** instalable, documentada y en tu portfolio |

Si una semana no llegas, no pasa nada: **el siguiente paso es siempre el siguiente checkpoint**, no la fecha.

---

## 🧰 Convenciones de este roadmap

- Las rutas como `.claude/scripts/validate-plan.mjs` son **dentro de tu repo `harness`**.
- `⏱️` es una estimación para alguien que está aprendiendo. Si vas más rápido, mejor.
- Los comandos de terminal son para **PowerShell** salvo que se diga otra cosa. Las órdenes que ejecuta el agente pasan por Git Bash, que instala Git for Windows.
- Cuando veas **"Pídeselo a Claude"**, puedes delegar el texto o el código en Claude Code, pero **la tarea no está hecha hasta que entiendas el resultado y pase el "Hecho cuando"**.
- Las tareas marcadas **(opcional)** se pueden saltar sin romper nada.

---

## 🔗 Glosario rápido

| Término | Qué es |
|---|---|
| **Harness (arnés)** | Todo lo que rodea al modelo: normas, agentes, skills, hooks, scripts y permisos |
| **Skill** | Un fichero de instrucciones que Claude Code carga cuando lo necesita o cuando tú lo lanzas con `/nombre` |
| **Subagente** | Un Claude con su propio contexto limpio, su modelo y sus herramientas, que hace una sola tarea |
| **Hook** | Un script que Claude Code ejecuta automáticamente en un momento concreto (tras editar, al acabar un agente…) |
| **Artefacto** | Un fichero que produce una fase (`00-clarification.md`, `03-plan.md`…) |
| **Validador** | Un script sin IA que dice si un artefacto cumple el contrato |
| **Gate (puerta)** | Un punto donde el proceso se para hasta que se cumple una condición o decides tú |
| **Journal** | El diario de un ticket: lo que falló, se desvió o decidiste tú |
| **Headless** | Ejecutar Claude Code sin interfaz, con `claude -p`, para que trabaje solo |
| **EARS** | Formato para criterios comprobables: `WHEN <algo> THE <capa> SHALL <resultado>` |
| **ADR** | Architecture Decision Record: una entrada del registro de decisiones, con fecha, contexto, decisión y consecuencias |
| **Roadmap vs plan** | El **roadmap** (`roadmap.md`) es la planificación de todo el proyecto. El **plan** (`03-plan.md`) son los pasos de un solo ticket. No los confundas |
| **Documento vivo** | Un documento con dueño, formato y validador, que el propio proceso mantiene al día |
| **Descubrimiento** | La etapa inicial de cada proyecto: recoger material, analizarlo y definir contigo qué se construye |
| **Fuente (`SRC-n`)** | Cada cosa de la que sale información: una reunión, un documento, unas notas o tus respuestas. Todo cita su fuente |
| **Hito real** | Un punto donde algo se entrega o se demuestra a alguien de fuera, que lo valida. La factoría se para en él |
| **CR (petición de cambio)** | Un cambio a mitad de proyecto, con su análisis de impacto, que aceptas, aplazas o rechazas tú |
| **Modo de ejecución** | Hasta dónde trabaja sola la factoría: un ticket, una fase, una etapa, hasta un hito o sin parar |
| **Economía de tokens** | Las 4 reglas para no gastar de más: nada de copiar a mano, nada de logs sin recortar, nada de agentes para rellenar plantillas, mapa antes que ficheros |
| **Carril rápido** | El camino corto para tickets pequeños: menos pasos de planificación y el modelo más barato, sin quitar las puertas importantes |
| **`READY`** | El proyecto está lo bastante definido para que la factoría empiece. Lo dice un script, no una opinión |
