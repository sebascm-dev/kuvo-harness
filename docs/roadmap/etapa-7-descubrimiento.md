# 🔍 Etapa 7 · Descubrimiento del proyecto

**Objetivo:** que antes de escribir una línea de código, el harness te ayude a definir **qué producto se va a construir**: recoge grabaciones de reuniones, documentos y notas, los analiza, conversa contigo para cerrar dudas y deja escritos el brief, los hitos reales, la arquitectura inicial y el roadmap. Y que, si a mitad de proyecto algo cambia, se pueda replantear con orden.

**Al acabar tendrás:** la carpeta `discovery/`, los scripts para registrar y transcribir fuentes, el agente `analyst`, las skills `/discovery-ingest`, `/discovery` y `/milestone-review`, los hitos dentro del roadmap y el flujo de cambios a mitad de proyecto (peticiones de cambio, `CR`).

**Requisitos previos:** Etapa 6 (los cuatro documentos y sus scripts).
**Tiempo:** 22–25 h. Es la etapa más larga, y es normal: lo que se define aquí marca todo el proyecto. La tarea 7.2.2 (transcripción local) es opcional.

> 💡 **Por qué es la etapa más importante para tu agencia:** una factoría que construye muy bien lo que no era sigue construyendo lo que no era. Aquí es donde más tiempo pasáis juntos tú y el agente, y donde más vale tu criterio.

> ⚠️ **Lo franco sobre las grabaciones:** Claude no escucha audio. Una grabación tiene que convertirse antes en texto. Tienes tres caminos, de más fácil a más trabajoso:
> 1. **La transcripción de la propia herramienta** (Google Meet, Teams o Zoom la generan): la descargas y la dejas en la carpeta. Es la opción recomendada.
> 2. **Transcribir en tu ordenador** con Whisper, un modelo gratuito que funciona sin internet (tarea 7.2.2).
> 3. **Contárselo tú** en la conversación: tus respuestas también cuentan como fuente.

> 🔒 **Privacidad:** las grabaciones con clientes contienen datos personales. Avisa siempre de que grabas y para qué. Por defecto, las grabaciones y transcripciones **nunca se suben a Git**; solo las notas extraídas.

---

## 🗂️ Cómo queda la carpeta `discovery/`

```
discovery/
├─ inbox/              aquí dejas lo que tengas: grabaciones, transcripciones, PDFs, notas
├─ transcripts/        el texto de cada grabación, con marcas de tiempo
├─ notes/SRC-001.md    lo que se extrajo de cada fuente, citando el minuto
├─ sources.md          índice de fuentes: ID, tipo, fecha, participantes y estado
├─ open-questions.md   dudas pendientes para la próxima reunión
├─ session.md          por dónde va la conversación de /discovery (para retomarla otro día)
└─ changes/CR-001.md   peticiones de cambio a mitad de proyecto
```

`inbox/` y `transcripts/` van en `.gitignore`. Todo lo demás, en Git.

**La trazabilidad es la clave:** cada requisito del brief, cada hito y cada decisión cita de dónde sale: `[SRC-003 @ 12:40]` (fuente 3, minuto 12:40). Así siempre sabes por qué algo está en el producto, y si alguien dice "eso no lo pedí", vas al minuto exacto.

---

## Fase 7.1 · Contrato del descubrimiento

- [ ] **7.1.1 · Carpeta y privacidad** · ⏱️ 20 min
  - **Qué:** una sección del contrato con la estructura de `discovery/`, qué va a Git y qué no, y la regla del aviso de grabación.
  - **Por qué:** decidir esto antes de tener la primera grabación de un cliente evita subir datos personales por accidente.
  - **Cómo:** copia el árbol de arriba y añade las reglas: `inbox/` y `transcripts/` nunca en Git salvo que `discovery.keepRawInGit` sea `true`; las notas pasan por la misma ocultación de correos, teléfonos y claves que el journal; antes de grabar, se avisa a los participantes.
  - **Hecho cuando:** la sección existe y la plantilla de `.gitignore` incluye las dos carpetas.

- [ ] **7.1.2 · IDs de fuente y citas** · ⏱️ 20 min
  - **Qué:** el formato de los IDs y de las citas.
  - **Por qué:** es lo que conecta cualquier línea de cualquier documento con su origen.
  - **Cómo:**
    - Fuentes: `SRC-001`, `SRC-002`…, en orden de registro.
    - Tipos: `meeting`, `document`, `notes`, `conversation` (tus respuestas en `/discovery`), `review` (lo que sale de revisar un hito).
    - Citas: `[SRC-003 @ 12:40]` en grabaciones, `[SRC-005 p. 4]` en documentos, `[SRC-007]` en notas y conversaciones.
  - **Hecho cuando:** el formato está en el contrato con un ejemplo de cada cita.

- [ ] **7.1.3 · Formato de las notas de una fuente** · ⏱️ 25 min
  - **Qué:** los títulos exactos de `notes/SRC-n.md`.
  - **Por qué:** todas las fuentes se resumen igual, así `/discovery` puede cruzarlas y encontrar contradicciones.
  - **Cómo:**
    ```markdown
    # SRC-001 · Reunión de arranque
    - Type: meeting
    - Date: 2026-11-10 17:00 (Europe/Madrid)
    - Participants: Sebastián (desarrollo), Ana (cliente)

    ## Summary                 cinco líneas como máximo
    ## Requirements            - R1 Los albaranes llegan en PDF por correo [SRC-001 @ 12:40]
    ## Constraints             - Tiene que funcionar en el móvil del encargado [SRC-001 @ 20:15]
    ## Decisions               lo que ya quedó decidido en la reunión
    ## Dates and commitments   - "Lo necesito antes de marzo" [SRC-001 @ 31:05]
    ## Open questions          lo que nadie supo responder
    ## Glossary                - Albarán: documento de entrega del proveedor
    ```
    Regla: cada línea con contenido termina en una cita. Las secciones sin nada llevan `- None`.
  - **Hecho cuando:** el formato está en el contrato.

- [ ] **7.1.4 · Formato de los hitos en el roadmap** · ⏱️ 25 min
  - **Qué:** cómo se escribe un hito dentro de `roadmap.md`.
  - **Por qué:** un hito es un punto donde algo **real** se entrega o se demuestra. Es donde la factoría se para a que alguien lo valide.
  - **Cómo:** un hito es un título de nivel 3 entre las fases, y cubre todas las tareas que tiene encima hasta el hito anterior:
    ```markdown
    ### Fase 1.2 · Alta de albaranes
    - [ ] FEATURE-4 · Subir un albarán — formulario con el PDF
    - [ ] FEATURE-5 · Lista de albaranes — tabla con búsqueda

    ### 🏁 Hito H1 · El cliente registra su primer albarán real
    - Target: 2026-12-15                 ← o "- None" si no hay fecha
    - Validated by: cliente              ← cliente · tú · usuarios · tercero
    - Criterion: Ana sube un albarán de esta semana y lo encuentra en la lista
    - Source: [SRC-001 @ 31:05]
    - Status: pending                    ← lo escriben los scripts y /milestone-review
    ```
    Estados: `pending`, `reached` (todas sus tareas hechas, falta validarlo) y `signed off` (validado).
  - **Hecho cuando:** el formato está en el contrato.

- [ ] **7.1.5 · Formato de una petición de cambio** · ⏱️ 20 min
  - **Qué:** los títulos exactos de `changes/CR-n.md`.
  - **Por qué:** cambiar de idea a mitad de proyecto es normal. Lo peligroso es hacerlo sin ver qué rompe.
  - **Cómo:**
    ```markdown
    # CR-002 · Avisos por WhatsApp
    - Date: 2026-12-02 18:30 (Europe/Madrid)
    - Status: proposed                  ← proposed · accepted · rejected · deferred
    - Origin: [SRC-006 @ 05:12]

    ## Request          qué se pide, con las palabras de quien lo pide
    ## Impact           ### Brief · ### Decisions · ### Milestones · ### Roadmap · ### Architecture
    ## Assessment       ¿tiene sentido? razones a favor y en contra, y cuántos tickets cuesta
    ## Recommendation   accept · accept partially · defer · reject, con el motivo
    ## Resolution       lo que decidiste tú (la fecha la pone el script)
    ```
  - **Hecho cuando:** el formato está en el contrato.

- [ ] **7.1.6 · Configuración y cambios en el brief** · ⏱️ 30 min
  - **Qué:** la sección `discovery` de `harness.config.json` y dos secciones nuevas en el brief.
  - **Por qué:** cada proyecto transcribe de una forma, y el brief necesita su vocabulario y su historia.
  - **Cómo:**
    1. Configuración:
       ```json
       "discovery": {
         "enabled": true,
         "language": "es",
         "transcribeCommand": null,
         "keepRawInGit": false
       }
       ```
       `transcribeCommand` es `null` si solo usas transcripciones ya hechas, o el comando de la tarea 7.2.2.
    2. Brief: añade `## Glossary` (las palabras del negocio del cliente) y `## Changelog` (una línea por cambio, con fecha y `CR-n`).
    3. Regla nueva del brief: cada línea de `Goals`, `Non-goals` y `Constraints` cita al menos una fuente.
    4. Actualiza el lector de configuración, `validate-brief` (si aún no lo tienes, créalo ahora con las reglas del brief) y sus tests.
  - **Hecho cuando:** los tests pasan con los campos nuevos.

### ✅ Checkpoint 7.1
Pídele a Claude que revise las secciones nuevas del contrato buscando contradicciones con la Etapa 6. Corrige lo que encuentre.

---

## Fase 7.2 · Fuentes y transcripciones

- [ ] **7.2.1 · Elegir cómo transcribes** · ⏱️ 15 min
  - **Qué:** decidir tu camino por defecto (transcripción de la herramienta, Whisper local o contarlo tú).
  - **Por qué:** condiciona qué scripts necesitas de verdad.
  - **Cómo:** mira qué herramienta usas con tus clientes y si te da transcripción. Apunta la decisión con `/decision`.
  - **Hecho cuando:** la decisión está en `decisions.md` del harness.

- [ ] **7.2.2 · Transcribir en local con Whisper** (opcional) · ⏱️ 60 min
  - **Qué:** un script de Python en `tools/transcribe.py` que convierte un audio o vídeo en texto con marcas de tiempo, usando `faster-whisper`.
  - **Por qué:** para reuniones grabadas sin transcripción, o en persona con el móvil. Funciona sin internet y no envía el audio a nadie.
  - **Cómo:**
    1. Instala Python 3 y FFmpeg en Windows (FFmpeg extrae el audio de los vídeos).
    2. `pip install faster-whisper`.
    3. El script recibe la ruta del audio y escribe líneas `[mm:ss] texto`. Usa el modelo `small` para empezar: en tu procesador va bien; uno más grande es más preciso pero más lento.
    4. En la configuración: `"transcribeCommand": "python tools/transcribe.py"`.
  - **Hecho cuando:** un audio de 5 minutos grabado con el móvil sale como texto con marcas de tiempo.

- [ ] **7.2.3 · `normalize-transcript.mjs`** · ⏱️ 45 min
  - **Qué:** un script que convierte cualquier transcripción (`.vtt`, `.srt`, `.txt` de Meet, Teams, Zoom o Whisper) a un único formato: `[mm:ss] Persona: texto`.
  - **Por qué:** cada herramienta exporta distinto. Con un formato único, el resto de piezas solo tienen que entender uno.
  - **Cómo:** detecta el formato por la extensión y el contenido, junta las líneas cortas de la misma persona y conserva el minuto de inicio de cada intervención. Si no hay nombres, pone `Speaker`.
  - **Hecho cuando:** convierte un ejemplo de cada formato al mismo resultado.

- [ ] **7.2.4 · Registro de fuentes: `sources.mjs`** · ⏱️ 60 min
  - **Qué:** `node .claude/scripts/sources.mjs scan`, que mira `inbox/`, da un ID a cada fichero nuevo y lo apunta en `sources.md`.
  - **Por qué:** sin un registro, procesarías dos veces la misma grabación o perderías de dónde salió cada cosa.
  - **Cómo:**
    1. Calcula un resumen (hash) de cada fichero con `node:crypto`: si ya está registrado, lo salta.
    2. Asigna el siguiente `SRC-n` y apunta tipo, fecha (la del fichero, que la skill te confirmará) y estado `new`.
    3. Si es audio o vídeo y hay `transcribeCommand`, lo transcribe; si es una transcripción, la normaliza. El resultado va a `transcripts/SRC-n.txt`.
    4. Los PDF, Markdown y texto se quedan como están: Claude Code los lee directamente. Un `.docx`, mejor expórtalo a PDF.
    5. Subcomando `mark SRC-n processed` para cuando la skill termine.
  - **Hecho cuando:** dejar tres ficheros en `inbox/` y ejecutarlo dos veces registra tres fuentes, no seis.

- [ ] **7.2.5 · Trocear transcripciones largas: `chunk-transcript.mjs`** · ⏱️ 30 min
  - **Qué:** un script que parte una transcripción en bloques de unos 15–20 minutos, con un pequeño solape y sus marcas de tiempo.
  - **Por qué:** una reunión de una hora es mucho texto. Cada bloque lo lee el analista en un contexto limpio, y así no se le escapan detalles del final.
  - **Cómo:** corta siempre entre intervenciones, nunca a mitad de frase. Configurable con `--minutes`.
  - **Hecho cuando:** una transcripción de 60 minutos sale en 3 o 4 bloques con sus minutos correctos.

- [ ] **7.2.6 · `clean-transcript.mjs`** · ⏱️ 30 min
  - **Qué:** un limpiador que quita muletillas, repeticiones y frases cortadas de una transcripción, conservando las marcas de tiempo.
  - **Por qué:** una reunión hablada tiene mucho relleno ("eh", "bueno", "o sea", frases repetidas). Quitarlo antes de que la lea el analista abarata cada lectura sin perder contenido.
  - **Cómo:** una lista de muletillas configurable por idioma, juntar repeticiones seguidas de la misma frase y quitar intervenciones de una o dos palabras sin contenido ("vale", "sí, sí"). Guarda la versión limpia aparte: la original sigue siendo la que se cita.
  - **Hecho cuando:** sobre tu reunión de prueba, el texto se reduce de forma visible y los minutos siguen siendo correctos.

- [ ] **7.2.7 · Tests** · ⏱️ 45 min
  - **Qué:** tests de los tres scripts con fixtures en `fixtures/discovery/`.
  - **Por qué:** si las marcas de tiempo se desplazan, todas las citas apuntan al minuto equivocado.
  - **Cómo:** casos: cada formato de transcripción; fichero duplicado; ID consecutivo; bloques que no cortan intervenciones; minutos correctos tras trocear; la limpieza no cambia las marcas de tiempo.
  - **Hecho cuando:** `pnpm test` en verde con al menos 7 casos nuevos.

### ✅ Checkpoint 7.2
Deja en `inbox/` una transcripción real o de prueba y un PDF. Tras `sources.mjs scan` hay dos fuentes en `sources.md` y una transcripción normalizada en `transcripts/`.

---

## Fase 7.3 · El analista

- [ ] **7.3.1 · Agente `analyst`** · ⏱️ 45 min
  - **Qué:** `.claude/agents/analyst.md`, que lee un bloque de una fuente y devuelve las notas en el formato del contrato.
  - **Por qué:** leer una reunión y sacar requisitos, fechas y dudas es una tarea concreta. En un subagente no ensucia el contexto de la conversación contigo.
  - **Cómo:**
    1. Herramientas: solo `Read`. No escribe: devuelve el texto y la skill lo guarda.
    2. Inputs: el bloque, el ID de la fuente, sus participantes y el glosario que ya exista.
    3. Output: las 7 secciones de las notas, cada línea con su cita exacta.
    4. Hard limits: no inventa nada que no esté en el texto; si algo es ambiguo, va a `Open questions`; distingue lo que alguien **pidió** de lo que alguien **sugirió**.
    5. Añádelo a los dos perfiles de modelo (Sonnet en ambos va bien: es comprensión de texto, no razonamiento profundo) y comprueba que pasa el test de agentes.
  - **Hecho cuando:** pasa el test de agentes y `set-profile.mjs --check`.

- [ ] **7.3.2 · `validate-notes.mjs`** · ⏱️ 45 min
  - **Qué:** el validador de `notes/SRC-n.md`.
  - **Por qué:** una nota sin cita es una opinión del modelo. El validador no la deja pasar.
  - **Cómo:** títulos exactos y en orden; cabecera con tipo, fecha y participantes; cada línea con contenido termina en una cita; cada cita apunta a esta fuente y, si es una grabación, a un minuto que existe en su transcripción. Añade sus fixtures y tests.
  - **Hecho cuando:** una nota con una línea sin cita, o con un minuto que no existe, es rechazada.

- [ ] **7.3.3 · `notes-merge.mjs`** · ⏱️ 40 min
  - **Qué:** un script que junta las notas de los distintos bloques de una fuente en un solo `notes/SRC-n.md`.
  - **Por qué:** fusionar notas largas a mano es justo el tipo de trabajo mecánico que un modelo hace caro. El script junta sección a sección y quita duplicados.
  - **Cómo:** por cada sección, junta las líneas de todos los bloques en orden de minuto y quita las que son iguales una vez normalizadas (minúsculas, sin la cita). Si dos líneas casi iguales tienen citas distintas, conserva una con las dos citas. Añade sus tests.
  - **Hecho cuando:** tres bloques con algún requisito repetido dan unas notas sin repeticiones y con todas las citas.

- [ ] **7.3.4 · Skill `/discovery-ingest`** · ⏱️ 60 min
  - **Qué:** `.claude/skills/discovery-ingest/SKILL.md`, que procesa todo lo nuevo de `inbox/`.
  - **Por qué:** un solo comando para "he tenido una reunión, aquí está".
  - **Cómo:**
    1. Ejecuta `sources.mjs scan` y te confirma fecha, tipo y participantes de cada fuente nueva.
    2. Por cada transcripción: la limpia con `clean-transcript.mjs`, la trocea, llama al `analyst` con cada bloque y junta los resultados con `notes-merge.mjs`.
    3. Por cada documento: llama al `analyst` con el documento.
    4. Escribe `notes/SRC-n.md` y pasa `validate-notes.mjs` hasta que esté en verde.
    5. Añade a `open-questions.md` las dudas nuevas, y marca como respondidas las que esta fuente resuelve.
    6. Marca la fuente como `processed`.
    7. Te resume en 5 líneas qué hay de nuevo y dice el siguiente paso: `/discovery`.
  - **Hecho cuando:** pasa el test de skills (añádela con `disable-model-invocation: true`).

- [ ] **7.3.5 · Probarlo con una reunión simulada** · ⏱️ 30 min
  - **Qué:** grabarte 10 minutos explicando un proyecto inventado (o con un amigo haciendo de cliente) y procesarlo.
  - **Por qué:** con un material que conoces, ves enseguida si el analista se inventa cosas o se deja detalles.
  - **Cómo:** transcríbelo por tu camino elegido, déjalo en `inbox/` y lanza `/discovery-ingest`.
  - **Hecho cuando:** las notas recogen lo que dijiste, cada cita lleva al minuto correcto y no hay nada inventado.

### ✅ Checkpoint 7.3
Abre cinco citas al azar de las notas y comprueba en la transcripción que el minuto y el contenido coinciden.

---

## Fase 7.4 · Definir el producto: `/discovery`

La skill más larga del harness, y la más conversacional. Puede durar varias sesiones, así que guarda su avance.

- [ ] **7.4.1 · Estructura y sesión reanudable** · ⏱️ 45 min
  - **Qué:** el esqueleto de `.claude/skills/discovery/SKILL.md` y el fichero `discovery/session.md`.
  - **Por qué:** definir un producto no se hace de una sentada. Si se corta (o se acaba tu cupo), al volver debe seguir por donde iba.
  - **Cómo:**
    1. Dos modos: **definir** (todavía no hay brief aprobado) y **actualizar** (ya lo hay; Fase 7.6). Lo detecta sola, o se lo dices con `/discovery update`.
    2. `session.md` guarda: ronda actual, preguntas hechas y pendientes, y lo aprobado hasta ahora. Se actualiza al final de cada ronda.
    3. Al arrancar, si hay sesión a medias, te resume dónde estabais y sigue.
  - **Hecho cuando:** el esqueleto existe con los dos modos y el formato de `session.md` está en el contrato.

- [ ] **7.4.2 · Las rondas de producto y Gate P** · ⏱️ 45 min
  - **Qué:** las tres primeras rondas de la conversación.
  - **Por qué:** primero el problema, luego el alcance, luego las limitaciones. En ese orden, porque cada una depende de la anterior.
  - **Cómo:** en cada ronda, la skill: lee las notas, te cuenta lo que entendió **citando las fuentes**, te señala contradicciones entre fuentes ("en SRC-001 dijo X y en SRC-003 dijo Y"), y te pregunta de una en una, con una respuesta recomendada.
    1. **Ronda 1 · Problema y usuarios.**
    2. **Ronda 2 · Alcance:** imprescindible, deseable, y lo que **no** se hará.
    3. **Ronda 3 · Limitaciones:** plazos, presupuesto, normativa (por ejemplo, protección de datos) y tecnología.
    4. **Gate P (producto):** te enseña el `brief.md` completo y espera tu aprobación. Al aprobar, apunta la decisión con `decision-append.mjs`.
  - **Hecho cuando:** las tres rondas y Gate P están en la skill.

- [ ] **7.4.3 · Tus respuestas también son una fuente** · ⏱️ 20 min
  - **Qué:** que lo que respondes en `/discovery` se guarde como fuente `conversation`.
  - **Por qué:** muchas decisiones salen de ti, no de la reunión. Si no se registran, el brief tendría líneas sin origen.
  - **Cómo:** al final de cada ronda, la skill escribe tus respuestas en `notes/SRC-n.md` (tipo `conversation`) con `sources.mjs` y las cita en el brief como `[SRC-n]`.
  - **Hecho cuando:** tras una ronda aparece la fuente nueva y el brief la cita.

- [ ] **7.4.4 · Ronda de arquitectura y tecnología** · ⏱️ 45 min
  - **Qué:** la ronda 5, que decide cómo se construirá (la 4 son los hitos, Fase 7.5).
  - **Por qué:** con el producto claro, toca decidir el stack, las capas y las piezas principales. Son decisiones caras de cambiar después.
  - **Cómo:**
    1. **Proyecto nuevo:** propone stack y capas con al menos dos alternativas, y cada elección que apruebes se apunta como decisión. Después deja escrita la propuesta de `layers` y `commands` para `harness.config.json`.
    2. **Proyecto con código:** pide al `explorer` un inventario y propone la arquitectura que ya existe, más los cambios necesarios.
    3. Escribe la primera versión de `architecture.md` y pasa su validador.
  - **Hecho cuando:** la ronda está en la skill.

- [ ] **7.4.5 · Ronda de roadmap y Gate R** · ⏱️ 30 min
  - **Qué:** la ronda 6, que convierte todo lo anterior en `roadmap.md`.
  - **Por qué:** es el puente entre "qué queremos" y "qué tickets hace la factoría".
  - **Cómo:** reutiliza las reglas de `/project-roadmap`: etapas que acaban en hitos, fases con tareas del tamaño de un ticket, tareas `MANUAL` para lo que solo puede hacer una persona, y **cada fase con su estimación en horas, sus dependencias y su recurso** (la línea `> ⏱️`). Busca a propósito qué fases son **independientes**, para que la factoría pueda hacerlas en paralelo. Lo revisáis juntos en Gate R mirando el cronograma que calcula `schedule.mjs`: fecha de fin prevista, ruta crítica y carga de cada semana. Al aprobar, se guarda la línea base. Cada tarea cita el requisito del brief del que sale. Gate R, validador y `sync-roadmap.mjs` como en la Etapa 6.
  - **Hecho cuando:** la ronda está en la skill.

- [ ] **7.4.6 · ¿Está listo para construir? `validate-readiness.mjs`** · ⏱️ 60 min
  - **Qué:** un script que dice `READY` o `NOT READY`, con los motivos.
  - **Por qué:** es la "Definition of Ready" del proyecto. La factoría no arranca sobre un proyecto a medio definir.
  - **Cómo:** comprueba que el brief está aprobado y pasa su validador; que no queda ninguna pregunta marcada como `blocking` en `open-questions.md`; que hay al menos un hito; que el roadmap y la arquitectura pasan sus validadores; y que `harness.config.json` tiene capas y comandos. Añade sus tests.
    **La primera vez** que dice `READY` y Notion está activado, lanza `notion-sync.mjs --init` (Fase 6.9): es el momento en que el proyecto aparece en tu panel de Notion, ya definido y con sus estimaciones. Las siguientes veces no hace nada, porque `specs/notion-map.json` ya existe.
  - **Hecho cuando:** sobre un proyecto a medias dice `NOT READY` y explica qué falta; sobre uno completo dice `READY` y el proyecto aparece en el panel.

### ✅ Checkpoint 7.4
Con las notas de tu reunión simulada, lanza `/discovery` y llega al menos hasta Gate P. Corta la sesión a mitad de la ronda 2 y vuelve a lanzarla: debe seguir por donde iba.

---

## Fase 7.5 · Hitos reales

- [ ] **7.5.1 · Qué es un hito real** · ⏱️ 30 min
  - **Qué:** una referencia en `harness-help/references/milestones.md` con los criterios y ejemplos.
  - **Por qué:** es fácil confundir un hito con "terminar una parte". Un hito real se puede demostrar a alguien que no programa.
  - **Cómo:** escribe estos criterios. Un hito real:
    - Lo puede comprobar alguien de fuera del equipo, mirando el producto.
    - Entrega valor a alguien o elimina un riesgo de verdad.
    - Tiene una persona que lo valida.
    - Encaja con algo que pasa fuera del código: una fecha del cliente, un pago, una presentación, una salida a producción.

    | ❌ No es un hito real | ✅ Sí lo es |
    |---|---|
    | "Backend terminado" | "El encargado registra un parte de trabajo desde el móvil" |
    | "Base de datos diseñada" | "El cliente ve sus albaranes de la última semana" |
    | "Etapa 2 completada" | "Primera factura conciliada automáticamente y revisada por el cliente" |
  - **Hecho cuando:** la referencia existe y está en el índice de `harness-help`.

- [ ] **7.5.2 · Ronda de hitos y Gate H** · ⏱️ 30 min
  - **Qué:** la ronda 4 de `/discovery`, que **detecta** los hitos.
  - **Por qué:** los hitos marcan el ritmo del proyecto, las demos y a menudo los pagos. Tienen que salir de lo que se dijo, no inventarse.
  - **Cómo:** la skill busca en las notas, citando cada hallazgo:
    1. Fechas y compromisos (`Dates and commitments`).
    2. El primer momento en que alguien puede usar el producto de punta a punta, aunque sea muy básico.
    3. Momentos en que alguien de fuera valida algo: una demo, una prueba con usuarios, un pago.
    4. Pasos que no tienen vuelta atrás: salir a producción, migrar datos reales, publicar.
    5. Dependencias de terceros: claves de una API, un contrato, un proveedor.

    Te propone los hitos con sus criterios y te pregunta si faltan o sobran. **Gate H:** apruebas la lista y se apunta como decisión.
  - **Hecho cuando:** la ronda está en la skill y cada hito propuesto pasa los criterios de 7.5.1.

- [ ] **7.5.3 · Hitos en el lector y el validador del roadmap** · ⏱️ 60 min
  - **Qué:** ampliar `lib/roadmap.mjs` y `validate-roadmap.mjs` para entender los hitos.
  - **Por qué:** los scripts tienen que saber qué tareas cubre cada hito para poder pararse en él.
  - **Cómo:** el lector asigna cada tarea al siguiente hito que tenga debajo. El validador comprueba: IDs de hito únicos (`H1`, `H2`…); los 5 campos; fechas objetivo en orden; ninguna tarea depende de otra que está detrás de un hito posterior; y avisa (sin fallar) si una etapa no tiene ningún hito: "¿para qué existe esta etapa?".
  - **Hecho cuando:** los tests nuevos pasan.

- [ ] **7.5.4 · Hitos en el sync y en `next-ticket`** · ⏱️ 30 min
  - **Qué:** que los scripts muevan el estado del hito y lo respeten.
  - **Por qué:** es lo que hace que la factoría se pare donde tiene sentido enseñar algo.
  - **Cómo:** `sync-roadmap.mjs` pone `Status: reached` cuando todas las tareas del hito están hechas. `next-ticket.mjs` no da tareas de detrás de un hito `reached` hasta que esté `signed off` (si `execution.stopAtMilestones` es `true`; lo configuras en la Etapa 9).
  - **Hecho cuando:** con un hito `reached`, `next-ticket` dice "esperando a la revisión de H1".

- [ ] **7.5.5 · Skill `/milestone-review`** · ⏱️ 30 min
  - **Qué:** `/milestone-review H1`, para validar un hito.
  - **Por qué:** cierra el hito con una prueba de verdad, no con un "parece que va".
  - **Cómo:** te enseña las tareas que cubre, prepara una lista de comprobación a partir del `Criterion` (qué enseñar en la demo), y te pregunta el resultado. Si se valida: `Status: signed off` y una decisión. Si no: lo que te dijeron se guarda como fuente `review`, y te propone lanzar `/discovery update`.
  - **Hecho cuando:** la skill existe y pasa el test de skills.

- [ ] **7.5.6 · Tests** · ⏱️ 30 min
  - **Qué:** fixtures de roadmaps con hitos.
  - **Por qué:** si el hito no para la factoría, la factoría seguirá construyendo sobre algo que nadie ha validado.
  - **Cómo:** casos: tarea asignada al hito correcto; hito `reached` bloquea las siguientes; `signed off` las libera; fechas desordenadas; etapa sin hito da aviso.
  - **Hecho cuando:** los 5 tests pasan.

### ✅ Checkpoint 7.5
Termina en el sandbox las tareas de un hito: `sync-roadmap.mjs` lo marca `reached`, `next-ticket.mjs` se para, y tras `/milestone-review` vuelve a dar tareas.

---

## Fase 7.6 · Cambios a mitad de proyecto

- [ ] **7.6.1 · `validate-change.mjs`** · ⏱️ 40 min
  - **Qué:** el validador de `changes/CR-n.md`.
  - **Por qué:** una petición de cambio sin análisis de impacto es un "ya que estás" peligroso.
  - **Cómo:** títulos exactos; `Origin` con una cita válida; las 5 subsecciones de `Impact` (cada una con contenido o `- None`); `Recommendation` con uno de los 4 valores y su motivo; si el estado no es `proposed`, `Resolution` rellena. Añade fixtures y tests.
  - **Hecho cuando:** sus tests pasan.

- [ ] **7.6.2 · `/discovery update`: detectar qué cambia** · ⏱️ 45 min
  - **Qué:** el modo actualizar de `/discovery`.
  - **Por qué:** tras una reunión nueva, quieres saber qué ha cambiado respecto a lo que ya estaba definido.
  - **Cómo:** compara las notas nuevas con el brief, las decisiones vigentes, los hitos y el roadmap, y clasifica cada novedad: requisito nuevo, requisito cambiado, contradicción con una decisión, cambio de fecha o simple aclaración. Las aclaraciones solo actualizan el glosario o el brief; el resto genera un `CR`.
  - **Hecho cuando:** el modo está en la skill.

- [ ] **7.6.3 · ¿Tiene sentido el cambio?** · ⏱️ 20 min
  - **Qué:** la evaluación que escribe la sección `Assessment`.
  - **Por qué:** no todo cambio que se pide conviene hacerlo, o no ahora. La skill te da argumentos; decides tú.
  - **Cómo:** que responda siempre a estas preguntas: ¿encaja con los objetivos y los "no haremos" del brief? ¿contradice una decisión vigente (y entonces habría que sustituirla)? ¿obliga a rehacer trabajo ya hecho? ¿mueve algún hito o su fecha? ¿cuántos tickets cuesta? Con eso, recomienda aceptar, aceptar en parte, aplazar o rechazar.
  - **Hecho cuando:** está en la skill y un CR de prueba responde a las 5 preguntas.

- [ ] **7.6.4 · Gate CR y aplicar el cambio** · ⏱️ 40 min
  - **Qué:** tu decisión y lo que pasa después.
  - **Por qué:** un cambio aceptado tiene que llegar a todos los documentos a la vez, o se contradirán.
  - **Cómo:** **Gate CR:** te enseña el CR y esperas tú. Si lo aceptas:
    1. Brief: cambia lo necesario y añade una línea al `Changelog` con el `CR-n`.
    2. Decisiones: las nuevas con `decision-append.mjs`, usando `--supersedes` donde toque.
    3. Roadmap: con las reglas de `/project-roadmap`, añade tareas, cambia las pendientes y crea tickets de **rehacer** para lo ya hecho que cambie. Nunca edita tareas hechas.
    4. Hitos y arquitectura, si les afecta.
    5. Escribe la `Resolution` y pasa todos los validadores.
    6. Si el roadmap cambió, lanza `notion-sync.mjs --structure` para que el panel muestre las fases nuevas y las estimaciones corregidas.
  - **Hecho cuando:** un CR aceptado deja los cuatro documentos coherentes y los validadores en verde.

- [ ] **7.6.5 · Congelar lo que está en revisión** · ⏱️ 30 min
  - **Qué:** mientras un CR esté `proposed`, las tareas que toca llevan ` · ⚠️ CR-n` y `next-ticket` se las salta.
  - **Por qué:** que la factoría no construya algo que a lo mejor cambia mañana.
  - **Cómo:** al escribir el CR, la skill marca las tareas de su `Impact › Roadmap`. Al resolverlo, se quita la marca. Añade el sufijo al contrato, al lector del roadmap y sus tests.
  - **Hecho cuando:** con un CR abierto, `next-ticket` salta sus tareas y explica por qué.

### ✅ Checkpoint 7.6
Un CR inventado sigue el camino completo: `proposed` (tareas congeladas) → `accepted` (documentos actualizados y coherentes) → la factoría vuelve a dar sus tareas.

---

## Fase 7.7 · Prueba completa

- [ ] **7.7.1 · Una reunión de arranque simulada** · ⏱️ 30 min
  - **Qué:** grabar 20–30 minutos con alguien que haga de cliente de un proyecto inventado, con fechas, alguna contradicción y alguna duda sin resolver.
  - **Por qué:** es lo más parecido a un cliente real sin arriesgar uno.
  - **Cómo:** pídele que diga al menos una fecha, que cambie de opinión una vez durante la reunión y que no sepa responder algo.
  - **Hecho cuando:** tienes la grabación y su transcripción.

- [ ] **7.7.2 · Del material a `READY`** · ⏱️ 90 min
  - **Qué:** `/discovery-ingest` y `/discovery` completos sobre esa reunión.
  - **Por qué:** comprobar el circuito entero: material → notas → brief → hitos → arquitectura → roadmap → listo.
  - **Cómo:** usa un proyecto vacío nuevo (no el sandbox). Apunta `/usage` al empezar y al terminar.
  - **Hecho cuando:** `validate-readiness.mjs` dice `READY`, la contradicción de la reunión salió en la conversación y la duda está en `open-questions.md`.

- [ ] **7.7.3 · Una segunda reunión con un cambio** · ⏱️ 40 min
  - **Qué:** otra grabación corta donde el "cliente" pide algo nuevo que choca con lo decidido.
  - **Por qué:** comprobar que un cambio a mitad de proyecto se gestiona con orden.
  - **Cómo:** `/discovery-ingest` y `/discovery update`.
  - **Hecho cuando:** sale un `CR` con su impacto y su evaluación, lo resuelves y los documentos quedan coherentes.

### ✅ Checkpoint 7.7
Lee el brief de tu proyecto simulado como si fueras el cliente: ¿reconoces lo que pediste? Elige tres requisitos y sigue sus citas hasta el minuto de la grabación.

---

## 🏁 Hito Etapa 7

- Commit `etapa-7: descubrimiento, hitos reales y cambios` y etiqueta `etapa-7`.
- `CHANGELOG.md`: cuánto tiempo y cupo costó llevar la reunión simulada hasta `READY`.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| El analista se inventa requisitos | Por eso cada línea lleva cita y `validate-notes` comprueba el minuto. Si se cuela algo, endurece sus Hard limits |
| La transcripción confunde a las personas | Las herramientas de reunión suelen acertar con los nombres; Whisper no los sabe. Corrige los nombres a mano en `transcripts/` antes de analizar |
| `/discovery` se hace eterno | Es normal que dure varias sesiones. Si una ronda pasa de 30 minutos, que la skill aparque las dudas en `open-questions.md` y siga |
| Subir una grabación de un cliente a GitHub | Comprueba que `.gitignore` tiene `discovery/inbox/` y `discovery/transcripts/` **antes** de la primera fuente real |
| Demasiados CR por cambios pequeños | Las aclaraciones no generan CR (7.6.2). Si aun así hay muchos, el brief inicial estaba poco cerrado: anótalo para la retro |
