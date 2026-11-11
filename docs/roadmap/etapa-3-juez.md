# ⚖️ Etapa 3 · El juez

**Objetivo:** construir todo lo que decide sin IA: los validadores de cada artefacto, el escritor del journal y el de bloqueos. Primero el juez, luego los jugadores.

**Al acabar tendrás:** 4 validadores, `journal-append.mjs`, `write-blocked.mjs` y los scripts que ahorran tokens (`trim-output`, `run-checks`, `plan-check`, `diff-pack` y `repo-map`), todos en Node puro, con fixtures y tests. Funcionan nada más clonar el repo, sin instalar nada.

**Requisitos previos:** Etapa 1 (contrato con los títulos de cada artefacto, lector de configuración).
**Tiempo:** 17–20 h.

> 💡 **La regla 3 de la charla:** "Si dices que un documento debe tener N campos, tiene que haber un script que los busque. La validación de un modelo no es una validación." Esta etapa es esa regla convertida en código.

> 🧪 **Cómo se trabaja aquí:** escribe primero los fixtures (ejemplos buenos y malos) y los tests, y después el validador. Es la forma más segura: sabes qué tiene que pasar antes de escribir el código.

---

## Fase 3.1 · Utilidades comunes

- [ ] **3.1.1 · Lector de Markdown por secciones** · ⏱️ 60 min
  - **Qué:** `.claude/scripts/lib/markdown.mjs`, con una función `parseSections(texto)` que devuelve el título de nivel 1 y la lista de secciones de nivel 2, cada una con su título y su contenido.
  - **Por qué:** todos los validadores necesitan saber qué títulos hay, en qué orden y qué hay dentro de cada uno. Escribirlo una vez evita 4 versiones con 4 fallos distintos.
  - **Cómo:**
    1. Recorre el texto línea a línea.
    2. Las líneas que empiezan por `## ` abren una sección nueva; lo que viene después, hasta la siguiente, es su contenido.
    3. Ignora los `##` que estén dentro de bloques de código (entre líneas de tres comillas invertidas).
    4. Normaliza los finales de línea de Windows (`\r\n`) antes de nada.
  - **Hecho cuando:** con el `00-clarification.md` del repo original devuelve las 6 secciones con su contenido.
  - **Referencia:** `.claude/scripts/lib/`

- [ ] **3.1.2 · Tests del lector de Markdown** · ⏱️ 30 min
  - **Qué:** tests para los casos difíciles.
  - **Por qué:** si este lector falla, fallan los 4 validadores.
  - **Cómo:** casos: texto con `\r\n`, `##` dentro de un bloque de código, sección vacía, título con espacios al final, sin título de nivel 1.
  - **Hecho cuando:** los 5 casos pasan.

- [ ] **3.1.3 · Ayudante de informe** · ⏱️ 20 min
  - **Qué:** `.claude/scripts/lib/report.mjs`, que recoge fallos y termina el script con 0 (válido) o 1 (inválido), imprimiendo cada fallo en una línea.
  - **Por qué:** todos los validadores responden igual. El agente y el piloto automático solo tienen que leer el código de salida.
  - **Cómo:** una función `createReport()` con `fail(mensaje)` y `finish()`. Cada fallo dice qué regla se rompió y en qué sección: `FAIL Open questions: debe ser "- None"`.
  - **Hecho cuando:** un script de prueba con un fallo imprime la línea y sale con 1; sin fallos, imprime `OK` y sale con 0.

### ✅ Checkpoint 3.1
`pnpm test` en verde con los tests del lector de Markdown y del informe.

---

## Fase 3.2 · `validate-clarification.mjs`

- [ ] **3.2.1 · Fixtures** · ⏱️ 30 min
  - **Qué:** en `.claude/scripts/fixtures/clarification/`, un fichero válido y uno inválido por cada regla.
  - **Por qué:** cada fixture inválido falla por **una sola** razón. Así, si un test falla, sabes exactamente qué regla está rota.
  - **Cómo:** `valid.md` y, por ejemplo: `missing-heading.md`, `wrong-order.md`, `empty-section.md`, `open-question.md`, `wrong-title.md`.
  - **Hecho cuando:** existen los 6 ficheros.
  - **Referencia:** `.claude/scripts/fixtures/clarification/`

- [ ] **3.2.2 · Tests** · ⏱️ 20 min
  - **Qué:** un test por fixture que comprueba el código de salida y el mensaje.
  - **Por qué:** los escribes antes del validador, así sabes cuándo has terminado.
  - **Cómo:** `valid.md` → 0; cada inválido → 1 y el mensaje menciona la regla.
  - **Hecho cuando:** los tests existen y fallan (todavía no hay validador).
  - **Referencia:** `.claude/scripts/validators.test.mjs`

- [ ] **3.2.3 · El validador** · ⏱️ 45 min
  - **Qué:** `.claude/scripts/validate-clarification.mjs <ruta>`.
  - **Por qué:** es lo que decide si la fase 1 ha terminado bien.
  - **Cómo:** comprueba con las utilidades de la Fase 3.1:
    1. El título de nivel 1 es `# <TICKET> · Clarification` y el ticket cumple `ticketPattern`.
    2. Están los 6 títulos de nivel 2 exactos y en orden.
    3. Ninguna sección está vacía.
    4. `Open questions` contiene exactamente `- None`.
  - **Hecho cuando:** los 6 tests pasan.
  - **Referencia:** `.claude/scripts/validate-clarification.mjs`

### ✅ Checkpoint 3.2
`node .claude/scripts/validate-clarification.mjs` sobre el `00-clarification.md` del repo original sale con 0 (si cambiaste títulos, adapta una copia).

---

## Fase 3.3 · `validate-design.mjs`

- [ ] **3.3.1 · Fixtures** · ⏱️ 30 min
  - **Qué:** `valid.md` y un inválido por regla en `fixtures/design/`.
  - **Por qué:** igual que antes: un fallo, una razón.
  - **Cómo:** casos: falta un título, una sola alternativa, una decisión sin `Status: closed.`, aparece `TBD`, aparece `TODO`, aparece `open question`.
  - **Hecho cuando:** existen los 7 ficheros.

- [ ] **3.3.2 · Tests y validador** · ⏱️ 60 min
  - **Qué:** los tests y `.claude/scripts/validate-design.mjs <ruta>`.
  - **Por qué:** garantiza que el diseño llega cerrado al plan. Si queda una decisión abierta, el developer acabará decidiendo por su cuenta.
  - **Cómo:**
    1. Títulos exactos y en orden.
    2. Cuenta los subtítulos `### A<n>` dentro de `Alternatives`: al menos 2.
    3. Cada línea de `Decisions` que empieza por `- D` termina en `Status: closed.`
    4. Busca `TBD`, `TODO` y `open question` en todo el texto, sin importar mayúsculas.
  - **Hecho cuando:** todos los tests pasan.
  - **Referencia:** `.claude/scripts/validate-design.mjs`

### ✅ Checkpoint 3.3
El `02-design.md` del original (o tu copia adaptada) pasa, y si cambias una decisión a `Status: open.` falla con un mensaje claro.

---

## Fase 3.4 · `validate-plan.mjs`

El validador más importante y el más largo. Por eso va troceado en cinco reglas.

- [ ] **3.4.1 · Fixtures** · ⏱️ 45 min
  - **Qué:** `valid.md` y un inválido por regla en `fixtures/plan/`.
  - **Por qué:** este validador tiene muchas reglas; sin un fixture por regla, es imposible saber qué falla.
  - **Cómo:** al menos: falta un título, paso sin ruta, paso con formato roto, capa con pasos pero sin interfaz, línea de DoD sin `WHEN`, `Blocking: 2` en la auditoría, tabla de alcance que miente sobre los ficheros, veredicto `Single PR` que debería ser `Split`.
  - **Hecho cuando:** existen los 9 ficheros.
  - **Referencia:** `.claude/scripts/fixtures/plan/`

- [ ] **3.4.2 · Regla 1: títulos y capas** · ⏱️ 30 min
  - **Qué:** títulos exactos y que cada `###` dentro de `Steps`, `Interfaces` y `Definition of done` sea una capa de la configuración.
  - **Por qué:** las capas salen de `harness.config.json`, no están escritas en el validador. Es lo que lo hace reutilizable.
  - **Cómo:** carga las capas con `loadConfig()` y compara.
  - **Hecho cuando:** pasan los tests de títulos y de capa desconocida.

- [ ] **3.4.3 · Regla 2: pasos** · ⏱️ 45 min
  - **Qué:** cada línea de `Steps` cumple el formato `- [ ] S<n> \`<ruta>\` — <instrucción>` (o `- [x]`, o `- None`).
  - **Por qué:** un paso sin fichero concreto obliga al developer a decidir, y eso es lo que el plan debía evitar.
  - **Cómo:** usa una expresión regular. Ejemplo para que la entiendas:
    ```js
    // - [ ] S3 `src/core/sum.ts` — devuelve a + b
    //   │    │   │                │
    //   │    │   │                └─ instrucción (al menos un carácter)
    //   │    │   └─ ruta entre comillas invertidas
    //   │    └─ número de paso
    //   └─ casilla vacía o marcada
    const STEP = /^- \[( |x)\] S(\d+) `([^`]+)` — (.+)$/;
    ```
    Comprueba también que cada capa con pasos tiene su bloque de interfaz, salvo si sus pasos son `- None`.
  - **Hecho cuando:** pasan los tests de paso sin ruta, formato roto y capa sin interfaz.

- [ ] **3.4.4 · Regla 3: Definition of done y auditoría** · ⏱️ 30 min
  - **Qué:** cada línea de `Definition of done` empieza por `WHEN`, y la línea de `Audit` tiene `Blocking: 0`.
  - **Por qué:** una DoD sin formato EARS no se puede comprobar; un plan con bloqueantes no puede pasar a implementar.
  - **Cómo:** para la auditoría, busca `Blocking: (\d+)` y exige que sea 0.
  - **Hecho cuando:** pasan los tests de DoD y de auditoría.

- [ ] **3.4.5 · Regla 4: Gate B por script** · ⏱️ 60 min
  - **Qué:** el validador recuenta los ficheros distintos de los pasos, lee la tabla de `Scope check` y comprueba que el veredicto es honesto.
  - **Por qué:** en la charla, el modelo quitó un fichero CSS del plan para pasar la puerta. La respuesta fue que el script recuente él mismo y rechace un plan cuyas cifras no cuadren.
  - **Cómo:**
    1. Cuenta rutas distintas en `Steps`.
    2. Lee la tabla de `Scope check`: ficheros, líneas, capas y símbolos nuevos.
    3. Si los ficheros de la tabla no coinciden con tu recuento → fallo.
    4. Calcula el veredicto con los umbrales de `gateB` en la configuración. Si no coincide con el escrito → fallo.
  - **Hecho cuando:** pasan los tests de "tabla que miente" y "veredicto equivocado".
  - **Referencia:** `.claude/scripts/validate-plan.mjs`

- [ ] **3.4.6 · Regla 5: Gate M (migraciones)** · ⏱️ 20 min
  - **Qué:** si `migrationsPath` está configurado y algún paso toca esa carpeta, el validador lo marca como `NEEDS_DECISION` (sale con 1 y lo dice), salvo que el plan tenga la línea `Migration approved: yes`.
  - **Por qué:** una migración de base de datos nunca debe colarse sin que la apruebes tú.
  - **Cómo:** compara cada ruta de los pasos con `migrationsPath`.
  - **Hecho cuando:** un fixture con un paso en `supabase/migrations/` falla, y el mismo con la línea de aprobación pasa.

### ✅ Checkpoint 3.4
`pnpm test` en verde con todos los casos del plan. Y el `03-plan.md` del original, con la configuración del original, pasa.

---

## Fase 3.5 · `validate-dod.mjs` (tuyo, no está en el original)

- [ ] **3.5.1 · Fixtures, tests y validador** · ⏱️ 60 min
  - **Qué:** un validador para `04-dod.md`.
  - **Por qué:** en el original lo rellena un agente barato (Haiku) y nadie comprueba que el veredicto cuadre con los resultados. Un `GREEN` con un `FAIL` en la tabla sería un desastre silencioso.
  - **Cómo:**
    1. Títulos exactos: `Checks`, `Suppressions`, `Verdict`.
    2. La tabla de `Checks` tiene las filas lint, typecheck, test, build y contracts, cada una con `PASS`, `FAIL` o `SKIPPED`.
    3. Veredicto coherente: cualquier `FAIL` → tiene que ser `RED`; sin fallos y con supresiones → `GREEN WITH SUPPRESSIONS`; sin nada → `GREEN`.
  - **Hecho cuando:** pasan los tests de veredicto incoherente, fila que falta y resultado inventado.

### ✅ Checkpoint 3.5
Un `04-dod.md` con un `FAIL` y veredicto `GREEN` es rechazado.

---

## Fase 3.6 · Journal y bloqueos

- [ ] **3.6.1 · `journal-append.mjs`: argumentos y validación** · ⏱️ 45 min
  - **Qué:** el script que añade una línea al journal: `node .claude/scripts/journal-append.mjs --ticket FEATURE-1 --phase implement --actor developer --kind autofix_failed --summary "..."`.
  - **Por qué:** en la charla, el journal nunca lo escribe un agente a mano. Así siempre tiene el formato correcto.
  - **Cómo:**
    1. Lee los argumentos con `parseArgs` de `node:util`.
    2. Valida `ticket` con `ticketPattern` y `phase`, `actor` y `kind` contra las listas del contrato.
    3. `summary` es obligatorio; `detail` y `files` son opcionales.
  - **Hecho cuando:** un `kind` inventado sale con 1 y dice cuáles son válidos.
  - **Referencia:** `.claude/scripts/journal-append.mjs`

- [ ] **3.6.2 · `journal-append.mjs`: fecha, privacidad y escritura** · ⏱️ 45 min
  - **Qué:** poner la fecha, ocultar datos sensibles y añadir la línea.
  - **Por qué:** la fecha la pone el script para que nadie la invente. Y el journal se sube a Git: no puede llevar correos ni claves.
  - **Cómo:**
    1. `ts` con `new Date().toISOString()`.
    2. Sustituye por `[redacted]` los correos y lo que parezca una clave (`sk-`, `ghp_`, `Bearer `, 32 o más caracteres hexadecimales seguidos).
    3. Crea la carpeta `specs/<TICKET>/` si no existe y añade la línea con `appendFileSync`. Nunca reescribas el fichero.
  - **Hecho cuando:** un `summary` con un correo queda guardado como `[redacted]`.

- [ ] **3.6.3 · Tests del journal** · ⏱️ 30 min
  - **Qué:** tests en una carpeta temporal.
  - **Por qué:** el journal es la memoria del sistema. Si escribe mal, las lecciones de la Etapa 8 salen mal.
  - **Cómo:** casos: línea válida, campo inválido, correo ocultado, clave ocultada, dos llamadas seguidas dejan dos líneas (nunca reescribe).
  - **Hecho cuando:** los 5 tests pasan.
  - **Referencia:** `.claude/scripts/journal-append.test.mjs`

- [ ] **3.6.4 · `write-blocked.mjs`** · ⏱️ 30 min
  - **Qué:** un script que escribe `specs/<TICKET>/BLOCKED.md` con el formato del contrato: `node .claude/scripts/write-blocked.mjs --ticket FEATURE-1 --reason NEEDS_DECISION --summary "..." --report-file informe.txt`.
  - **Por qué:** cuando algo para la factoría, siempre se para igual. El piloto automático solo tiene que mirar si existe este fichero.
  - **Cómo:** valida el motivo contra la lista del contrato, escribe el fichero y, además, añade una línea `blocked` al journal llamando a la función de `journal-append`.
  - **Hecho cuando:** genera el fichero con el formato exacto y un motivo inventado sale con 1.

- [ ] **3.6.5 · Tests de bloqueos** · ⏱️ 20 min
  - **Qué:** tests de `write-blocked.mjs`.
  - **Por qué:** igual que todo lo demás del juez.
  - **Cómo:** casos: motivo válido, motivo inválido, y que también deja la línea en el journal.
  - **Hecho cuando:** los 3 tests pasan.

### ✅ Checkpoint 3.6
Llama a mano a `journal-append.mjs` y a `write-blocked.mjs` para un ticket inventado y mira los ficheros que quedan en `specs/`. Bórralos después.

---

## Fase 3.7 · Scripts que ahorran tokens

> 💡 **Dónde se van los tokens:** no en ejecutar comandos, sino en que el modelo **lea textos largos** (logs, diffs, ficheros enteros) y **escriba texto que un script podría generar** (copiar pasos, marcar casillas, rellenar tablas). Lo que escribe un modelo cuesta varias veces más que lo que lee. Cada script de esta fase quita al modelo un trabajo mecánico.

- [ ] **3.7.1 · Las reglas de economía de tokens** · ⏱️ 15 min
  - **Qué:** una sección del contrato con 4 reglas que cumplirán todas las skills y agentes.
  - **Por qué:** sin reglas escritas, cada skill que escribas en las Etapas 5 a 7 volverá a hacer a mano cosas que ya tienes en script.
  - **Cómo:** escribe estas reglas:
    1. Ningún modelo copia texto que un script puede extraer (pasos del plan, interfaces, normas de una capa).
    2. Ninguna salida de un comando entra en el contexto sin recortar.
    3. Ningún agente ejecuta comandos solo para rellenar una plantilla: eso es un script.
    4. Antes de abrir ficheros, se lee el mapa del código.
  - **Hecho cuando:** la sección existe en el contrato.

- [ ] **3.7.2 · `trim-output.mjs`** · ⏱️ 45 min
  - **Qué:** un recortador que deja solo los fallos de la salida de Vitest, ESLint y TypeScript, con un máximo de líneas.
  - **Por qué:** una ejecución de tests en verde puede soltar cientos de líneas. El agente solo necesita saber qué falló y dónde.
  - **Cómo:**
    1. Lee la salida (de un fichero o de la entrada estándar) y detecta de qué herramienta es.
    2. Quédate con: qué test o fichero falló, el mensaje y las 5 primeras líneas de cada error.
    3. Máximo 60 líneas en total; si hay más, termina con "y N errores más".
    4. Añade a `run.mjs` la opción `--trim`, que pasa la salida por aquí. El hook de lint de la Etapa 2 también lo usa.
  - **Hecho cuando:** la salida de un test con 2 fallos entre 100 que pasan queda en menos de 20 líneas, con los 2 fallos.

- [ ] **3.7.3 · `run-checks.mjs`: la validación sin modelo** · ⏱️ 60 min
  - **Qué:** `node .claude/scripts/run-checks.mjs <ID>`, que ejecuta lint, typecheck, test, build y los validadores del ticket, y escribe `04-dod.md` él solo.
  - **Por qué:** en el original esto lo hace un agente (`validator-global`, con Haiku). Ejecutar comandos y rellenar una tabla no necesita un modelo: con un script, el coste es **cero**.
  - **Cómo:**
    1. Ejecuta cada comando con `run.mjs` y apunta `PASS` o `FAIL`.
    2. Fila `contracts`: pasa los validadores de los artefactos del ticket y comprueba que no queda ningún `[ ]` en el plan.
    3. Detecta supresiones de lint nuevas en el diff (`eslint-disable`) y las lista.
    4. Calcula el veredicto, escribe `04-dod.md` con la fecha de `stamp()` y pasa `validate-dod.mjs` sobre él.
    5. Si hay fallos, imprime un resumen recortado con `trim-output`. Sale con 0 si es `GREEN` y con 1 si es `RED`.
  - **Hecho cuando:** con un test roto escribe un `04-dod.md` en `RED` que pasa su validador.

- [ ] **3.7.4 · `plan-check.mjs`** · ⏱️ 20 min
  - **Qué:** `node .claude/scripts/plan-check.mjs <ID> S1 S2`, que marca esos pasos como `[x]` en `03-plan.md`.
  - **Por qué:** marcar casillas editando el plan obliga al modelo a leerlo y reescribir trozos. Con el script, una línea de comando.
  - **Cómo:** cambia solo esas casillas, nunca otra cosa del fichero. Si un paso no existe, sale con 1.
  - **Hecho cuando:** marca dos pasos y `git diff` muestra solo esas dos líneas.

- [ ] **3.7.5 · `diff-pack.mjs`** · ⏱️ 30 min
  - **Qué:** un diff limpio: `node .claude/scripts/diff-pack.mjs --layer core` o `--range main..HEAD`.
  - **Por qué:** los diffs incluyen ficheros de bloqueo de paquetes, ficheros generados y capturas que el revisor no necesita leer, y que pueden ocupar más que el código.
  - **Cómo:** empieza con un resumen (`git diff --stat`); excluye `pnpm-lock.yaml`, `package-lock.json`, `dist/`, `*.snap` y lo que añadas en `harness.config.json` (`diffExclude`); filtra por la ruta de la capa; máximo de líneas configurable, avisando de lo que se cortó.
  - **Hecho cuando:** un cambio que toca el `pnpm-lock.yaml` y un fichero de código muestra solo el código.

- [ ] **3.7.6 · `repo-map.mjs`** · ⏱️ 60 min
  - **Qué:** un mapa compacto del código: por cada capa, sus ficheros y lo que exporta cada uno, una línea por fichero.
  - **Por qué:** el `explorer` y `/spec-plan` se orientan leyendo el mapa en vez de abrir decenas de ficheros. Es la forma más barata de "conocer el repo".
  - **Cómo:**
    1. Recorre las carpetas de las capas de la configuración.
    2. Saca los `export` de cada fichero con una expresión regular (no hace falta entender TypeScript entero):
       ```js
       // export function sum(a, b)  ·  export const total = …  ·  export type Player = …
       const EXPORT = /^export\s+(?:default\s+)?(?:async\s+)?(function|const|class|type|interface)\s+(\w+)/gm;
       ```
    3. Escribe `specs/.cache/repo-map.md`: `src/core/sum.ts — function sum, function average`.
    4. Solo lo regenera si algún fichero cambió (compara fechas de modificación), así casi siempre es instantáneo.
  - **Hecho cuando:** sobre el sandbox, el mapa cabe en una pantalla y lista todas las funciones exportadas.

- [ ] **3.7.7 · Tests** · ⏱️ 60 min
  - **Qué:** tests de los cinco scripts con fixtures en `fixtures/tokens/`.
  - **Por qué:** si `trim-output` se come un error o `run-checks` pone `GREEN` con un fallo, ahorrar tokens sale carísimo.
  - **Cómo:** casos: salida de cada herramienta recortada sin perder fallos; `run-checks` en verde y en rojo con comandos falsos; `plan-check` con paso inexistente; `diff-pack` excluye lockfiles; `repo-map` encuentra los exports y no se regenera si nada cambió.
  - **Hecho cuando:** `pnpm test` en verde con al menos 10 casos nuevos.

### ✅ Checkpoint 3.7
Ejecuta `run-checks.mjs` sobre un ticket inventado del sandbox con un test roto: tienes un `04-dod.md` en `RED`, válido, y un resumen de fallos de pocas líneas, sin haber gastado un solo token.

---

## Fase 3.8 · Cierre del juez

- [ ] **3.8.1 · Todos los tests en un comando** · ⏱️ 15 min
  - **Qué:** que `pnpm test` en la raíz ejecute todos los tests de `.claude/`.
  - **Por qué:** un solo comando para saber si el juez está sano.
  - **Cómo:** en el `package.json` raíz, `"test": "node --test \".claude/**/*.test.mjs\" \"scripts/**/*.test.mjs\""`. La ruta explícita evita que Node intente ejecutar también los tests del sandbox, que son de Vitest.
  - **Hecho cuando:** `pnpm test` ejecuta todo y está en verde.

- [ ] **3.8.2 · Comprobar que no hay dependencias** · ⏱️ 10 min
  - **Qué:** que ningún script de `.claude/` importe paquetes externos.
  - **Por qué:** tienen que funcionar en cualquier proyecto nada más instalar el harness, antes de `pnpm install`.
  - **Cómo:** busca `from '` en `.claude/` y comprueba que todos los imports empiezan por `node:` o son rutas relativas.
  - **Hecho cuando:** no hay ningún import externo.

- [ ] **3.8.3 · README de los scripts** · ⏱️ 30 min
  - **Qué:** `.claude/scripts/README.md` con una tabla: script, cómo se llama, qué comprueba, qué devuelve.
  - **Por qué:** las skills de la Etapa 5 dirán a los agentes qué script usar. Esta tabla es su manual.
  - **Cómo:** una fila por script, con un ejemplo de uso.
  - **Hecho cuando:** cada script tiene su fila.
  - **Referencia:** `.claude/scripts/README.md`

### ✅ Checkpoint 3.8
`pnpm test` en verde. Cuenta cuántos tests tienes y apúntalo. Pídele a Claude que revise los validadores buscando una forma de "engañarlos" (un artefacto malo que pase): si encuentra una, añade el fixture y arréglalo.

---

## 🏁 Hito Etapa 3

- Commit `etapa-3: validadores, journal y bloqueos` y etiqueta `etapa-3`.
- `CHANGELOG.md`: número de tests y las trampas que encontró Claude en el checkpoint final.

## ⚠️ Riesgos de esta etapa

| Riesgo | Qué hacer |
|---|---|
| Los validadores fallan con artefactos buenos por los finales de línea de Windows | Normaliza `\r\n` a `\n` al leer, siempre, en el lector de Markdown |
| El guion largo `—` de los pasos no coincide | Los modelos a veces escriben `-` o `–`. Decide en el contrato si aceptas solo `—` o los tres, y que el validador lo diga claro |
| Te atascas en una expresión regular | Pide a Claude la expresión con 5 ejemplos que deben pasar y 5 que no, y conviértelos en tests |
| El validador del plan crece demasiado | Divide cada regla en una función propia en `lib/plan-rules.mjs`, con su test |
