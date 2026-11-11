# 📦 Etapa 10 · Plantilla reutilizable

**Objetivo:** convertir tu harness en algo que se instala en cualquier proyecto con un comando, se actualiza sin romper nada y está documentado para que cualquiera (incluido tú dentro de 6 meses) lo entienda.

**Al acabar tendrás:** `scripts/install.mjs` con modo instalación y modo actualización, la skill `/project-start` que arranca cada proyecto (detecta cómo es, te pide grabaciones o información y te lleva por el descubrimiento), el harness probado en un proyecto Next.js nuevo, un README de portfolio y la versión `v1.0.0` publicada en GitHub.

**Requisitos previos:** Etapa 9.
**Tiempo:** 13–15 h.

> 💡 **Por qué esta etapa vale tanto:** hasta aquí tienes un harness que funciona en el sandbox. Desde aquí tienes un producto: lo instalas en ElectricSound, en el banco de pruebas o en el repo de un cliente de tu agencia.

---

## Fase 10.1 · Separar lo genérico de lo específico

- [ ] **10.1.1 · Buscar restos del sandbox** · ⏱️ 30 min
  - **Qué:** revisar que nada de `.claude/`, `docs/` ni `scripts/` mencione el sandbox o sus capas.
  - **Por qué:** todo lo específico debe vivir en `harness.config.json`. Si una skill dice "core, ui y app", fallará en un proyecto con otras capas.
  - **Cómo:** busca `sandbox`, `core`, `ui`, `app`, `sum` y `average` en esas carpetas. Pídele a Claude una segunda pasada buscando suposiciones del sandbox.
  - **Hecho cuando:** no queda ninguna mención fuera de la configuración, los tickets y `specs/`.

- [ ] **10.1.2 · Plantilla de configuración** · ⏱️ 20 min
  - **Qué:** `templates/harness.config.json` con valores por defecto para tu stack habitual (Next.js + Supabase).
  - **Por qué:** al instalar en un proyecto nuevo, partes de algo razonable y solo ajustas.
  - **Cómo:** `projectRoot: "."`, capas de ejemplo para Next.js (`src/lib/domain`, `src/lib/data`, `src/components`, `src/app`), comandos con `pnpm`, `migrationsPath: "supabase/migrations"`, `dirs.docs: "docs"`, `timezone: "Europe/Madrid"` y el perfil `pro` activo.
  - **Hecho cuando:** el lector de configuración la acepta (añade un test).

- [ ] **10.1.3 · Guardar el sandbox como ejemplo** · ⏱️ 15 min
  - **Qué:** mover la configuración actual a `examples/sandbox.config.json`.
  - **Por qué:** el sandbox sigue siendo útil para probar cambios del propio harness. El README explicará cómo usarlo.
  - **Cómo:** el `harness.config.json` de la raíz apunta al sandbox para desarrollo; documenta en el `CLAUDE.md` del repo que es la configuración de desarrollo.
  - **Hecho cuando:** `pnpm test` sigue en verde.

### ✅ Checkpoint 10.1
Cambia en la configuración el nombre de una capa del sandbox (y su carpeta). Todo debe seguir funcionando sin tocar ninguna skill ni ningún agente.

---

## Fase 10.2 · El instalador

- [ ] **10.2.1 · `install.mjs`: instalar** · ⏱️ 60 min
  - **Qué:** `node <ruta-al-harness>/scripts/install.mjs <carpeta-del-proyecto>`.
  - **Por qué:** instalar a mano es copiar 40 ficheros y olvidar 3.
  - **Cómo:**
    1. Comprueba lo que necesita el proyecto en ese ordenador (`git`, `node` 24, `pnpm`, `claude` y `rg`) y dice qué falta y cómo instalarlo. `rg` no es obligatorio para los scripts, pero sin él el agente busca peor por terminal.
    2. Copia `.claude/` (agentes, skills, hooks, scripts), `docs/contracts.md` y las plantillas.
    3. Crea los cuatro documentos del proyecto (`brief.md`, `architecture.md`, `decisions.md` y `roadmap.md`) desde `templates/docs/`, solo si no existen.
    4. Crea `harness.config.json` desde la plantilla, `tickets/` y `specs/`.
    5. Si ya existe `.claude/settings.json`, no lo pisa: avisa y muestra qué añadir.
    6. Nunca sobrescribe un fichero existente sin `--force`.
    7. Escribe la versión del harness en `.claude/harness-version`.
    8. Termina con los siguientes pasos: "Edita las capas en harness.config.json, crea un CLAUDE.md por capa con la plantilla, ejecuta `set-profile.mjs` y escribe el brief y el roadmap con `/project-roadmap`".
  - **Hecho cuando:** instala en una carpeta vacía y el proyecto queda con la estructura del contrato.

- [ ] **10.2.2 · `install.mjs --upgrade`: actualizar** · ⏱️ 45 min
  - **Qué:** actualizar el harness de un proyecto sin tocar lo que es del proyecto.
  - **Por qué:** cuando mejores el harness, querrás llevar la mejora a todos tus proyectos sin perder su configuración ni su memoria.
  - **Cómo:** actualiza agentes, skills, hooks y scripts. **Nunca** toca `harness.config.json`, los `CLAUDE.md` de capa, `tickets/`, `specs/`, `lessons.json` ni los cuatro documentos del proyecto. De `docs/`, solo actualiza `contracts.md`, que es del harness. Después ejecuta `set-profile.mjs` con el perfil que ya tenía el proyecto. Muestra qué ficheros cambió.
  - **Hecho cuando:** tras actualizar, la configuración y la memoria del proyecto siguen intactas.

- [ ] **10.2.3 · Tests del instalador** · ⏱️ 45 min
  - **Qué:** tests en carpetas temporales.
  - **Por qué:** un instalador que pisa ficheros del proyecto destruye trabajo.
  - **Cómo:** casos: carpeta vacía; carpeta con `settings.json` propio; reinstalar sin `--force` no pisa nada; `--upgrade` conserva configuración, `specs/` y los documentos del proyecto; versión escrita correctamente.
  - **Hecho cuando:** los 5 tests pasan.

### ✅ Checkpoint 10.2
Instala, toca la configuración del proyecto destino, ejecuta `--upgrade` y comprueba con `git diff` que tu configuración sigue igual.

---

## Fase 10.3 · Arranque de un proyecto: `/project-start`

> 💡 **Lo primero que pasa al instalar el harness en un proyecto** es esto: sacar información y definir, conversando, qué producto se va a construir. El instalador copia ficheros; `/project-start` te acompaña desde ahí hasta `READY`.

**Qué es siempre igual y qué se adapta a cada proyecto:**

| Siempre igual (lo que permite que los agentes encuentren todo) | Se adapta a cada proyecto |
|---|---|
| `.claude/`, `docs/`, `discovery/`, `tickets/`, `specs/` | Las capas, sus carpetas y sus nombres |
| Los nombres de los documentos y artefactos | Los comandos de lint, tests y build |
| El contrato | La carpeta de migraciones, si la hay |
| | El perfil de modelo y el modo de ejecución |
| | Si se usa el descubrimiento con grabaciones o no |

- [ ] **10.3.1 · Detectar cómo es el proyecto: `detect-project.mjs`** · ⏱️ 75 min
  - **Qué:** un script que mira un proyecto y propone su `harness.config.json`.
  - **Por qué:** escribir a mano capas y comandos en cada proyecto es lento y se presta a errores. La mayoría se puede deducir.
  - **Cómo:**
    1. Lee `package.json`: el framework (Next.js, Vite…), los scripts que ya existen y el gestor de paquetes (por el fichero de bloqueo: `pnpm-lock.yaml`, `package-lock.json`…).
    2. Mira las carpetas: `src/`, `app/`, `components/`, `lib/`, `supabase/migrations/`.
    3. Propone capas según patrones conocidos de tu stack, los comandos según los scripts que existen y `migrationsPath` si hay migraciones.
    4. Lista lo que falta: por ejemplo, "no hay script de tests" o "no hay `lint:file`".
    5. Si la carpeta está vacía, lo dice: la configuración saldrá de la ronda de arquitectura de `/discovery`.
    6. Imprime la propuesta en JSON; nunca escribe la configuración él solo.
  - **Hecho cuando:** sobre un proyecto Next.js con Supabase propone capas, comandos y migraciones con sentido.

- [ ] **10.3.2 · Skill `/project-start`** · ⏱️ 60 min
  - **Qué:** `.claude/skills/project-start/SKILL.md`, el arranque guiado.
  - **Por qué:** un solo punto de entrada para empezar cualquier proyecto, nuevo o con código.
  - **Cómo:** los pasos, guardando el avance en `discovery/session.md` para poder retomarlo:
    1. **¿Proyecto nuevo o con código?** Si tiene código, ejecuta `detect-project.mjs`, te enseña la propuesta y **Gate I (instalación)**: la apruebas o la corriges, y se escribe `harness.config.json`.
    2. **¿Qué material tienes?** Te pregunta por grabaciones o transcripciones de reuniones, documentos del cliente, notas o capturas, y te pide que los dejes en `discovery/inbox/`. Si no tienes nada, te propone contárselo en la conversación. Si hay material, lanza `/discovery-ingest`.
    3. **Definir el producto:** lanza `/discovery` (rondas, Gate P, Gate H, arquitectura, Gate R).
    4. **Proyecto nuevo:** con la arquitectura aprobada, escribe `harness.config.json` y te propone la estructura inicial de carpetas (Gate I).
    5. **Normas:** crea un `CLAUDE.md` por capa desde la plantilla, con las convenciones que salieron del descubrimiento.
    6. **Cómo trabajará la factoría:** te pregunta perfil (`pro` o `max`) y modo de ejecución, y ejecuta `set-profile.mjs`.
    7. **¿Listo?** `validate-readiness.mjs`. Si es `READY`, te dice cómo lanzar el primer ticket; si no, qué falta.
  - **Hecho cuando:** la skill existe y pasa el test de skills.

- [ ] **10.3.3 · Proyectos con código pero sin tests** · ⏱️ 30 min
  - **Qué:** que `/project-start` prepare el terreno cuando falte algo que el harness necesita.
  - **Por qué:** muchos proyectos reales no tienen tests ni lint. Sin ellos no hay juez, y sin juez la factoría no es fiable.
  - **Cómo:** por cada cosa que falte según `detect-project.mjs`, añade una tarea `CHORE` a una primera etapa del roadmap llamada "Preparar el terreno" (por ejemplo, "Añadir Vitest y un primer test" o "Añadir el script lint:file"). La propia factoría puede hacerlas. Mientras no estén hechas, el proyecto es `NOT READY` para todo lo demás.
  - **Hecho cuando:** sobre un proyecto sin tests, el roadmap empieza con esas tareas.

- [ ] **10.3.4 · El instalador te manda a `/project-start`** · ⏱️ 15 min
  - **Qué:** que `install.mjs` termine diciendo exactamente qué hacer.
  - **Por qué:** el instalador no puede conversar; la skill sí.
  - **Cómo:** al terminar, imprime: "Abre Claude Code en este proyecto y ejecuta `/project-start`". Crea también `discovery/` con sus subcarpetas y añade `discovery/inbox/` y `discovery/transcripts/` al `.gitignore` del proyecto.
  - **Hecho cuando:** tras instalar, existen las carpetas, el `.gitignore` está actualizado y el mensaje aparece.

- [ ] **10.3.5 · Tests de la detección** · ⏱️ 45 min
  - **Qué:** fixtures de proyectos de ejemplo en `fixtures/projects/`.
  - **Por qué:** cada proyecto real será un poco distinto; los fixtures cubren los casos típicos.
  - **Cómo:** casos: Next.js con `src/app`; Next.js con `app/` en la raíz; Vite con React; proyecto con `supabase/migrations`; carpeta vacía; proyecto sin script de tests.
  - **Hecho cuando:** los 6 casos pasan.

### ✅ Checkpoint 10.3
Sobre una copia de un proyecto tuyo con código, `detect-project.mjs` propone una configuración que aceptarías con cambios mínimos.

---

## Fase 10.4 · Prueba en un proyecto de verdad

- [ ] **10.4.1 · Crear un proyecto Next.js limpio** · ⏱️ 20 min
  - **Qué:** `pnpm create next-app` con TypeScript en una carpeta temporal.
  - **Por qué:** comprobar que el harness funciona fuera de su sandbox, con tu stack real. (No es el banco de pruebas: ese tendrá su propio roadmap.)
  - **Cómo:** crea las carpetas de capas de la plantilla, añade Vitest y los scripts `lint:file`, `typecheck` y `test`.
  - **Hecho cuando:** los comandos de la configuración por defecto funcionan en ese proyecto.

- [ ] **10.4.2 · Instalar y arrancar con `/project-start`** · ⏱️ 45 min
  - **Qué:** instalar el harness con `install.mjs` y dejar que `/project-start` lo prepare.
  - **Por qué:** es exactamente lo que harás en cada proyecto nuevo. Si la parte técnica (sin contar la conversación del producto) pasa de 30 minutos, el instalador o la documentación tienen que mejorar.
  - **Cómo:** sigue solo lo que te dicen el instalador y la skill, sin mirar el roadmap. Apunta cada duda que te surja. Para ir rápido, dale como material un documento corto con la idea del proyecto.
  - **Hecho cuando:** `validate-readiness.mjs` dice `READY`, `set-profile.mjs --check` pasa, las fronteras de capas funcionan y apuntaste el tiempo que tardaste.

- [ ] **10.4.3 · El primer ticket con la factoría** · ⏱️ 60 min
  - **Qué:** el primer ticket del roadmap que salió de `/project-start`, con `node scripts/factory.mjs --mode ticket`.
  - **Por qué:** la prueba final de que es reutilizable, documentos y modos incluidos.
  - **Cómo:** si el roadmap es grande, que la primera tarea sea pequeña (por ejemplo, una función de formato de fechas en el dominio y su uso en una página). Lee el informe de la ejecución al terminar.
  - **Hecho cuando:** termina en `GREEN`. Cada fallo que no ocurrió en el sandbox es un fallo de generalidad: arréglalo en el harness, no en el proyecto.

### ✅ Checkpoint 10.4
Instalación y arranque técnico en menos de 30 minutos (sin contar la conversación del producto), proyecto `READY` y un ticket en `GREEN` en un proyecto que el harness no había visto nunca.

---

## Fase 10.5 · Documentación

- [ ] **10.5.1 · README del harness** · ⏱️ 60 min
  - **Qué:** el `README.md` del repo, pensado para quien llega desde tu portfolio.
  - **Por qué:** es lo primero que verá un reclutador o un cliente. Tiene que explicar en 30 segundos qué es y por qué es bueno.
  - **Cómo:** secciones: qué es (dos frases), el diagrama de las 4 fases, instalación rápida, configuración, perfiles Pro/Max, los documentos vivos (brief, arquitectura, decisiones y roadmap), cifras reales de `run-metrics.md`, las 3 reglas en que se basa y créditos.
  - **Hecho cuando:** alguien que no te conoce entiende qué hace leyendo solo el principio.
  - **Referencia:** `README.md`

- [ ] **10.5.2 · Créditos y licencia** · ⏱️ 15 min
  - **Qué:** reconocer el trabajo original.
  - **Por qué:** su repo tiene licencia MIT. Si reutilizaste partes de su código, la licencia te pide conservar su aviso de copyright. Además, es lo correcto y queda bien.
  - **Cómo:** sección "Créditos" en el README enlazando la charla y el repo de Joan León y Carlos Villuendas. Si copiaste código suyo, incluye su aviso de licencia.
  - **Hecho cuando:** la sección existe.

- [ ] **10.5.3 · Guía de instalación paso a paso** · ⏱️ 30 min
  - **Qué:** `docs/install.md` con las dudas que apuntaste en 10.4.2 ya resueltas.
  - **Por qué:** la próxima vez que instales, o cuando lo haga otra persona, no tendrás esas dudas.
  - **Cómo:** pasos numerados, con un apartado de problemas frecuentes en Windows.
  - **Hecho cuando:** cubre todas las dudas apuntadas.

### ✅ Checkpoint 10.5
Pídele a Claude, en una sesión nueva y sin contexto, que lea solo el README y `docs/install.md` y te explique cómo instalarlo. Si se equivoca, la documentación tiene huecos.

---

## Fase 10.6 · Versión 1.0

- [ ] **10.6.1 · Pasada final** · ⏱️ 30 min
  - **Qué:** `pnpm test`, `set-profile.mjs --check` y una revisión adversarial de todo el diff desde `etapa-0`.
  - **Por qué:** cerrar la versión sin sorpresas.
  - **Cómo:** `node scripts/adversarial-review.mjs etapa-0 HEAD` y arregla lo que sobreviva a la discusión.
  - **Hecho cuando:** todo en verde y la revisión en `CONSENSUS` sin hallazgos graves.

- [ ] **10.6.2 · Publicar `v1.0.0`** · ⏱️ 20 min
  - **Qué:** la etiqueta y la release en GitHub.
  - **Por qué:** una versión numerada es la que instalarás en tus proyectos. Las siguientes mejoras serán `v1.1`, `v1.2`…
  - **Cómo:** `git tag v1.0.0`, `git push --tags` y crea la release en GitHub con el resumen del `CHANGELOG.md`.
  - **Hecho cuando:** la release es visible en GitHub.

- [ ] **10.6.3 · Llevarlo al portfolio** · ⏱️ 30 min
  - **Qué:** fijar el repo en tu perfil de GitHub y añadirlo a tu web de portfolio.
  - **Por qué:** "construí mi propio harness de agentes con validación por scripts y coste medido" es justo lo que buscan ahora las empresas que contratan.
  - **Cómo:** fija el repo, añade una tarjeta en tu web con las cifras de `run-metrics.md` y un enlace.
  - **Hecho cuando:** está visible en los dos sitios.

- [ ] **10.6.4 · Contarlo** (opcional) · ⏱️ 45 min
  - **Qué:** un post o un vídeo corto sobre cómo lo construiste.
  - **Por qué:** encaja con tu plan de contenido "build in public" y te da visibilidad como especialista.
  - **Cómo:** la historia de las etapas, una cifra real y un aprendizaje que no esperabas.
  - **Hecho cuando:** está publicado.

### ✅ Checkpoint 10.6
`v1.0.0` publicada, visible en tu portfolio y lista para instalarse en el banco de pruebas.

---

## 🏁 Hito Etapa 10

- Etiqueta `etapa-10` y release `v1.0.0`.
- `CHANGELOG.md`: tiempo de instalación en un proyecto nuevo y resultado del ticket de prueba.
- **Siguiente paso: el roadmap del banco de pruebas**, donde instalarás esta versión en tu proyecto real.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| Las rutas de copia fallan en Windows | Usa siempre `path.join` y `fs.cpSync` con `recursive: true`. Nunca construyas rutas con `+ '/'` |
| El `settings.json` del proyecto destino ya tiene hooks | No lo fusiones automáticamente en la v1.0. Muestra lo que hay que añadir y que lo hagas tú |
| Te tienta empaquetarlo como plugin de Claude Code | Deja una tarea de investigación para la v1.1. Los plugins tienen sus propias reglas para hooks y scripts; mejor con un instalador que ya funciona |
