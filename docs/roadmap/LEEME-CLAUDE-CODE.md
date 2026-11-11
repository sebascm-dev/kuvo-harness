# 🤖 Cómo usar este roadmap con Claude Code

## 1. Dónde ponerlo
Cuando crees tu repo `harness` (tarea 0.3.1), copia esta carpeta dentro:

```
harness/
└─ docs/
   └─ roadmap/          ← todo el contenido de este zip
      ├─ 00-indice.md
      ├─ 01-flujo-de-trabajo.md
      ├─ etapa-0-preparacion.md … etapa-11-produccion.md
      ├─ ROADMAP-COMPLETO.md
      └─ diagramas/
```

## 2. Cómo pedirle cada tarea
Una tarea por conversación (o por sesión), siempre igual:

```
Lee docs/roadmap/00-indice.md (solo "Determinista por diseño" y "Convenciones")
y la tarea 3.2.1 de docs/roadmap/etapa-3-juez.md.
Explícame primero qué vamos a hacer y por qué, y luego hazla conmigo paso a paso.
No pases a la siguiente tarea hasta que se cumpla su "Hecho cuando".
```

Así Claude solo lee lo que necesita (menos cupo) y tú aprendes cada pieza.

## 3. Reglas que conviene darle desde el principio
Añade esto al `CLAUDE.md` del repo `harness` en cuanto lo crees:

```markdown
## Cómo trabajamos en este repo
- El plan está en docs/roadmap/. Una tarea cada vez, en orden.
- Antes de escribir código, explica qué vas a hacer y por qué.
- Una tarea no está hecha hasta que se cumple su "Hecho cuando".
- Nada de dependencias externas en los scripts: Node 24 puro (.mjs).
- Windows: nada de bash en hooks ni scripts.
- Fechas y horas siempre con stamp(), nunca a mano.
- Para buscar: tu herramienta de búsqueda o `rg`; nunca `grep -r` ni `find`. Dentro de los scripts, solo `fs` de Node.
- Nunca hagas commit ni push: los hago yo.
```

## 4. Lo que no lees en el roadmap
- `ROADMAP-COMPLETO.md` es todo junto, para buscar. No se lo pases entero a Claude: gasta mucho cupo.
- Marca tu avance en Notion (base Tareas → Estado). Cuando montes la Etapa 6, será tu propio harness el que lo haga.
- Empieza por la Etapa 0 y no te saltes checkpoints.
