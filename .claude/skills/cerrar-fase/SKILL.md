---
name: cerrar-fase
description: "Trigger: /cerrar-fase, cerrar fase, fin de sesión. Comprueba que todas las tareas de la fase de kuvo-harness están tachadas con su evidencia, pasa su checkpoint, lo documenta y deja preparado el commit, que hace el usuario."
argument-hint: "[n.º de fase opcional, p. ej. 0.2]"
disable-model-invocation: true
---

# Cierre de fase · kuvo-harness

Fase a cerrar: `$ARGUMENTS` (si está vacío, la fase en curso: la última con tareas tachadas). Confírmala y lista sus tareas antes de seguir.

**Las tareas ya se cierran una a una al terminar** ("Cierre de cada tarea" en `/iniciar-fase`): casilla `[x]`, fecha y línea **Comprobado**. Esta skill comprueba que no falta nada, pasa el checkpoint de la fase y, si es la última de su etapa, prepara el hito.

> Esta skill sirve para construir el propio harness. No forma parte del producto: `install.mjs` (Etapa 10) no debe copiarla a otros proyectos.

## Paso 1 — ¿Está cerrada cada tarea?

1. Por cada tarea de la fase, lee su bloque en el fichero de la etapa (`docs/roadmap/etapa-N-*.md`, o la raíz mientras la Fase 0.3 no lo haya movido): casilla `[x]`, fecha y línea **Comprobado**.
2. Una tarea terminada que no esté tachada: ciérrala ahora con el procedimiento de "Cierre de cada tarea" de `/iniciar-fase`, antes de seguir.
3. Vuelve a comprobar lo que una tarea posterior haya podido romper.
4. Si existe `package.json`, ejecuta `pnpm test`. Si falla, para.
5. **Tarea que no cumple su criterio: no se tacha.** Di qué falta y que decida el usuario: terminarla ahora o dejar la fase abierta. Una tarea `(opcional)` que el usuario decida saltarse se marca `[~]` con el motivo.

## Paso 2 — El checkpoint

1. Lee el `### ✅ Checkpoint N.M` de la fase y ejecútalo tal como está escrito, con evidencia y en PowerShell.
2. Lo que solo pueda demostrar el usuario ("sin mirar, sabes explicar…"), pídeselo: que lo explique él. No lo des por bueno.
3. **Si no se cumple, la fase no se cierra.** Di qué falta.
4. Si se cumple, añade una línea debajo del texto del checkpoint: `**Superado:** dd/mm · <evidencia en una línea>`. La fecha sale del reloj del sistema (`Get-Date -Format "dd/MM"`, o `stamp()` cuando exista).

## Paso 3 — Documentos

Cada documento, con lo que esta fase cambió en él. Solo los que ya existan:

- `CHANGELOG.md` (desde la tarea 0.3.5): apunta en la sección de la etapa los datos que su hito pedirá (número de tests, tiempos medidos, cupo gastado), para no tener que reconstruirlos al final.
- `docs/decisions.md` (desde la 1.1.4): las decisiones de la fase que falten por apuntar.
- `docs/architecture.md` (desde la 1.1.5): la sección `Components`, si la fase añadió piezas.
- `docs/contracts.md` (desde la Fase 1.2): si la fase cambió un formato, primero el contrato. Si contrato y código no coinciden, el código está mal.

## Paso 4 — ¿Se alcanza el hito de la etapa?

Si todas las fases de la etapa tienen su checkpoint **Superado**:

1. Lee la sección `🏁 Hito` de la etapa.
2. Escribe la línea de `CHANGELOG.md` que pide y, desde la Etapa 1, la línea del `Changelog` de `docs/architecture.md`.
3. Dile al usuario el commit y la etiqueta que le tocan (`git tag etapa-N` y `git push --tags`). No los hagas tú.

Si queda alguna fase abierta, dilo: el hito no se cumple todavía.

## Paso 5 — Commit (lo hace el usuario)

Si la carpeta ya es un repo Git: enseña `git status`, la lista de ficheros de la fase por nombre y un mensaje propuesto (conventional commit en inglés, sin atribución a la IA). Nunca ejecutes `git commit` ni `git push`.

## Paso 6 — Memoria

Engram: `mem_session_summary`. Es un resumen de la sesión, no la fuente de verdad: todo lo que haya que recordar del proyecto ya está escrito en los ficheros del repo.

## Informe final

Fase cerrada (o qué tareas quedan abiertas y por qué), checkpoint superado o no, documentos tocados, el commit que le toca al usuario y, si aplica, el hito. Conviene empezar la siguiente fase en una sesión nueva con `/iniciar-fase`: contexto limpio y menos cupo. No la empieces aquí sin que el usuario lo pida.
