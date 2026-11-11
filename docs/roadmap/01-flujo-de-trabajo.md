# 📈 Flujo de trabajo de mi factoría

Cómo trabaja tu factoría de principio a fin, en 6 diagramas. Del más general al más detallado.

> 💡 **En Notion:** los diagramas están en bloques de código `mermaid`. Al importarlos, en cada bloque elige la vista **Preview** (o **Split**) para verlos dibujados.

**Leyenda de los diagramas:** 🧑 = intervienes tú · 🤖 = lo hace el agente · ⚙️ = lo hace un script (sin IA) · 🚪 = puerta donde se para hasta que decides.

---

## 1. La vista general

Un proyecto pasa por tres grandes momentos: **arrancar** (una vez), **construir** (en bucle) y **cambiar de rumbo** (cuando haga falta).

```mermaid
flowchart TD
    A["⚙️ Instalar el harness<br/>install.mjs"] --> B["🤖🧑 /project-start<br/>detecta el proyecto y adapta la configuración"]
    B --> C{"🧑 ¿Tienes material?<br/>grabaciones, documentos, notas"}
    C -- Sí --> D["⚙️🤖 /discovery-ingest<br/>registra, transcribe y analiza"]
    C -- "No, te lo cuento" --> E
    D --> E["🤖🧑 /discovery<br/>definimos el producto conversando"]
    E --> F["Documentos vivos<br/>brief · hitos · arquitectura · decisiones · roadmap"]
    F --> G{"⚙️ ¿READY?"}
    G -- No --> E
    G -- Sí --> NI["⚙️ El proyecto aparece en tu panel de Notion<br/>notion-sync --init"]
    NI --> H["⚙️🤖 La factoría construye<br/>en el modo que elegiste"]
    H -. "empieza o termina una fase" .-> NP["⚙️ Notion: inicio, fin y desviación<br/>de esa fase, sin tokens"]
    H --> I["🧑 Te toca<br/>tareas manuales · hitos · aprobaciones · bloqueos"]
    I --> H
    I -- "Reunión nueva o cambio de idea" --> J["🤖🧑 /discovery update<br/>petición de cambio con su impacto"]
    J --> F
```

---

## 2. Arrancar un proyecto: el descubrimiento

La parte más larga y donde más te implicas. Puede durar varias sesiones: se guarda por dónde vais.

```mermaid
flowchart TD
    subgraph M["Material"]
        M1["Grabación de reunión"] --> T["⚙️ Transcribir<br/>herramienta de reunión o Whisper local"]
        M2["Transcripción .vtt .srt .txt"] --> N["⚙️ Normalizar<br/>[mm:ss] Persona: texto"]
        T --> N
        M3["PDF · notas · capturas"]
    end
    N --> R["⚙️ sources.mjs<br/>SRC-001, SRC-002…"]
    M3 --> R
    R --> K["⚙️ Trocear en bloques"]
    K --> AN["🤖 analyst<br/>requisitos, fechas, dudas, glosario<br/>cada línea con su cita"]
    AN --> V1{"⚙️ validate-notes"}
    V1 -- Falla --> AN
    V1 -- OK --> NT["notes/SRC-n.md<br/>open-questions.md"]

    NT --> R1["🤖🧑 Ronda 1 · Problema y usuarios"]
    R1 --> R2["🤖🧑 Ronda 2 · Alcance y lo que NO se hará"]
    R2 --> R3["🤖🧑 Ronda 3 · Plazos, presupuesto, normativa"]
    R3 --> GP{"🚪 Gate P<br/>apruebas el brief"}
    GP --> R4["🤖🧑 Ronda 4 · Hitos reales"]
    R4 --> GH{"🚪 Gate H<br/>apruebas los hitos"}
    GH --> R5["🤖🧑 Ronda 5 · Arquitectura y stack"]
    R5 --> GI{"🚪 Gate I<br/>apruebas la configuración"}
    GI --> R6["🤖🧑 Ronda 6 · Roadmap"]
    R6 --> GR{"🚪 Gate R<br/>apruebas el roadmap"}
    GR --> SY["⚙️ sync-roadmap<br/>crea los tickets"]
    SY --> RD{"⚙️ validate-readiness"}
    RD -- "NOT READY" --> R1
    RD -- READY --> FIN["Listo para construir<br/>⚙️ el proyecto aparece en Notion"]
```

**Cómo detecta los hitos reales** (ronda 4): busca en las notas fechas y compromisos, el primer momento en que alguien puede usar el producto de punta a punta, demos o pruebas con alguien de fuera, pasos sin vuelta atrás (salir a producción, migrar datos) y dependencias de terceros. Cada hito propuesto cita la fuente de la que sale.

---

## 3. La factoría y sus modos

Cada vuelta del bucle es un ticket. El modo decide cuántas vueltas da antes de parar.

```mermaid
flowchart TD
    S["⚙️ factory.mjs"] --> RD{"⚙️ ¿READY?"}
    RD -- No --> STOP
    RD -- Sí --> NX["⚙️ next-ticket<br/>el siguiente del roadmap, en tu orden"]
    NX --> Q1{"¿Qué toca?"}
    Q1 -- "Tarea MANUAL" --> STOP
    Q1 -- "Hito alcanzado" --> STOP
    Q1 -- "Congelada por un CR" --> STOP
    Q1 -- "Nada disponible" --> STOP
    Q1 -- "Ticket de la factoría" --> SC{"¿Dentro del modo?<br/>misma fase, etapa o hito"}
    SC -- No --> STOP
    SC -- Sí --> LN{"⚙️ lanes.mjs<br/>¿línea libre y sin ficheros<br/>compartidos con otro en marcha?"}
    LN -- "No, espera turno" --> NX
    LN -- Sí --> TK["⚙️🤖 headless.mjs en su carpeta<br/>las 4 fases del ticket<br/>(varias líneas a la vez)"]
    TK --> SY["⚙️ sync-roadmap + schedule<br/>marca el resultado, el reloj de la fase<br/>y recalcula el cronograma"]
    SY --> PH{"¿Empezó o terminó<br/>una fase?"}
    PH -- Sí --> NS["⚙️ notion-sync --phase<br/>inicio o fin, previsión y ruta crítica en Notion"]
    PH -- No --> LIM
    NS --> LIM{"¿Bloqueo o límite?<br/>tickets, gasto, horas"}
    LIM -- Sí --> STOP
    LIM -- No --> MO{"¿Modo ticket?"}
    MO -- Sí --> STOP
    MO -- No --> NX
    STOP["⚙️ Para y escribe el informe<br/>qué hizo · por qué paró · qué te toca"] --> YOU["🧑 Te toca"]
```

| Modo | Hasta dónde llega sola |
|---|---|
| `manual` | Nada: lanzas tú cada fase de cada ticket |
| `ticket` | Un ticket por sesión |
| `phase` | Hasta acabar la fase del roadmap en curso |
| `stage` | Hasta acabar la etapa del roadmap en curso |
| `milestone` | Hasta el siguiente hito |
| `continuous` | Hasta que haga falta una persona (o un límite) |

**Varias líneas a la vez.** En cualquier modo, la factoría puede llevar varios tickets en paralelo (`lanes`), cada uno en su propia carpeta (`git worktree`). Entran a la vez solo los que no dependen el uno del otro y no tocan los mismos ficheros; el resto espera su turno. Si una línea se para por una puerta tuya, las demás siguen. Al final, `integration-check.mjs` junta todo lo terminado y vuelve a pasar las comprobaciones, porque dos tickets que funcionan por separado pueden romperse juntos.

Con `designApproval: "human"`, en cualquier modo la factoría prepara el diseño de cada ticket y espera a que lo apruebes antes de programar.

**Qué llega a Notion:** solo dos avisos por fase. Cuando arranca su primera tarea, `sync-roadmap` apunta la fecha y hora de inicio en `roadmap.md` y Notion la copia; cuando termina la última, lo mismo con el fin, y Notion calcula la duración y la desviación frente a tu estimación. Cada aviso lleva también la previsión nueva que calcula `schedule.mjs` (dependencias, recursos y ruta crítica), así que el Gantt de Notion siempre está al día y la línea base se queda quieta para comparar. Todos tus proyectos van al mismo panel, "🏭 Factoría". Los agentes nunca leen Notion: si mañana lo quitas, la factoría sigue igual.

---

## 4. Un ticket por dentro

Lo que pasa en cada vuelta del bucle anterior. Es **SDD** (las fases 1 y 2 dejan la especificación aprobada antes de tocar código) y **TDD** (en cada capa, primero los tests que fallan y después el código que los hace pasar, comprobado por `tdd-check`).

```mermaid
flowchart TD
    TI["tickets/FEATURE-3.md"] --> C1["🤖 1 · Clarify<br/>lee brief, roadmap y decisiones vigentes"]
    C1 --> V0{"⚙️ validate-clarification"}
    V0 --> P1["🤖 2 · Plan<br/>lee arquitectura y lecciones"]
    P1 --> GA{"🚪 Gate A · diseño<br/>tú, o solo en automático"}
    GA --> GB{"🚪 Gate B · tamaño<br/>⚙️ script"}
    GB -- Split --> SP["El roadmap se trocea<br/>🧑 decides"]
    GB -- OK --> GM{"🚪 Gate M · migraciones<br/>🧑 siempre tú"}
    GM --> GC{"🚪 Gate C · auditoría<br/>🤖 plan-auditor, hasta 3 vueltas"}
    GC --> I1["🤖 3 · Implement<br/>capa a capa"]
    subgraph L["Por cada capa · TDD"]
        DT["🤖 developer<br/>escribe solo los tests"] --> RED{"⚙️ tdd-check red<br/>¿fallan?"}
        RED --> DV["🤖 developer<br/>código hasta que pasen"]
        DV --> HK["⚙️ hook de lint<br/>tras cada edición"]
        HK --> DV
        DV --> GRN{"⚙️ tdd-check green<br/>¿pasan sin tocar los tests?"}
        GRN --> RV["🤖 reviewer<br/>otro modelo"]
    end
    I1 --> CP["⚙️ context-pack<br/>prepara el encargo"]
    CP --> DT
    RV --> VA["⚙️ 4 · Validate<br/>run-checks: lint · tipos · tests · build<br/>sin gastar tokens"]
    VA --> DOD{"⚙️ validate-dod"}
    DOD -- RED --> I1
    DOD -- GREEN --> DOCS["⚙️🤖 Documentos al día<br/>arquitectura · decisiones · roadmap [x]"]
    DOCS --> PR["🧑 Revisas el diff y haces la PR"]

    DV -. fricción .-> J["⚙️ journal.jsonl"]
    GC -. hallazgos .-> J
    RV -. hallazgos .-> J
    J --> RT["🤖 /spec-retro<br/>cada ~5 tickets"]
    RT --> LS["lessons.json"]
    LS -. "lecciones confirmadas" .-> P1
```

---

## 5. Cambiar de rumbo a mitad de proyecto

Cambiar de idea es normal. La regla es que nunca se cambia sin ver antes qué rompe.

```mermaid
flowchart TD
    O1["Reunión nueva"] --> IN["⚙️🤖 /discovery-ingest"]
    O2["Feedback al validar un hito"] --> IN
    O3["Idea en la bandeja de Notion"] --> IN
    IN --> DU["🤖 /discovery update<br/>compara con lo ya definido"]
    DU --> Q{"¿Qué es?"}
    Q -- "Una aclaración" --> BR["Se actualiza el brief o el glosario"]
    Q -- "Cambia el producto" --> CR["🤖 CR-n.md<br/>impacto en brief, decisiones,<br/>hitos, roadmap y arquitectura"]
    CR --> FZ["⚙️ Las tareas afectadas se congelan<br/>la factoría se las salta"]
    FZ --> AS["🤖 ¿Tiene sentido?<br/>encaje, decisiones que sustituye,<br/>trabajo que rehacer, coste en tickets"]
    AS --> GCR{"🚪 Gate CR<br/>🧑 decides"}
    GCR -- "Aceptar" --> AP["⚙️🤖 Se aplica a todos los documentos<br/>tareas nuevas y de rehacer,<br/>decisiones que sustituyen a otras<br/>y el panel de Notion"]
    GCR -- "Aplazar o rechazar" --> UF
    AP --> UF["⚙️ Se descongelan las tareas"]
    UF --> FB["La factoría sigue"]
```

---

## 6. Dónde intervienes tú

Todo lo demás lo hacen los agentes y los scripts.

| Momento | Qué haces | Comando o puerta |
|---|---|---|
| Arranque | Das el material o lo cuentas; respondes las rondas | `/project-start`, `/discovery` |
| Definición | Apruebas brief, hitos, configuración y roadmap | Gate P, Gate H, Gate I, Gate R |
| Cada ticket | Apruebas el diseño (si así lo configuras) y las migraciones | Gate A, Gate M |
| Ticket grande | Decides cómo trocearlo | Gate B |
| Cuando para la factoría | Lees el informe y haces lo que te toca | `specs/runs/<fecha>.md` |
| Tareas manuales | Las haces y las marcas en el roadmap | Tareas `MANUAL-n` |
| Hitos | Enseñas la demo y validas | `/milestone-review H1` |
| Bloqueos | Lees el motivo, lo resuelves y borras el fichero | `BLOCKED.md` |
| Cambios | Decides si se hacen | `/discovery update`, Gate CR |
| Decisiones fuera de un ticket | Las apuntas | `/decision` |
| Antes de mergear | Revisas el diff y abres la PR | Commit y PR siempre tuyos |
| Cada ~5 tickets | Lees la retro y aplicas las mejoras | `/spec-retro` |
| Cuando quieras ver cómo va todo | Abres el panel y miras, sin tocar nada | "🏭 Factoría" en Notion |
