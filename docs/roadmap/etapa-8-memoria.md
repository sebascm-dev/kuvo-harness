# 🧠 Etapa 8 · Memoria y aprendizaje

**Objetivo:** que cada error deje rastro y que los errores que se repiten se conviertan en reglas que el siguiente ticket ya conoce.

**Al acabar tendrás:** el hook que obliga a cada agente a reportar, el agregador de lecciones, la skill `/spec-retro` y el circuito cerrado: lo que falla en un ticket vuelve a `/spec-plan` en el siguiente.

**Requisitos previos:** Etapas 5 y 6 (las fases ya escriben en el journal y los documentos están vivos) y al menos 2 tickets del sandbox terminados.
**Tiempo:** 8–10 h.

> 💡 **De la charla:** el journal es "memoria de fricción por ticket". Registra lo que falló, se desvió o decidió el usuario, **no lo que salió verde a la primera**. A corto plazo sirve para reanudar; a largo plazo, para la retro.

---

## Fase 8.1 · El hook que captura el journal

- [ ] **8.1.1 · Entender el evento `SubagentStop`** · ⏱️ 20 min
  - **Qué:** qué recibe un hook cuando termina un subagente.
  - **Por qué:** hasta ahora los agentes escriben su bloque `JOURNAL`, pero nadie lo lee. Este hook lo lee y lo guarda.
  - **Cómo:** lee el apartado de `SubagentStop` de su chuleta. Los campos clave:
    - `agent_type`: el nombre del agente (por ejemplo `developer`).
    - `last_assistant_message`: el texto final del agente.
    - `stop_hook_active`: `true` si el hook ya lo bloqueó una vez en este turno.
    - Para obligar al agente a seguir, el hook imprime `{"decision":"block","reason":"..."}`: el motivo se convierte en su siguiente instrucción.
  - **Hecho cuando:** sabes qué pasa si el hook bloquea dos veces seguidas.
  - **Referencia:** `docs/claude-code-reference.md`

- [ ] **8.1.2 · Leer el bloque `JOURNAL`** · ⏱️ 45 min
  - **Qué:** `.claude/hooks/lib/parse-journal-block.mjs`, que extrae las entradas del texto final de un agente.
  - **Por qué:** separarlo del hook permite probarlo con muchos textos distintos sin lanzar Claude Code.
  - **Cómo:** devuelve `{ status: 'none' }`, `{ status: 'entries', entries: [...] }` o `{ status: 'missing' }`. Cada entrada con `kind`, `summary` y `files` opcional. Normaliza `\r\n`.
  - **Hecho cuando:** sus tests pasan con: `JOURNAL: none`, un bloque con 2 entradas, un bloque sin `END JOURNAL`, texto sin bloque y un bloque con un `kind` inválido.

- [ ] **8.1.3 · El hook `journal-capture.mjs`** · ⏱️ 45 min
  - **Qué:** `.claude/hooks/journal-capture.mjs`.
  - **Por qué:** cierra la puerta a que un agente termine sin decir qué le ha pasado.
  - **Cómo:**
    1. Lee la entrada estándar.
    2. Saca el ticket del texto buscando `specs/<ID>/` y comprobando el ID con `ticketPattern`.
    3. Si el bloque es `none`: sale con 0.
    4. Si hay entradas: las añade con la función de `journal-append`, con `actor` igual a `agent_type`, y sale con 0.
    5. Si falta el bloque y `stop_hook_active` es `false`: imprime `{"decision":"block","reason":"Tu informe debe terminar con un bloque JOURNAL (ver docs/contracts.md)"}`.
    6. Si falta y `stop_hook_active` es `true`: deja terminar (sale con 0) y avisa por la salida de error. Así nunca hay un bucle infinito.
  - **Hecho cuando:** sus tests pasan (siguiente tarea).
  - **Referencia:** `.claude/hooks/journal-capture.mjs`

- [ ] **8.1.4 · Tests del hook** · ⏱️ 30 min
  - **Qué:** `.claude/hooks/journal-capture.test.mjs` en una carpeta temporal.
  - **Por qué:** si el hook falla, la memoria del sistema se queda vacía sin avisar.
  - **Cómo:** casos: `none` no escribe nada; 2 entradas dejan 2 líneas con el `actor` correcto; falta el bloque → imprime el JSON de bloqueo; falta el bloque con `stop_hook_active` → sale con 0; sin ticket en el texto → avisa y sale con 0.
  - **Hecho cuando:** los 5 tests pasan.

- [ ] **8.1.5 · Registrarlo** · ⏱️ 10 min
  - **Qué:** la entrada `SubagentStop` en `.claude/settings.json`.
  - **Por qué:** sin registro, no se ejecuta.
  - **Cómo:**
    ```json
    "SubagentStop": [{
      "matcher": "explorer|plan-auditor|developer|reviewer|design-qa|analyst",
      "hooks": [{ "type": "command",
        "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/journal-capture.mjs\"" }]
    }]
    ```
  - **Hecho cuando:** `/hooks` muestra el hook en `SubagentStop`.

### ✅ Checkpoint 8.1
Pide al explorer una búsqueda sobre un ticket del sandbox y, a propósito, dile que no ponga el bloque `JOURNAL`. El hook debe obligarle a añadirlo.

---

## Fase 8.2 · Que cada fase apunte lo que toca

- [ ] **8.2.1 · Repasar qué apunta cada fase** · ⏱️ 30 min
  - **Qué:** comprobar que las 4 skills apuntan exactamente lo que dice la charla.
  - **Por qué:** si apuntas de más, las lecciones son ruido; si apuntas de menos, el sistema no aprende.
  - **Cómo:** compara cada skill con esta tabla y corrige:

    | Fase | Qué apunta |
    |---|---|
    | clarify | Nada |
    | plan | Hallazgos del auditor, tus decisiones (Gate A, B, M) |
    | implement | Bloqueos, desvíos del plan, arreglos fallidos, hallazgos del reviewer |
    | validate | Checks en rojo, contratos rotos, design QA, tus decisiones sobre supresiones |
  - **Hecho cuando:** las 4 skills coinciden con la tabla.
  - **Referencia:** `.claude/skills/spec-help/references/journal.md`

- [ ] **8.2.2 · Asignar capa a cada entrada** · ⏱️ 20 min
  - **Qué:** una función `layerOf(rutas)` en `lib/` que dice a qué capa pertenece una entrada según sus `files`.
  - **Por qué:** las lecciones se agrupan por capa. Sin capa, una lección de `ui` acabaría cargándose al planificar `core`.
  - **Cómo:** compara cada ruta con los `path` de las capas de la configuración. Sin rutas o de varias capas → `general`.
  - **Hecho cuando:** sus tests pasan.

### ✅ Checkpoint 8.2
Abre el `journal.jsonl` de `FEATURE-1`: cada línea es algo que falló, se desvió o decidiste tú. No hay líneas de "todo bien".

---

## Fase 8.3 · Lecciones

- [ ] **8.3.1 · `lessons-aggregate.mjs`: agrupar** · ⏱️ 60 min
  - **Qué:** el script que lee todos los `specs/*/journal.jsonl` y escribe `specs/lessons.json`.
  - **Por qué:** una entrada aislada es una anécdota; la misma entrada en dos tickets es un patrón.
  - **Cómo:**
    1. Lee todas las líneas de todos los journals.
    2. Quédate solo con los tipos de fricción: `autofix_failed`, `reviewer_finding`, `auditor_finding`, `validator_red`, `blocked`, `deviation`, `suppression`. Nunca `decision` ni `user_decision`: si no, frases fijas como "Gate A aprobado" se convertirían en lecciones.
    3. Normaliza el `summary` (minúsculas, sin rutas ni números) para agrupar frases parecidas.
    4. Agrupa por capa y resumen normalizado.
  - **Hecho cuando:** con dos journals de prueba agrupa bien.
  - **Referencia:** `.claude/scripts/lessons-aggregate.mjs`

- [ ] **8.3.2 · `lessons-aggregate.mjs`: estados** · ⏱️ 30 min
  - **Qué:** mantener los estados de las lecciones.
  - **Por qué:** una lección no se borra nunca; solo sube de estado.
  - **Cómo:**
    - `candidate`: vista en 1 ticket.
    - `confirmed`: vista en 2 o más.
    - `applied`: la pones tú a mano cuando cambias el harness por ella.
    - Conserva los `id` y estados que ya existían. Nunca baja un estado ni borra una lección.
  - **Hecho cuando:** ejecutarlo dos veces seguidas deja el fichero igual.

- [ ] **8.3.3 · Tests del agregador** · ⏱️ 30 min
  - **Qué:** tests con journals de prueba.
  - **Por qué:** si el agregador promociona mal, `/spec-plan` cargará lecciones equivocadas en todos los tickets.
  - **Cómo:** casos: una entrada → `candidate`; la misma en dos tickets → `confirmed`; una `decision` no genera lección; una lección `applied` sigue `applied`; los `id` se conservan.
  - **Hecho cuando:** los 5 tests pasan.

### ✅ Checkpoint 8.3
Ejecuta el agregador sobre los journals reales del sandbox y lee `lessons.json`. ¿Las lecciones tienen sentido?

---

## Fase 8.4 · La retro

- [ ] **8.4.1 · Skill `/spec-retro`** · ⏱️ 45 min
  - **Qué:** `.claude/skills/spec-retro/SKILL.md`.
  - **Por qué:** el agregador agrupa; la retro reflexiona. Primero el script, después el modelo, siempre con pruebas.
  - **Cómo:**
    1. Ejecuta `lessons-aggregate.mjs`.
    2. Lee los journals y `lessons.json`.
    3. Escribe `specs/retro.md`: una reflexión corta donde **cada afirmación cita su línea** como `FEATURE-1#3` (ticket y número de línea).
    4. Termina con una lista de cambios propuestos: al harness, al roadmap (tareas que añadir o reordenar) o decisiones nuevas. Los del roadmap los aplicas con `/project-roadmap` y las decisiones con `/decision`.
    5. **Nunca edita el harness.** Los cambios los aplicas tú.
  - **Hecho cuando:** la skill existe.
  - **Referencia:** `.claude/skills/spec-retro/SKILL.md`

- [ ] **8.4.2 · Ritmo de la retro** · ⏱️ 10 min
  - **Qué:** decidir cada cuánto la harás.
  - **Por qué:** sin ritmo fijo, no la harás nunca.
  - **Cómo:** como en la charla: cada ~5 tickets o una vez al mes. Ponlo como evento recurrente en tu Google Calendar.
  - **Hecho cuando:** el evento existe.

- [ ] **8.4.3 · Resumen a tu vault de Obsidian** (opcional) · ⏱️ 20 min
  - **Qué:** que la retro también deje un resumen en tu vault.
  - **Por qué:** así lo aprendido no se queda solo en un proyecto. Lo verás junto al resto de tu conocimiento.
  - **Cómo:** añade a la skill un paso final que escriba un resumen de 10 líneas en la carpeta del vault que elijas (configurable en `harness.config.json`).
  - **Hecho cuando:** tras una retro aparece la nota en el vault.

### ✅ Checkpoint 8.4
Ejecuta `/spec-retro`. Comprueba tres afirmaciones al azar de `retro.md`: la línea citada existe y dice lo que la retro dice que dice.

---

## Fase 8.5 · Cerrar el circuito

- [ ] **8.5.1 · Dos tickets más para generar memoria** · ⏱️ 90 min
  - **Qué:** escribir y ejecutar dos tickets nuevos del sandbox que se parezcan a los anteriores.
  - **Por qué:** para que una lección pase a `confirmed` necesita aparecer en dos tickets.
  - **Cómo:** por ejemplo, `FEATURE-3` · **Mediana de una lista** (muy parecido a la media) y `FIX-2` · otro fallo en la misma capa que `FIX-1`. Ejecuta las 4 fases de cada uno.
  - **Hecho cuando:** los dos terminan en `GREEN` y tienen journal.

- [ ] **8.5.2 · Comprobar que `/spec-plan` usa las lecciones** · ⏱️ 30 min
  - **Qué:** ver una lección confirmada influyendo en un plan.
  - **Por qué:** es la prueba de que el circuito está cerrado.
  - **Cómo:** ejecuta el agregador, comprueba que hay al menos una `confirmed` y lanza `/spec-plan` sobre un ticket nuevo de esa capa. Busca la lección en el contexto que cargó o en el plan.
  - **Hecho cuando:** la lección aparece y el plan la tiene en cuenta. Si no hay ninguna `confirmed` real, crea una de prueba a mano para verificar el mecanismo y bórrala después.

- [ ] **8.5.3 · Aplicar tu primera lección** · ⏱️ 30 min
  - **Qué:** cambiar el harness por una lección y marcarla `applied`.
  - **Por qué:** es el final del circuito: la factoría mejora sola, con tu visto bueno.
  - **Cómo:** elige la propuesta más útil de `retro.md`, aplícala a la skill, al agente o al `CLAUDE.md` de la capa, marca la lección como `applied` y apúntalo en el `CHANGELOG.md`.
  - **Hecho cuando:** la lección está `applied` y el cambio tiene su commit.

### ✅ Checkpoint 8.5
Tienes al menos una lección `applied`, con su commit, que salió de errores reales de tus tickets.

---

## 🏁 Hito Etapa 8

- Commit `etapa-8: journal, lecciones y retro` y etiqueta `etapa-8`.
- `CHANGELOG.md`: cuántas lecciones hay de cada estado y cuál aplicaste.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| El hook bloquea en bucle | Revisa que respetas `stop_hook_active`. Claude Code anula el bloqueo tras 8 seguidos, pero no deberías llegar ahí |
| Las lecciones son frases casi iguales que no se agrupan | Mejora la normalización del `summary`. No metas un modelo aquí: tiene que ser determinista |
| El journal se llena de ruido | Revisa la tabla de 8.2.1. Lo que salió bien a la primera no se apunta nunca |
| La retro "se inventa" cosas | Por eso cada afirmación cita su línea. Si una cita no existe, endurece la skill |
