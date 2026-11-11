# ⚡ Etapa 2 · Feedback inmediato

**Objetivo:** que el agente vea sus errores de lint en el mismo momento en que edita un fichero, no al final del ticket.

**Al acabar tendrás:** un hook en Node que, tras cada edición, pasa ESLint al fichero tocado y le devuelve el error al agente para que lo arregle al instante. Probado y funcionando en Windows.

**Requisitos previos:** Etapa 1 (configuración, fronteras de capas y permisos).
**Tiempo:** 4–5 h.

> 💡 **Por qué importa tanto:** en la charla es la primera pieza "determinista" del arnés. Un error de capas detectado en la línea 3 cuesta un arreglo; detectado al final del ticket, cuesta rehacer media capa.

---

## Fase 2.1 · Entender los hooks

- [ ] **2.1.1 · Leer cómo funcionan** · ⏱️ 20 min
  - **Qué:** la parte de hooks de su chuleta de Claude Code.
  - **Por qué:** antes de escribir uno, necesitas saber qué recibe y qué tiene que devolver.
  - **Cómo:** lee el apartado de hooks. Quédate con tres cosas:
    1. Claude Code le pasa al hook un JSON por la entrada estándar con `tool_name` y `tool_input.file_path` (ruta absoluta).
    2. Si el hook sale con código 0, todo bien.
    3. Si sale con código 2, lo que escriba en la salida de error le llega al modelo como aviso. La edición ya se hizo: es feedback, no un bloqueo.
  - **Hecho cuando:** sabes explicar qué pasa si el hook sale con 0, con 1 y con 2.
  - **Referencia:** `docs/claude-code-reference.md`

- [ ] **2.1.2 · Leer el hook original** · ⏱️ 15 min
  - **Qué:** su `post-edit-eslint.sh` y su test.
  - **Por qué:** el tuyo hace lo mismo, pero en Node para que funcione en Windows.
  - **Cómo:** léelo línea a línea y apunta qué hace cada bloque.
  - **Hecho cuando:** puedes describir sus pasos en una lista de 5 puntos.
  - **Referencia:** `.claude/hooks/post-edit-eslint.sh`, `.claude/hooks/post-edit-eslint.test.mjs`

- [ ] **2.1.3 · Capturar una entrada real** · ⏱️ 20 min
  - **Qué:** un hook de prueba que solo guarda lo que recibe en un fichero.
  - **Por qué:** ver el JSON real que te manda Claude Code en tu Windows (con sus rutas con barras invertidas) evita sorpresas.
  - **Cómo:**
    1. Crea `.claude/hooks/dump.mjs` que lea la entrada estándar y la escriba en `hook-dump.json`.
    2. Regístralo en `PostToolUse` con `"command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/dump.mjs\""`.
    3. Pídele a Claude que edite cualquier fichero del sandbox.
  - **Hecho cuando:** `hook-dump.json` contiene el JSON y has visto cómo viene la ruta. Después borra `dump.mjs`, su registro y el fichero.

### ✅ Checkpoint 2.1
Tienes delante un JSON real de tu máquina y sabes de dónde sacar la ruta del fichero editado.

---

## Fase 2.2 · Escribir el hook

- [ ] **2.2.1 · Leer la entrada y quedarse con la ruta** · ⏱️ 30 min
  - **Qué:** el comienzo de `.claude/hooks/post-edit-lint.mjs`.
  - **Por qué:** todo lo demás depende de saber qué fichero se ha editado.
  - **Cómo:** este es el esqueleto, con comentarios para que entiendas cada línea:
    ```js
    // post-edit-lint.mjs — se ejecuta tras cada Edit/Write del agente
    import { readFileSync } from 'node:fs';
    import path from 'node:path';

    // 1. Claude Code nos manda un JSON por la entrada estándar (fd 0)
    const input = JSON.parse(readFileSync(0, 'utf8'));

    // 2. La ruta viene absoluta y, en Windows, con barras invertidas
    const absPath = input.tool_input?.file_path;
    if (!absPath) process.exit(0); // nada que revisar: salimos en silencio

    // 3. La pasamos a relativa al proyecto y con barras normales
    const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
    const relPath = path.relative(projectDir, absPath).split(path.sep).join('/');
    ```
  - **Hecho cuando:** si imprimes `relPath` en la salida de error, sale algo como `sandbox/src/core/sum.ts`.

- [ ] **2.2.2 · Decidir si hay que revisar el fichero** · ⏱️ 20 min
  - **Qué:** filtrar por extensión y por capa.
  - **Por qué:** pasar ESLint a un `.md` o a un fichero fuera de las capas es tiempo perdido y ruido para el agente.
  - **Cómo:**
    1. Carga la configuración con `loadConfig()`.
    2. Calcula la ruta relativa a `projectRoot` (en el sandbox, `src/core/sum.ts`). Si queda fuera de `projectRoot` (empieza por `..`), sal con 0.
    3. Si la extensión no está en `lintExtensions`, sal con 0.
    4. Si la ruta no empieza por el `path` de ninguna capa, sal con 0.
  - **Hecho cuando:** editar un `.md` no lanza ESLint y editar `sandbox/src/core/sum.ts` sí.

- [ ] **2.2.3 · Ejecutar el lint** · ⏱️ 30 min
  - **Qué:** lanzar el comando `lintFile` de la configuración con la ruta del fichero, dentro de `projectRoot`.
  - **Por qué:** es el corazón del hook.
  - **Cómo:**
    ```js
    import { spawnSync } from 'node:child_process';

    // ESLint corre dentro de la carpeta del proyecto (projectRoot),
    // así que le pasamos la ruta relativa a esa carpeta.
    const result = spawnSync(`${config.commands.lintFile} "${fileInProject}"`, {
      cwd: path.resolve(projectDir, config.projectRoot),
      shell: true,        // necesario en Windows para encontrar pnpm
      encoding: 'utf8',
      timeout: 60_000,    // nunca más de un minuto
    });
    ```
  - **Hecho cuando:** con un error de lint, `result.status` es distinto de 0 y `result.stdout` tiene el mensaje de ESLint.

- [ ] **2.2.4 · Devolver el resultado al agente** · ⏱️ 20 min
  - **Qué:** salir con el código correcto y un mensaje útil.
  - **Por qué:** el mensaje es lo que lee el modelo. Si es claro, lo arregla a la primera.
  - **Cómo:**
    ```js
    if (result.status === 0) process.exit(0);

    // Código 2: Claude Code le enseña al modelo lo que escribamos aquí
    process.stderr.write(
      `ESLint encontró problemas en ${relPath}. Arréglalos ahora:\n` +
      (result.stdout || result.stderr)
    );
    process.exit(2);
    ```
    Recorta el mensaje a 30 líneas como máximo (y usa el formato compacto de ESLint si tu versión lo permite): cada línea que lee el modelo cuesta tokens, y con los primeros errores le basta para arreglar. En la Etapa 3 harás un recortador general (`trim-output.mjs`) y el hook lo usará.
    Si el comando ni siquiera arranca (por ejemplo, `pnpm` no existe), sal con 0 y avisa en la salida de error: un fallo del entorno no debe bloquear al agente.
  - **Hecho cuando:** con un error de lint sale con 2 y el mensaje incluye la regla rota; sin errores sale con 0.

### ✅ Checkpoint 2.2
A mano, sin Claude Code: `echo {"tool_input":{"file_path":"<ruta absoluta a sum.ts>"}} | node .claude/hooks/post-edit-lint.mjs` sale con 0 si el fichero está bien y con 2 si tiene un import prohibido. (En PowerShell, guarda el JSON en un fichero y usa `Get-Content entrada.json | node ...`.)

---

## Fase 2.3 · Probarlo con tests

- [ ] **2.3.1 · Preparar la configuración de test** · ⏱️ 20 min
  - **Qué:** un `harness.config.json` de prueba en `.claude/hooks/fixtures/` donde `lintFile` es un comando falso.
  - **Por qué:** los tests no deben depender de ESLint ni del sandbox. Un comando falso que siempre falla o siempre pasa hace los tests rápidos y fiables.
  - **Cómo:** dos fixtures: uno con `"lintFile": "node -e \"process.exit(0)\""` y otro con `"lintFile": "node -e \"console.log('error de prueba'); process.exit(1)\""`.
  - **Hecho cuando:** existen los dos fixtures.

- [ ] **2.3.2 · Escribir los tests** · ⏱️ 45 min
  - **Qué:** `.claude/hooks/post-edit-lint.test.mjs` con `node:test`.
  - **Por qué:** el hook se ejecuta cientos de veces. Si se rompe, el agente pierde su red de seguridad sin que te enteres.
  - **Cómo:** lanza el hook con `spawnSync('node', [hookPath], { input: JSON.stringify(entrada), env: { ...process.env, HARNESS_CONFIG: fixture } })` y comprueba el código de salida. Casos mínimos:
    1. Fichero `.md` → sale con 0 y no ejecuta nada.
    2. Fichero fuera de las capas → 0.
    3. Fichero de capa con lint correcto → 0.
    4. Fichero de capa con lint fallido → 2 y el mensaje incluye "error de prueba".
    5. Entrada sin `file_path` → 0.
    6. Ruta de Windows con barras invertidas → se normaliza bien.
  - **Hecho cuando:** `pnpm test` pasa con los 6 casos.
  - **Referencia:** `.claude/hooks/post-edit-eslint.test.mjs`

### ✅ Checkpoint 2.3
`pnpm test` en verde. Rompe a propósito el hook (por ejemplo, que salga siempre con 0) y comprueba que el test 4 falla. Deshaz el cambio.

---

## Fase 2.4 · Conectarlo y probarlo de verdad

- [ ] **2.4.1 · Registrar el hook** · ⏱️ 10 min
  - **Qué:** la entrada en `.claude/settings.json`.
  - **Por qué:** sin registrarlo, Claude Code no lo ejecuta.
  - **Cómo:**
    ```json
    "hooks": {
      "PostToolUse": [{
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/post-edit-lint.mjs\""
        }]
      }]
    }
    ```
  - **Hecho cuando:** dentro de Claude Code, `/hooks` muestra el hook en `PostToolUse`.
  - **Referencia:** `.claude/settings.json`

- [ ] **2.4.2 · Prueba real con un error de capas** · ⏱️ 15 min
  - **Qué:** pedirle al agente algo que rompa una frontera.
  - **Por qué:** es la prueba que de verdad importa: que el agente lo vea y lo corrija solo.
  - **Cómo:** en Claude Code: "En `sandbox/src/core/sum.ts`, importa el componente `Total` de la capa ui y úsalo en un comentario". Observa qué pasa.
  - **Hecho cuando:** el agente recibe el error del hook y deshace o corrige el import sin que se lo digas.

- [ ] **2.4.3 · Prueba de que no estorba** · ⏱️ 10 min
  - **Qué:** editar ficheros que no deberían disparar nada.
  - **Por qué:** un hook que salta cuando no toca hace perder tiempo y cupo.
  - **Cómo:** pídele que edite el `README.md` y un fichero `.css`.
  - **Hecho cuando:** ninguna de las dos ediciones produce aviso.

- [ ] **2.4.4 · Medir lo que tarda** · ⏱️ 10 min
  - **Qué:** cuánto tarda el hook en un fichero del sandbox.
  - **Por qué:** se ejecuta tras cada edición. Si tarda 10 segundos, un ticket con 40 ediciones pierde 7 minutos.
  - **Cómo:** en PowerShell, `Measure-Command { Get-Content entrada.json | node .claude/hooks/post-edit-lint.mjs }`.
  - **Hecho cuando:** sabes el tiempo y lo apuntas en el `CHANGELOG.md`. Si pasa de 5 segundos, apúntalo como mejora pendiente.

### ✅ Checkpoint 2.4
El agente corrige solo un import prohibido gracias al hook, y editar Markdown o CSS no dispara nada.

---

## 🏁 Hito Etapa 2

- Commit `etapa-2: hook de lint tras cada edición` y etiqueta `etapa-2`.
- `CHANGELOG.md`: tiempo medio del hook y el resultado de la prueba real.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| `$CLAUDE_PROJECT_DIR` no se expande en Windows | Prueba con la ruta relativa `node .claude/hooks/post-edit-lint.mjs`, o pon la ruta absoluta de tu repo en la configuración local |
| El hook no encuentra `pnpm` | Usa `shell: true` en `spawnSync`. Si sigue, prueba a lanzar `npx pnpm` |
| Bucle: el agente arregla, el hook vuelve a fallar, y así sin parar | Asegúrate de que el mensaje explica qué regla se rompió y por qué. Si en la prueba real pasa de 3 vueltas, revisa el mensaje |
| ESLint es lento en ficheros grandes | Lo normal es 1–3 segundos. Si es mucho más, revisa que no estés lintando todo el proyecto en vez de un fichero |
