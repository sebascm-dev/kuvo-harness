# 🚀 Etapa 11 · Producción (opcional)

**Objetivo:** la capa que tienen en su empresa y que su repo no trae: un ticket etiquetado en tu gestor de tareas acaba en una PR revisable sin nadie al teclado, y lo que se mergea sale a producción poco a poco.

**Al acabar tendrás:** una bandeja de ideas en Notion, un trabajador que los recoge y abre PRs, un vigilante de PRs, el triaje por niveles de revisión y la release progresiva con feature flags.

**Requisitos previos:** Etapa 10 (v1.0) y el harness funcionando en el banco de pruebas durante varias semanas.
**Tiempo:** 10–20 h.

> ⚠️ **Hazla solo cuando la necesites.** Tiene sentido cuando tengas varios tickets por semana en un mismo proyecto. Con uno o dos, es matar moscas a cañonazos. De la charla: "La persona solo interviene en dos sitios: responde las preguntas de las tarjetas bloqueadas y revisa y mergea la PR."

---

## Fase 11.1 · Bandeja de ideas en Notion

> 📌 El panel de proyectos en Notion ya lo tienes desde la Fase 6.9, y solo muestra el avance. Aquí añades una entrada, sin romper la regla de que todo el trabajo vive en el repo: las ideas entran por `/discovery update`, nunca editando el panel.

- [ ] **11.1.1 · Bandeja de ideas** · ⏱️ 30 min
  - **Qué:** una cuarta base en el panel "🏭 Factoría", "Ideas", con una relación a `Proyectos`, donde apuntas lo que se te ocurra desde el móvil para cualquiera de tus proyectos.
  - **Por qué:** las ideas llegan en cualquier momento, pero no deben entrar en la factoría sin pasar por ti y por el formato del roadmap.
  - **Cómo:** `scripts/ideas-pull.mjs` (sin IA) baja a `discovery/inbox/` las ideas pendientes del proyecto en el que estás, y `/discovery update` las lee como fuentes nuevas: las aclaraciones van directas al brief, y lo que cambia el producto se convierte en un `CR` con su impacto. Lo que encaja sin cambiar nada pasa a tareas del roadmap con las reglas de `/project-roadmap`. Te propone qué hacer con cada idea (o descartarla), y tras tu aprobación en Gate R el script las marca como procesadas en Notion.
  - **Hecho cuando:** una idea apuntada en Notion acaba como tarea del roadmap, y su ticket sale con `sync-roadmap.mjs`.

### ✅ Checkpoint 11.1
Apuntas una idea en Notion desde el móvil, la procesas con `/discovery update` y, tras `sync-roadmap.mjs`, es una tarea del roadmap con su ticket. Si creó una fase nueva, aparece en el panel con su estimación.

---

## Fase 11.2 · El trabajador

- [ ] **11.2.1 · Trabajar en un clon limpio** · ⏱️ 45 min
  - **Qué:** que cada ticket se ejecute en un `git worktree` propio, con su rama.
  - **Por qué:** en su empresa, Claude Code headless trabaja en un clon limpio, en una sandbox y sin claves en el entorno. Así un ticket nunca pisa tu trabajo ni otro ticket.
  - **Cómo:** `git worktree add ../work-<ID> -b factory/<ID>`, lanzar `headless.mjs` dentro y borrar el worktree al terminar.
  - **Hecho cuando:** dos tickets pueden correr a la vez sin interferir.

- [ ] **11.2.2 · Publicar: commit, push y PR** · ⏱️ 45 min
  - **Qué:** `scripts/publish.mjs <ID>`, que hace commit, push y abre la PR con `gh`.
  - **Por qué:** el agente tiene prohibido hacer commit y push, y debe seguir así. Lo hace un **script** que tú has escrito y controlas, solo cuando `04-dod.md` está en `GREEN`.
  - **Cómo:** el título de la PR lleva el ID, el cuerpo resume `00` y `04`, y la PR lleva una etiqueta tipo `IA-auto`.
  - **Hecho cuando:** un ticket en `GREEN` acaba en una PR abierta en GitHub.

- [ ] **11.2.3 · Si el plan dice varias PRs, solo la primera** · ⏱️ 20 min
  - **Qué:** una regla en el modo automático.
  - **Por qué:** en su empresa, en automático solo se hace la PR 1 de un plan troceado. El resto espera a que revises la primera.
  - **Cómo:** añádela a la referencia `headless.md` y a `spec-plan`.
  - **Hecho cuando:** un plan troceado produce una sola PR.

- [ ] **11.2.4 · Programar la recogida** · ⏱️ 30 min
  - **Qué:** que el trabajador se ejecute solo cada 10 minutos.
  - **Por qué:** es el "agente durable 24/7" de su empresa, en versión sencilla.
  - **Cómo:** con el Programador de tareas de Windows o una tarea programada en la nube. Cada ejecución: `factory.mjs` con el modo del proyecto (normalmente `continuous`, con límites) en su worktree, y `publish.mjs` si acabó en `GREEN`. Notion se actualiza solo cuando una fase empieza o termina, como siempre. Antes de lanzar nada, comprueba que no hay otro trabajador en marcha (un fichero de bloqueo).
  - **Hecho cuando:** el siguiente ticket del roadmap se procesa sin que lances nada.

### ✅ Checkpoint 11.2
Dejas tareas pendientes en el roadmap, te vas, y al volver hay una PR abierta, el roadmap lo refleja y, si con ella se cerró una fase, el panel de Notion la muestra como `Hecha` con su hora de fin.

---

## Fase 11.3 · El vigilante de PRs

- [ ] **11.3.1 · `watch-prs.mjs`** · ⏱️ 45 min
  - **Qué:** un script, sin IA, que cada 10 minutos mira las PRs con la etiqueta `IA-auto`.
  - **Por qué:** una PR abierta puede romperse después: conflictos, CI en rojo o comentarios tuyos.
  - **Cómo:** con `gh pr list` y `gh pr view`. Si hay conflictos, CI roto o comentarios nuevos, escribe `specs/<ID>/REOPENED.md` con el motivo: `sync-roadmap.mjs` vuelve a marcar el ticket como `🟡 in progress`, `next-ticket.mjs` le da prioridad y el trabajador lo relanza desde `/spec-implement` con ese motivo como contexto (añade `REOPENED.md` al contrato). Si la PR se mergea o se cierra, borra `REOPENED.md` si existía y lo marca como hecho. **El trabajador nunca da un ticket por terminado él solo.**
  - **Hecho cuando:** comentar en una PR reabre su ticket en el roadmap; si su fase estaba terminada, vuelve a `En curso` en Notion.

### ✅ Checkpoint 11.3
Un comentario tuyo en una PR automática hace que la factoría vuelva a trabajar en ese ticket.

---

## Fase 11.4 · Triaje de PRs

- [ ] **11.4.1 · Definir tus zonas críticas** · ⏱️ 20 min
  - **Qué:** la lista de rutas que siempre requieren revisión doble.
  - **Por qué:** en su empresa son el pago y la búsqueda. En un proyecto tuyo pueden ser la facturación, la autenticación o las migraciones.
  - **Cómo:** añade `triage.criticalPaths` a `harness.config.json`.
  - **Hecho cuando:** la lista existe para el banco de pruebas.

- [ ] **11.4.2 · Clasificar cada PR** · ⏱️ 45 min
  - **Qué:** `scripts/triage.mjs <PR>`, que pone una etiqueta según cuánta revisión humana necesita.
  - **Por qué:** el objetivo es generar muchas PRs y reservar tu revisión para donde de verdad aporta.
  - **Cómo:**
    - Siempre, primero, revisión adversarial.
    - Toca una zona crítica, o es transversal a todo el proyecto → 🔴 **Crítica**: 2 revisiones humanas.
    - Varias secciones o páginas → 🟡 **Amplia**: 1 revisión humana.
    - Una sola sección → 🟢 **Localizada**: se puede mergear automáticamente.
    - **Regla que manda sobre todas:** sin consenso adversarial en 3 turnos, siempre hay revisión humana, aunque sea Localizada.
  - **Hecho cuando:** tres PRs de prueba reciben las tres etiquetas correctas.

### ✅ Checkpoint 11.4
Una PR Localizada con `NO CONSENSUS` acaba pidiendo tu revisión, no mergeándose sola.

---

## Fase 11.5 · Release progresiva

- [ ] **11.5.1 · Todo detrás de una feature flag** · ⏱️ 60 min
  - **Qué:** que cada PR automática meta su cambio apagado tras una flag.
  - **Por qué:** "mergear no es lanzar". El riesgo de generar muchas PRs se controla con la exposición al tráfico, no frenando el merge.
  - **Cómo:** elige un sistema de flags compatible con Vercel. Añade a `spec-plan` la regla: en modo automático, todo cambio visible va detrás de una flag nueva al 0%.
  - **Hecho cuando:** una PR automática mergeada no cambia nada para el usuario hasta que subes la flag.

- [ ] **11.5.2 · El monitor** · ⏱️ 90 min
  - **Qué:** un proceso que sube la flag por escalones mientras las métricas estén sanas: 1% → 5% → 25% → 50% → 100%.
  - **Por qué:** si algo va mal, solo lo ve una parte pequeña de los usuarios.
  - **Cómo:** mira tres tipos de métricas: de negocio (por ejemplo, conversiones), de infraestructura (errores del servidor, latencia) y técnicas (errores del navegador, Web Vitals). Si una empeora, flag al 0% y aviso a ti.
  - **Hecho cuando:** en una prueba con un error provocado, la flag vuelve sola al 0% y te llega el aviso.

### ✅ Checkpoint 11.5
Un ticket recorre todo el camino: idea en Notion → roadmap → PR → triaje → merge → flag al 1% → 100%, y tú solo has intervenido para revisar.

---

## 🏁 Hito Etapa 11

- Etiqueta `etapa-11` y release `v2.0.0`.
- `CHANGELOG.md`: cuántos tickets pasaron por la factoría completa y cuántas veces tuviste que intervenir.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| El trabajador gasta cupo sin control | Límite de tickets por día en la configuración y `--max-budget-usd` por fase |
| Claves de Notion o GitHub en el journal o en una PR | El journal ya oculta claves; comprueba también los cuerpos de las PR. Las claves, solo en variables de entorno |
| Se mergea algo que no debía | Empieza sin auto-merge: todas las PRs con revisión humana hasta que el triaje lleve semanas acertando |
| Quieres hacer esta etapa ya | No hasta que el banco de pruebas lleve varias semanas con el harness. Las etapas 0 a 8 ya te dan el 80% del valor |
