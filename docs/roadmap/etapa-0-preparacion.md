# 🧰 Etapa 0 · Preparación

**Objetivo:** tener el entorno de Windows listo, entender el harness original funcionando y crear tu repo `harness` con un sandbox para probarlo.

**Al acabar tendrás:** Claude Code funcionando en Windows, el repo original ejecutado de punta a punta, tu repo `harness` en GitHub y un sandbox mínimo de tres capas con lint y tests.

**Requisitos previos:** ninguno.
**Tiempo:** 6–8 h.

---

## Fase 0.1 · Entorno en Windows

Todo lo que necesitas instalado antes de tocar nada.

- [x] **0.1.1 · Instalar Git for Windows** · ⏱️ 15 min · ✅ 11/11
  - **Qué:** Git y Git Bash.
  - **Por qué:** Claude Code en Windows usa Git Bash para ejecutar los comandos del agente. Sin él, nada de lo demás funciona.
  - **Cómo:**
    1. Descarga el instalador desde git-scm.com.
    2. Deja las opciones por defecto.
    3. Configura tu identidad: `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo"`.
  - **Hecho cuando:** `git --version` responde en PowerShell y existe "Git Bash" en el menú de inicio.
  - **Comprobado:** `git --version` responde `2.56.0.windows.2` en PowerShell, el acceso "Git Bash" existe en el menú de inicio y la identidad (`user.name` y `user.email`) está configurada.

- [x] **0.1.2 · Instalar Node 24 y pnpm** · ⏱️ 20 min · ✅ 11/11
  - **Qué:** el motor que ejecuta todos los scripts del harness y el gestor de paquetes.
  - **Por qué:** todos los hooks, validadores y el piloto automático son scripts de Node.
  - **Cómo:**
    1. Instala Node 24 LTS desde nodejs.org (o con nvm-windows si quieres cambiar de versión fácilmente).
    2. Activa pnpm con `corepack enable`.
    3. Comprueba: `node -v` y `pnpm -v`.
  - **Hecho cuando:** `node -v` empieza por `v24` y `pnpm -v` responde.
  - **Referencia:** `.nvmrc`
  - **Comprobado:** `node -v` responde `v24.14.1` y `pnpm -v` responde `12.14.0` en PowerShell.

- [x] **0.1.3 · Instalar Claude Code e iniciar sesión** · ⏱️ 15 min · ✅ 11/11
  - **Qué:** Claude Code en su versión nativa para Windows.
  - **Por qué:** es el motor del harness. Todo lo demás son ficheros que él lee.
  - **Cómo:**
    1. Sigue la guía oficial de instalación para Windows (code.claude.com/docs, apartado de instalación).
    2. Abre una terminal nueva y ejecuta `claude`.
    3. Inicia sesión con tu plan con `/login`.
  - **Hecho cuando:** `claude --version` responde con 2.1 o superior y dentro de Claude Code `/status` muestra tu cuenta.
  - **Comprobado:** `claude --version` responde `2.1.306` en PowerShell y la sesión está iniciada: esta comprobación se hizo desde una sesión de Claude Code con la cuenta del usuario.

- [x] **0.1.4 · Comprobar que no pagas por API sin querer** · ⏱️ 5 min · ✅ 11/11
  - **Qué:** asegurarte de que no hay una clave de API suelta en tu sistema.
  - **Por qué:** si existe `ANTHROPIC_API_KEY`, Claude Code la usa en lugar de tu suscripción y te cobra por token.
  - **Cómo:**
    1. En PowerShell: `echo $env:ANTHROPIC_API_KEY`.
    2. Si sale algo, quítala de las variables de entorno de Windows (Configuración → Sistema → Variables de entorno).
  - **Hecho cuando:** el comando no imprime nada.
  - **Comprobado:** `$env:ANTHROPIC_API_KEY` está vacía en PowerShell y tampoco existe como variable de entorno de usuario ni de sistema.

- [x] **0.1.5 · Configurar el editor** · ⏱️ 15 min · ✅ 11/11
  - **Qué:** VS Code (o Cursor) con las extensiones de ESLint y Markdown.
  - **Por qué:** vas a leer y escribir mucho Markdown y JSON. Ver los errores de lint en el editor te ahorra tiempo.
  - **Cómo:**
    1. Instala las extensiones "ESLint" y "Markdown All in One".
    2. Opcional: la extensión de Claude Code para VS Code.
  - **Hecho cuando:** al abrir un `.ts` con un error, el editor lo subraya.
  - **Criterio precisado (11/11, con el usuario):** el usuario trabaja desde Orca y VS Code queda como editor de apoyo, así que la tarea se cierra con las dos extensiones instaladas. El subrayado de ESLint se comprobará en la Fase 0.4, cuando exista un proyecto con reglas de lint: VS Code ya subraya los errores de tipos de TypeScript sin ninguna extensión, y esa prueba no demostraría nada.
  - **Comprobado:** `code --list-extensions --show-versions` lista `dbaeumer.vscode-eslint@3.0.34` y `yzhang.markdown-all-in-one@3.6.3`, además de `anthropic.claude-code@2.1.322`.

- [x] **0.1.6 · Instalar ripgrep** · ⏱️ 10 min · ✅ 11/11
  - **Qué:** `rg`, el buscador de texto que usarás tú (y el agente cuando busque por terminal) en vez de `grep`.
  - **Por qué:** es mucho más rápido, busca en todas las carpetas sin que se lo pidas, se salta lo que ignora Git (`node_modules`, `dist`…) y funciona directo en PowerShell. Claude Code ya lo usa por dentro en su herramienta de búsqueda; así tú trabajas igual que él.
  - **Cómo:**
    1. `winget install BurntSushi.ripgrep.MSVC` y abre una terminal nueva.
    2. Pruébalo: `rg "TODO" -t js` busca "TODO" solo en ficheros JavaScript.
    3. Te va a venir bien en la Fase 0.2 para estudiar el repo original: `rg "SubagentStop"` te dice en un segundo dónde se usa cada hook.
  - **Hecho cuando:** `rg --version` responde.
  - **Comprobado:** instalado con `winget install BurntSushi.ripgrep.MSVC`; en un PowerShell nuevo con el PATH del registro, `where.exe rg` encuentra `rg.exe` y `rg --version` responde `ripgrep 15.2.0`.

### ✅ Checkpoint 0.1
En una terminal nueva de PowerShell, estos seis comandos responden sin error: `git --version`, `node -v`, `pnpm -v`, `claude --version`, `rg --version`, y `echo $env:ANTHROPIC_API_KEY` no imprime nada.

**Superado:** 11/11 · en un PowerShell nuevo: git 2.56.0, node v24.14.1, pnpm 12.14.0, claude 2.1.306, ripgrep 15.2.0 y `ANTHROPIC_API_KEY` vacía.

---

## Fase 0.2 · Entender el original

Antes de construir el tuyo, mira el suyo funcionando. Es la fase que más tiempo ahorra después.

- [x] **0.2.1 · Clonar y arrancar el repo original** · ⏱️ 20 min · ✅ 11/11
  - **Qué:** su repo funcionando en tu máquina.
  - **Por qué:** ver un harness real que funciona es la mejor documentación que existe.
  - **Cómo:**
    1. `git clone https://github.com/nucliweb/harness-engineering-biznagafest.git`
    2. `cd harness-engineering-biznagafest`
    3. `pnpm install` y `pnpm test`.
  - **Hecho cuando:** `pnpm test` termina en verde.
  - **Referencia:** `README.md`
  - **Criterio precisado (11/11, con el usuario):** en Windows nativo `pnpm test` no puede terminar en verde sin modificar el repo original, porque parte de sus tests prueban scripts de bash y esperan rutas de Unix. La tarea se cierra con `vitest run` en verde y con `node --test` fallando solo en esos tests no portables. No se instala WSL: el harness propio se construye en Windows nativo y con Node puro.
  - **Comprobado:** clonado en `C:\Users\spano\Documents\Dev\Personales\harness-engineering-biznagafest` (carpeta hermana, fuera de este repo); `pnpm install` termina sin errores con pnpm 12.16.1; `pnpm exec vitest run` responde `Test Files 18 passed (18)` y `Tests 96 passed (96)`; `pnpm run test:scripts` responde 140 tests en verde y 34 en rojo de 174, todos en `scripts/headless.test.mjs` (17), `.claude/hooks/post-edit-eslint.test.mjs` (8), `scripts/adversarial-review.test.mjs` (7), `.claude/settings.test.mjs` (1) y `scripts/lib/format-stream.test.mjs` (1).

- [x] **0.2.2 · Leer el mapa de diapositivas a ficheros** · ⏱️ 20 min · ✅ 11/11
  - **Qué:** `docs/slides-to-repo.md`.
  - **Por qué:** te dice qué fichero explica cada parte de la charla. Es tu guía de lectura para todo el roadmap.
  - **Cómo:** léelo entero y abre los ficheros de las tres primeras filas.
  - **Hecho cuando:** sabes decir en una frase qué hay en `.claude/agents`, `.claude/skills`, `.claude/hooks` y `.claude/scripts`.
  - **Referencia:** `docs/slides-to-repo.md`
  - **Comprobado:** el usuario lo explicó con sus palabras en la sesión: `.claude/agents` son seis subagentes, cada uno con un trabajo; `.claude/skills`, los procedimientos; `.claude/hooks`, las automatizaciones; `.claude/scripts`, los inspectores de que todo vaya bien.

- [x] **0.2.3 · Leer el contrato** · ⏱️ 45 min · ✅ 11/11
  - **Qué:** `docs/contracts.md`, de arriba a abajo.
  - **Por qué:** es el corazón del sistema. Tu Etapa 1 consiste en escribir el tuyo.
  - **Cómo:** léelo con calma. Apunta en un papel las 3 cosas que no entiendas y pregúntaselas a Claude.
  - **Hecho cuando:** sabes qué títulos lleva `00-clarification.md` y qué significa `Blocking: 0`.
  - **Referencia:** `docs/contracts.md`
  - **Criterio precisado (11/11, con el usuario):** el usuario pide no hacer la parte de aprendizaje de esta fase y avanzar hacia la construcción. La lectura la hace Claude y la tarea se cierra con el resumen entregado en la sesión, sin comprobar que el usuario sepa explicarlo.
  - **Comprobado:** Claude leyó `docs/contracts.md` entero (368 líneas) y entregó el resumen en la sesión: `00-clarification.md` lleva los títulos `Goal`, `Scope`, `Out of scope`, `Acceptance criteria`, `Code anchors` y `Open questions` (este último debe decir `- None`), y `Blocking: 0` es la línea `## Audit` de `03-plan.md` que indica que el auditor del plan no deja ningún hallazgo bloqueante.

- [x] **0.2.4 · Leer un ticket completo ya hecho** · ⏱️ 30 min · ✅ 11/11
  - **Qué:** los ficheros de `specs/FEATURE-1/` en orden, del `00` al `04`, y su `journal.jsonl`.
  - **Por qué:** es la "salida esperada". Ver el resultado final te ayuda a entender para qué sirve cada pieza.
  - **Cómo:** abre cada fichero y relaciónalo con su fase.
  - **Hecho cuando:** puedes explicar qué fase escribió cada fichero.
  - **Referencia:** `specs/FEATURE-1/`
  - **Criterio precisado (11/11, con el usuario):** igual que en la 0.2.3: la lectura la hace Claude y no se comprueba que el usuario sepa explicarlo.
  - **Comprobado:** Claude leyó los seis ficheros de `specs/FEATURE-1/` y los relacionó con su fase según `docs/contracts.md` §4: `00-clarification.md` lo escribe `spec-clarify` (fase 1); `01-research.md`, `02-design.md` y `03-plan.md`, `spec-plan` (fase 2); las casillas `[x]` de `03-plan.md` las tacha `spec-implement` (fase 3); `04-dod.md` lo escribe `validator-global` dentro de `spec-validate` (fase 4); y `journal.jsonl` (22 líneas) lo escribe solo `journal-append.mjs`, con entradas de las fases `plan`, `implement` y `validate`.

- [x] **0.2.5 · Ejecutar las 4 fases en su repo** · ⏱️ 60 min · ✅ 11/11
  - **Qué:** un ticket completo con su harness, en modo interactivo.
  - **Por qué:** sentir las pausas, las puertas y las preguntas en primera persona.
  - **Cómo:**
    1. En el repo, abre `claude`.
    2. Ejecuta `/spec-clarify FIX-1` y responde a sus preguntas.
    3. Sigue con `/spec-plan FIX-1`, `/spec-implement FIX-1` y `/spec-validate FIX-1`.
    4. Antes y después, ejecuta `/usage` y apunta los porcentajes.
  - **Hecho cuando:** existe `specs/FIX-1/04-dod.md` y sabes cuánto cupo de tu plan gastó el ticket.
  - **Referencia:** `tickets/FIX-1.md`
  - **Criterio precisado (11/11, con el usuario):** el usuario pide que lo ejecute Claude, así que el ticket no se lanza en modo interactivo sino con el runner `scripts/headless.sh FIX-1` del repo original, y nadie responde preguntas ni siente las pausas. El cupo se mide con los tokens y el coste equivalente de API que el runner copia en `docs/run-metrics.md`, no con los porcentajes de `/usage`, que solo existen en modo interactivo.
  - **Comprobado:** `Test-Path specs\FIX-1\04-dod.md` responde `True` en PowerShell. Las cuatro fases terminaron (`success` en las cuatro filas `FIX-1` de `docs/run-metrics.md`) en 13 min 24 s, con 85 turnos y 4,87 USD de coste equivalente: `spec-clarify` 0,50, `spec-plan` 2,40, `spec-implement` 1,64 y `spec-validate` 0,33. El veredicto de `04-dod.md` es `RED` y el runner salió con código 4 y dejó `BLOCKED.md`: lint, tipos, build, contratos y los 108 tests de vitest pasan, y solo falla la mitad `node --test` de `pnpm test`, por los tests no portables a Windows de la 0.2.1. Para lanzarlo en Git Bash hizo falta `MSYS2_ARG_CONV_EXCL="/spec-"`, porque Git Bash convierte el argumento `/spec-clarify FIX-1` en una ruta de Windows; se añadieron `--setting-sources project,local --strict-mcp-config` a `CLAUDE_FLAGS` para no cargar la configuración personal. Los cambios del ticket quedan sin commitear en el clon.

- [x] **0.2.6 · Apuntar lo que te sorprendió** · ⏱️ 15 min · ✅ 11/11
  - **Qué:** una nota con 5 cosas que te llamaron la atención y 3 que cambiarías.
  - **Por qué:** esas notas son tus primeras decisiones de diseño. Las usarás en la Etapa 1.
  - **Cómo:** escríbelas en Notion o en tu vault de Obsidian.
  - **Hecho cuando:** la nota existe y tiene las 8 líneas.
  - **Criterio precisado (11/11, con el usuario):** la nota la redacta Claude a partir de su lectura del repo original y de la ejecución de `FIX-1`, y así consta en la propia nota. El usuario no la ha revisado: son propuestas para la Etapa 1, no sus impresiones.
  - **Comprobado:** la nota `Proyectos/Personales/kuvo-harness.md` existe en el vault de Obsidian (SCM-OS), releída tras escribirla: su sección "Notas del harness original (Fase 0.2)" tiene 5 líneas en "5 cosas que llaman la atención" y 3 en "3 cosas que cambiaría".

### ✅ Checkpoint 0.2
Sin mirar, sabes explicar las 4 fases, las 3 puertas (A, B y C) y para qué sirve el journal. Y tienes apuntado cuánto cupo gasta un ticket en tu plan.

**Criterio precisado (11/11, con el usuario):** el usuario pidió en la sesión no hacer la parte de aprendizaje de esta fase y lanzó `/cerrar-fase` sin dar la explicación "sin mirar". La fase se cierra sin esa comprobación: que el usuario sepa explicar las 4 fases, las 3 puertas y el journal queda sin demostrar.

**Superado:** 11/11 · con el criterio precisado: las seis tareas están tachadas con su evidencia y el cupo de un ticket está apuntado en la 0.2.5 (`FIX-1`: 4,87 USD de coste equivalente y 13 min 24 s, cuatro filas en `docs/run-metrics.md` del clon). La explicación sin mirar no se hizo.

---

## Fase 0.3 · Tu repo `harness`

- [x] **0.3.1 · Crear el repo en GitHub** · ⏱️ 10 min · ✅ 11/11
  - **Qué:** un repo público llamado `harness` (o el nombre que quieras).
  - **Por qué:** será parte de tu portfolio y lo instalarás en otros proyectos desde aquí.
  - **Cómo:**
    1. Créalo en GitHub con licencia MIT y un `README.md`.
    2. Clónalo en tu carpeta de proyectos.
  - **Hecho cuando:** el repo está clonado y `git status` responde.
  - **Criterio precisado (11/11, con el usuario):** la carpeta `kuvo-harness` ya existía con el roadmap y las skills, así que el repo no se clona: se crea en GitHub y se enlaza a la carpeta existente con `git init`, `git remote add` y `git pull`. El resultado es el mismo que el de un clon. El repo lo crea Claude con `gh`, con el visto bueno del usuario.
  - **Comprobado:** `gh repo view sebascm-dev/kuvo-harness` responde visibilidad `PUBLIC` y licencia `MIT License`; en PowerShell, `git status` responde `On branch main` y `Your branch is up to date with 'origin/main'`, y `git log --oneline` muestra `5b1274b Initial commit` con `LICENSE` y `README.md`.

- [ ] **0.3.2 · Fijar finales de línea** · ⏱️ 10 min
  - **Qué:** un fichero `.gitattributes` que obliga a usar finales de línea de tipo Linux.
  - **Por qué:** en Windows, Git puede convertir los finales de línea y romper scripts y validadores que comparan texto exacto.
  - **Cómo:** crea `.gitattributes` con esta línea:
    ```
    * text=auto eol=lf
    ```
  - **Hecho cuando:** el fichero está en el repo y hecho commit.

- [x] **0.3.3 · Crear la estructura de carpetas** · ⏱️ 15 min · ✅ 11/11
  - **Qué:** las carpetas vacías de la arquitectura del índice.
  - **Por qué:** tener el esqueleto visible te ayuda a saber dónde va cada pieza.
  - **Cómo:** crea `docs/`, `.claude/agents/`, `.claude/skills/`, `.claude/hooks/`, `.claude/scripts/`, `scripts/`, `templates/` y `sandbox/`, cada una con un `.gitkeep`.
  - **Hecho cuando:** el árbol coincide con el del índice.
  - **Criterio precisado (11/11, con el usuario):** el `.gitkeep` solo se crea en las carpetas que quedarían vacías: `docs/` ya contiene el roadmap y `.claude/skills/` ya contiene `iniciar-fase` y `cerrar-fase`. En esta tarea se hacen además dos cosas que el roadmap no asigna a ninguna tarea y que pide `LEEME-CLAUDE-CODE.md`: mover el roadmap de la raíz a `docs/roadmap/` y crear el `CLAUDE.md` del repo con sus ocho reglas de trabajo.
  - **Comprobado:** en PowerShell existen las ocho carpetas del árbol de `00-indice.md` (`docs/`, `.claude/agents/`, `.claude/skills/`, `.claude/hooks/`, `.claude/scripts/`, `scripts/`, `templates/` y `sandbox/`); `Get-ChildItem -Recurse -Force -Filter .gitkeep` lista seis: `.claude\agents`, `.claude\hooks`, `.claude\scripts`, `sandbox`, `scripts` y `templates`; `docs\roadmap` contiene los 16 ficheros del roadmap y `diagramas`, y `CLAUDE.md` existe en la raíz.

- [x] **0.3.4 · Crear el `package.json` raíz** · ⏱️ 20 min · ✅ 11/11
  - **Qué:** el fichero que define el proyecto y sus scripts.
  - **Por qué:** desde aquí lanzarás los tests de todos los scripts del harness.
  - **Cómo:**
    1. `pnpm init`.
    2. Añade `"type": "module"` para poder usar `import` en los scripts.
    3. Añade el script `"test": "node --test"`.
  - **Hecho cuando:** `pnpm test` se ejecuta (aunque todavía no haya tests).
  - **Comprobado:** `pnpm test` ejecuta `node --test` en PowerShell, responde `tests 0`, `pass 0`, `fail 0` y sale con código 0. `package.json` tiene `"type": "module"` y `"test": "node --test"`; sobre lo que genera `pnpm init` se cambió la licencia a `MIT` (la del repo), se quitó `main` (no existe `index.js`) y se añadieron `"private": true` y `"engines": { "node": ">=24" }`. `pnpm init` fijó `pnpm@12.18.0` en `packageManager` y generó `pnpm-lock.yaml`.

- [x] **0.3.5 · Crear `CHANGELOG.md`** · ⏱️ 10 min · ✅ 11/11
  - **Qué:** un registro de lo que añades en cada etapa.
  - **Por qué:** cada hito deja una línea aquí. Para tu portfolio, demuestra que construiste por pasos.
  - **Cómo:** crea el fichero con un título y una sección `## etapa-0`.
  - **Hecho cuando:** existe y tiene la sección.
  - **Comprobado:** `CHANGELOG.md` existe en la raíz y `Select-String -Pattern '^## etapa-0$'` encuentra la sección en la línea 5.

### ✅ Checkpoint 0.3
El repo está en GitHub con `.gitattributes`, la estructura de carpetas, `package.json` con `"type": "module"` y `CHANGELOG.md`. `pnpm test` se ejecuta sin error.

---

## Fase 0.4 · Sandbox mínimo

Un proyecto pequeño **de usar y tirar**, solo para probar el harness hasta que tengamos el banco de pruebas real.

- [ ] **0.4.1 · Crear el proyecto** · ⏱️ 20 min
  - **Qué:** una app React + TypeScript mínima dentro de `sandbox/`.
  - **Por qué:** el harness necesita código con capas sobre el que trabajar. Este sandbox es su campo de entrenamiento.
  - **Cómo:**
    1. En la carpeta del repo: `pnpm create vite sandbox --template react-ts`.
    2. `cd sandbox` y `pnpm install`.
  - **Hecho cuando:** `pnpm dev` dentro de `sandbox/` abre la app en el navegador.

- [ ] **0.4.2 · Crear las tres capas** · ⏱️ 30 min
  - **Qué:** tres carpetas: `src/core` (lógica pura), `src/ui` (componentes) y `src/app` (páginas y estado).
  - **Por qué:** es la estructura mínima donde "capa a capa" y las fronteras de lint tienen sentido.
  - **Cómo:**
    1. Crea las tres carpetas.
    2. En `src/core/sum.ts` escribe una función pura de ejemplo, `sum(a, b)`, y expórtala desde `src/core/index.ts`.
    3. En `src/ui/Total.tsx`, un componente que recibe un número por props y lo muestra.
    4. En `src/app/App.tsx`, usa los dos.
  - **Hecho cuando:** la app muestra el total y cada capa tiene al menos un fichero.

- [ ] **0.4.3 · Añadir tests** · ⏱️ 30 min
  - **Qué:** Vitest con un test para `sum`.
  - **Por qué:** sin tests, ningún validador puede decir si el trabajo del agente está bien. Es el requisito número uno.
  - **Cómo:**
    1. `pnpm add -D vitest`.
    2. Crea `src/core/sum.test.ts` junto a `sum.ts`.
    3. Añade `"test": "vitest run"` a los scripts de `sandbox/package.json`.
  - **Hecho cuando:** `pnpm test` pasa, y si cambias el resultado esperado, falla con código distinto de 0.

- [ ] **0.4.4 · Añadir typecheck y lint de un fichero** · ⏱️ 20 min
  - **Qué:** los scripts `typecheck` y `lint:file`.
  - **Por qué:** el hook de la Etapa 2 necesita poder lintar un solo fichero, y el validador global necesita el typecheck.
  - **Cómo:** añade a `sandbox/package.json`:
    ```json
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "lint:file": "eslint"
    ```
    `pnpm lint:file src/core/sum.ts` pasará la ruta al final del comando.
  - **Hecho cuando:** `pnpm lint`, `pnpm lint:file src/core/sum.ts`, `pnpm typecheck`, `pnpm test` y `pnpm build` funcionan en `sandbox/`.

### ✅ Checkpoint 0.4
Dentro de `sandbox/`, los cinco comandos (`lint`, `lint:file`, `typecheck`, `test`, `build`) pasan. Y si metes un error a propósito en `sum.ts`, al menos uno de ellos falla.

---

## 🏁 Hito Etapa 0

- Commit con el mensaje `etapa-0: entorno, repo y sandbox` y etiqueta: `git tag etapa-0` y `git push --tags`.
- Línea en `CHANGELOG.md`: qué tienes y cuánto cupo gastó el ticket de prueba del repo original.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| `claude` no se reconoce tras instalar | Cierra y abre la terminal. Si sigue, revisa que la carpeta de instalación esté en el PATH |
| Claude Code se queja de que no encuentra bash | Reinstala Git for Windows y asegúrate de que Git Bash está en la ruta por defecto |
| `pnpm` no se reconoce | Ejecuta `corepack enable` en una terminal como administrador |
| Ejecutar el ticket de prueba se come tu cupo de 5 horas | Hazlo al empezar una sesión, no al final. Si se corta, `/rate-limit-options` te deja esperar y continuar |
