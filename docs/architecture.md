# kuvo-harness · Architecture

## Overview

kuvo-harness is a harness for Claude Code: a contract, validators, agents, skills, hooks and scripts that take a ticket through four phases (clarify, plan, implement, validate) and leave a checked result. It lives in its own repo and is installed in other projects; the only file that changes from one project to another is `harness.config.json`. The rule behind every piece is: the model proposes, a script checks, and only a script changes state.

Target layout of the repo. Most folders are still empty; `Components` says what exists today.

```
kuvo-harness/
├─ harness.config.json        the only file that changes between projects
├─ docs/
│  ├─ contracts.md            the single source of truth
│  ├─ architecture.md         the architecture of the harness itself (this file)
│  ├─ decisions.md            the decisions of the harness itself
│  ├─ run-metrics.md          measured time and cost
│  └─ roadmap/                the build plan, stage by stage (Spanish)
├─ .claude/
│  ├─ settings.json           permissions and hooks
│  ├─ agents/                 6 subagents
│  ├─ skills/                 the 4 phases, project start, discovery, milestones, roadmap, decisions, retro and support
│  ├─ hooks/                  lint after edit, journal capture
│  └─ scripts/                validators, journal, decisions, roadmap, profiles, token savers, Notion (plain Node)
├─ scripts/
│  ├─ factory.mjs             the factory: chains tickets according to the mode
│  ├─ headless.mjs            autopilot for one ticket
│  ├─ adversarial-review.mjs  two models argue over a diff
│  └─ install.mjs             installs the harness in another project
├─ templates/                 ticket template, per-layer CLAUDE.md and project docs
└─ sandbox/                   minimal project to test the harness against
```

## Components

One line per piece that exists. The list grows as each stage is finished.

- `docs/roadmap/` — the build plan: one file per stage, with phases, tasks and checkpoints.
- `docs/decisions.md` — the decision log, `ADR-001` onwards; append-only, written by hand until Stage 6.
- `docs/architecture.md` — this map; one `Changelog` line per finished stage.
- `CHANGELOG.md` — what each stage adds to the harness, one line per milestone.
- `CLAUDE.md` — working rules for the agent that builds this repo.
- `package.json` — root manifest, no dependencies; `pnpm test` runs `node --test` over `.claude/` and `scripts/`.
- `.gitattributes` — LF line endings for every text file.
- `.claude/skills/iniciar-fase/`, `.claude/skills/cerrar-fase/` — build skills to open and close a roadmap phase; they are not part of the product and the installer does not copy them.
- `sandbox/` — React, TypeScript and Vite project with three layers (`src/core`, `src/ui`, `src/app`) and its own `lint`, `lint:file`, `typecheck`, `test` and `build` commands.
- `.claude/agents/`, `.claude/hooks/`, `.claude/scripts/`, `scripts/`, `templates/` — empty for now.

## Constraints

Rules that are not broken. Each one cites the decision it comes from.

- English for everything the harness installs or generates; no document mixes languages. (ADR-001)
- Phases, agents, artefacts, folders and ticket types use the fixed names; a rename needs a new decision. (ADR-002)
- Hooks and scripts are Node `.mjs`; no bash. (ADR-003)
- The harness's own tests are never part of a project's checks. (ADR-004)
- Checks are run by a script; there is no validator agent. (ADR-005)
- The harness lives in its own repo and reaches a project through the installer. (ADR-006)
- Nothing in skills, agents or scripts names a concrete project; project-specific values come from `harness.config.json`. (ADR-007)
- Scripts and hooks import only Node built-ins. (ADR-008)
- Search with `rg`, never `grep -r` or `find`; inside scripts, with Node's `fs`. (ADR-009)
- An agent's model comes from the active profile, `pro` or `max`. (ADR-010)
- A validator exists before the phase it checks. (ADR-011)
- The contract is the single source of truth; if an implementation disagrees with it, the implementation is wrong. (ADR-012)
- Defaults assume Next.js, TypeScript, Supabase and Vercel, and every default can be changed in the configuration. (ADR-013)
- Tickets come from the project roadmap, and their state returns to it by script. (ADR-014)
- Every living document has one owner and a validator. (ADR-015)
- Dates and times are set by a script, never by a model or by hand. (ADR-016)
- Whatever needs no judgement is done by a script. (ADR-017)
- No code without an approved plan, and no code before its tests; both are checked by script. (ADR-018)
- The schedule is computed by a script. (ADR-019)
- Agents never read Notion; the repo is copied to Notion, never the other way round. (ADR-020)
- The harness keeps its own decisions and architecture in the formats it installs. (ADR-021)
- The decision log is append-only and every entry has the five fields and the three subsections. (ADR-022)

## Changelog

- 2026-11-11 17:31 · manual · Stage 0 done: Windows environment, the original harness run end to end, this repo and a three-layer sandbox with lint, types, tests and build.
