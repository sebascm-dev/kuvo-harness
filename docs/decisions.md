# kuvo-harness · Decisions

## ADR-001 · English for everything the harness ships, Spanish for the build log
- Date: 2026-11-11 17:28 (Europe/Madrid)
- Ts: 2026-11-11T16:28:50.097Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Language is part of the context a model works with. Validators look for headings by exact text, so a document that mixes languages breaks them, and prompts written in two languages confuse the model. The harness is also meant to be installed in other projects, where its documents are read by agents. The roadmap recommends English for prompts, artefacts and code (`docs/roadmap/etapa-1-contrato.md`, task 1.1.1).

### Decision
English for everything the harness installs or generates: agent prompts, skills, `docs/contracts.md`, `docs/decisions.md`, `docs/architecture.md`, ticket artefacts, code, comments and commit messages. Headings and bodies are both in English; no document mixes languages.

Spanish for what belongs to building the harness and is not part of the product: conversations with the user, the roadmap in `docs/roadmap/`, `CHANGELOG.md` and the two build skills (`iniciar-fase`, `cerrar-fase`).

### Consequences
- Headings are stable strings, so validators can compare them by exact text.
- The root `CLAUDE.md` is still in Spanish; it is rewritten in Phase 1.5.
- The user reads the harness documents in English, which costs a little more effort than Spanish.
- A project that installs the harness can keep its own product language; this decision only fixes the language of the harness files.

## ADR-002 · Names of phases, agents, artefacts, folders and ticket types
- Date: 2026-11-11 17:29 (Europe/Madrid)
- Ts: 2026-11-11T16:29:20.086Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Validators, hooks and skills refer to each other by name. A name changed halfway through the build breaks all of them at once, so the names are fixed before anything is written. The starting point is the original repo (`nucliweb/harness-engineering-biznagafest`, `docs/contracts.md` §3, §4, §8 and §9); a name changes only when there is a clear reason. This entry is the design note that roadmap task 1.1.2 asks for: it lives in the repo, not in an external note.

### Decision
Phases, in order, with the skill that runs each one. The short name is the value used in the journal.

| Phase | Short name | Skill |
|---|---|---|
| 1 | `clarify` | `spec-clarify` |
| 2 | `plan` | `spec-plan` |
| 3 | `implement` | `spec-implement` |
| 4 | `validate` | `spec-validate` |

Other skills: `project-conventions`, `spec-help`, `spec-retro`, `project-start`, `project-roadmap`, `discovery-ingest`, `milestone-review`.

Agents: `explorer`, `plan-auditor`, `developer`, `reviewer`, `design-qa`, `analyst`.

Ticket artefacts, in `specs/<TICKET>/`: `00-clarification.md`, `01-research.md`, `02-design.md`, `03-plan.md`, `04-dod.md`, `05-design-qa.md`, `journal.jsonl`, `BLOCKED.md`. Across tickets, in `specs/`: `lessons.json`, `retro.md`.

Folders of the harness repo: `docs/`, `.claude/agents/`, `.claude/skills/`, `.claude/hooks/`, `.claude/scripts/`, `scripts/`, `templates/`, `sandbox/`. Folders the harness creates in a project: `.claude/`, `discovery/`, `docs/`, `tickets/`, `specs/`. The configuration file is `harness.config.json`, at the project root.

Ticket types: `feature` and `fix`. A ticket is the file `tickets/<TICKET>.md` and its id matches `^[A-Z]+-\d+$`, with the prefix `FEATURE` or `FIX`.

Files: scripts and hooks are kebab-case `.mjs`; the test of `<name>.mjs` is `<name>.test.mjs`, next to it.

Changes from the original, each with its reason:

| Original | Here | Reason |
|---|---|---|
| `developer-package` | `developer` | A layer is whatever the configuration says; it is not always a package of a monorepo |
| `reviewer-package` | `reviewer` | Same reason |
| `monorepo-conventions` | `project-conventions` | The harness is installed in projects that are not monorepos |
| `validator-global` | removed | The checks are run by a script, not by an agent (ADR-005) |
| none | `analyst` | New agent for the discovery stage: reads transcripts and documents and extracts requirements |
| none | `project-start`, `project-roadmap`, `discovery-ingest`, `milestone-review` | New skills for the pieces the original does not have |
| `*.sh` | `*.mjs` | No bash in hooks or scripts (ADR-003) |

Everything else keeps the name it has in the original.

### Consequences
- `docs/contracts.md` (Phase 1.2) copies these names; from then on the contract is the source of truth and this entry is history.
- The `actor` values of the journal follow the agent names above.
- Renaming anything on this list later needs a new decision that supersedes this one.
- The names of individual scripts are not listed here; they follow the file rule above and are indexed in the contract.

## ADR-003 · Hooks and scripts in Node, never bash
- Date: 2026-11-11 17:29 (Europe/Madrid)
- Ts: 2026-11-11T16:29:56.387Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
First of the three changes to the original reviewed in roadmap task 1.1.3. The original ships three bash files: `.claude/hooks/post-edit-eslint.sh`, `scripts/headless.sh` and `scripts/adversarial-review.sh`. Running it on native Windows in Stage 0 showed the cost: 34 of its 174 `node --test` tests fail, all of them tests of bash scripts or of Unix paths, and `headless.sh` only starts in Git Bash with `MSYS2_ARG_CONV_EXCL="/spec-"`, because Git Bash turns the argument `/spec-clarify FIX-1` into a Windows path (`docs/roadmap/etapa-0-preparacion.md`, tasks 0.2.1 and 0.2.5). The roadmap index lists the same rule under its design decisions.

### Decision
Change it: yes. Every hook and script of the harness is a Node ES module (`.mjs`). No `.sh` file, and no hook or script that needs bash to run.

### Consequences
- The harness behaves the same on Windows, macOS and Linux.
- The three bash files of the original are rewritten, not copied: `post-edit-eslint`, `headless` and `adversarial-review` become `.mjs`.
- Scripts start child processes through Node, so quoting and path handling are written once, in Node, instead of depending on the shell.

## ADR-004 · The harness's own tests stay out of a project's checks
- Date: 2026-11-11 17:29 (Europe/Madrid)
- Ts: 2026-11-11T16:29:56.396Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Second of the three changes reviewed in task 1.1.3. In the original, the root `pnpm test` runs the product's Vitest suites and then `node --test` over the harness scripts (its `docs/contracts.md` §1). In Stage 0 the test ticket `FIX-1` ended with verdict `RED` and a `BLOCKED.md`, although lint, types, build, contracts and the 108 Vitest tests of the product passed: the only failure was the `node --test` half, in tests of the harness itself (`docs/roadmap/etapa-0-preparacion.md`, task 0.2.5). A ticket was blocked by something its change did not touch.

### Decision
Change it: yes. The verdict of a ticket depends only on the project's own commands, the ones declared in `harness.config.json`. The harness's own tests run in the harness repo with the root `pnpm test` (`node --test` over `.claude/` and `scripts/`) and are never part of a ticket's checks.

### Consequences
- A defect in the harness cannot turn a project ticket `RED`; it is found in the harness repo, where it can be fixed.
- The root `package.json` already follows this: its `test` script covers only `.claude/**/*.test.mjs` and `scripts/**/*.test.mjs`, and the sandbox runs its own Vitest suite.
- The sandbox needs its own `test` command in the configuration (Phase 1.3).

## ADR-005 · Checks are run by a script, not by a validator agent
- Date: 2026-11-11 17:29 (Europe/Madrid)
- Ts: 2026-11-11T16:29:56.397Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Third of the three changes reviewed in task 1.1.3. The original uses an agent, `validator-global` (Haiku), to run the root scripts and the validators and to write `04-dod.md` (its `docs/contracts.md` §8). Running commands and copying their result needs no judgement, and a model that reports the result can report it wrong. The roadmap index states the alternative: there is no validator agent, `run-checks.mjs` does the work.

### Decision
Change it: yes. There is no validator agent. `run-checks.mjs` runs lint, typecheck, test and build from the configuration and writes the result; `validate-dod.mjs` checks the format of `04-dod.md`.

### Consequences
- Whether the code works is stated by the exit code of a command, never by a model.
- Phase 4 spends no tokens on running checks.
- The harness has six agents, none of them a validator (ADR-002).
- `run-checks.mjs` and `validate-dod.mjs` are built in Stage 3, before any phase skill exists.

## ADR-006 · The harness lives in its own repo and is installed in projects
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.869Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index (`docs/roadmap/00-indice.md`, "Decisiones de diseño"). In the original, the harness and the product share one repo, so the harness cannot be reused without copying it by hand.

### Decision
The harness is its own repo, `kuvo-harness`. A project gets it through an installer, `scripts/install.mjs`.

### Consequences
- It is written once and reused in every project.
- Nothing in the harness may name a concrete project (ADR-007).
- The installer and its update path are work of their own (Stage 10).
- `sandbox/` is the project the harness is tested against while it is built.

## ADR-007 · Everything project-specific comes from `harness.config.json`
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.878Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. In the original, layers, commands and thresholds are written by hand inside skills and scripts. Each project has different layers and commands.

### Decision
Layers, commands, thresholds, interface file extensions, the migrations path and models are read from `harness.config.json`. Skills, agents and scripts contain no project-specific value.

### Consequences
- The same harness works in any project by changing one file.
- Every script reads the configuration through a single reader (Phase 1.3).
- Layer boundary rules are generated from the configuration, not written by hand (Phase 1.4).

## ADR-008 · Scripts have no external dependencies
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.879Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. The original follows the same rule: its scripts must run with nothing installed, so a fresh clone can validate artefacts before `pnpm install`.

### Decision
Harness scripts and hooks use only Node 24 built-ins. No npm package is imported.

### Consequences
- They run right after cloning or installing, with no install step.
- The root `package.json` has no dependencies.
- What a package would give for free (argument parsing, YAML front matter, globbing) is written by hand or taken from Node built-ins.

## ADR-009 · Search with ripgrep; inside scripts, with Node
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.880Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. `rg` is faster than `grep` and skips what Git ignores, so an agent does not fill its context with `node_modules`. Scripts cannot assume that any program is installed (ADR-008).

### Decision
Agents and people search with `rg` or the agent's own search tool; never `grep -r` or `find`. Scripts search with Node's `fs`.

### Consequences
- `rg` is a requirement of the development machine (installed in Stage 0), not of the scripts.
- The permission rules allow `rg` and do not need `grep` or `find` (Phase 1.6).

## ADR-010 · Two model profiles, Pro and Max
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.881Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. The right model for each agent depends on the subscription plan, and the plan can change.

### Decision
Each agent's model comes from a profile, `pro` or `max`, selected with `set-profile.mjs`. No agent file fixes a model by hand.

### Consequences
- Changing plan is one command, not a rewrite.
- The profile table lives in the contract and the configuration.
- `set-profile.mjs` is built in Stage 4.

## ADR-011 · Validators before phases
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.882Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. A phase built before its validator has nothing to tell it whether its output is right.

### Decision
Validators, the journal and block handling are built in Stage 3; agents and phase skills come after, in Stages 4 and 5.

### Consequences
- Every phase is validated from its first run.
- Fixtures of valid and invalid artefacts are written before any agent produces a real one.

## ADR-012 · Contract first
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.883Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. The original wrote its contract before any agent, and its first line settles every disagreement.

### Decision
`docs/contracts.md` is written before any agent, skill or script, and is the single source of truth. If a contract and an implementation disagree, the implementation is wrong.

### Consequences
- A change of format starts in the contract and then reaches the code, never the other way round.
- When two documents disagree, the contract wins.
- The contract is written in Phase 1.2.

## ADR-013 · Default stack: Next.js, TypeScript, Supabase and Vercel
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.884Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. It is the stack of the user's own projects.

### Decision
Defaults and templates assume Next.js, TypeScript, Supabase and Vercel. Every one of them can be changed in the configuration.

### Consequences
- Supabase migrations get their own gate, Gate M: a plan that touches the migrations folder always needs the user's decision.
- The sandbox is a smaller project (React and Vite), which checks that the harness does not depend on the default stack.

## ADR-014 · The project roadmap rules over the tickets
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.885Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. Planning kept in two places drifts apart.

### Decision
A project is planned once, in its `docs/roadmap.md`. Tickets are generated from the roadmap, and their state goes back to it through `sync-roadmap.mjs`.

### Consequences
- Nobody edits the state of a task by hand.
- Which ticket comes next is decided by `next-ticket.mjs`, from the order and dependencies of the roadmap.
- Built in Stage 6.

## ADR-015 · Every document has an owner and a validator
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.886Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. Documentation that is updated by hand goes out of date.

### Decision
Each living document is written by one piece of the process and checked by a validator script.

### Consequences
- A document that does not pass its validator stops the phase that depends on it.
- This file and `docs/architecture.md` are written by hand until Stage 6; from then on, by script.

## ADR-016 · Dates are set by a script, never by a model
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.887Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. A model does not know what time it is and can make it up.

### Decision
Every date and time in the harness comes from `stamp()`. No date is typed by a model or by hand.

### Consequences
- `stamp()` is built in Stage 6. Until then, dates are read from the system clock with a command; the dates of this file were filled that way.
- Tests fix the clock with `HARNESS_NOW`, so they are repeatable.

## ADR-017 · Mechanical work is always done by a script
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.888Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. Tokens are spent on reading long texts and on writing what a script could generate.

### Decision
Whatever needs no judgement is done by a script: ids, state, context packs, trimmed command output, repository maps. The model does only what needs judgement: understanding, designing, programming and reviewing.

### Consequences
- More scripts to write and test.
- The model proposes, a script checks, and only a script changes state.
- Lower and more predictable token cost.

## ADR-018 · SDD and TDD, checked by script
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.889Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. An agent can claim that something works without having proved it.

### Decision
An agent cannot program without an approved plan, and cannot write code before its tests. The validators enforce the first; `tdd-check.mjs` enforces the second by requiring a red run before each green one and comparing the fingerprint of each test.

### Consequences
- Phase 3 is slower, and its result can be trusted.
- A test changed after it went red is detected.
- Built in Stages 3 and 5.

## ADR-019 · The schedule is computed by a script
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.890Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. Notion draws Gantt charts but does not compute dependencies, resources or the critical path, and a model would give different dates each time.

### Decision
`schedule.mjs` computes dates, the critical path and delays from the roadmap and the available capacity.

### Consequences
- The same roadmap and the same capacity always give the same dates.
- Neither Notion nor a model decides a date.
- Built in Stage 6.

## ADR-020 · Notion only shows progress; the work lives in the repo
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.891Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. An agent that reads Notion spends quota going back and forth, and a second place to edit state creates conflicts.

### Decision
Agents never read Notion. `notion-sync.mjs` copies the state of the repo to Notion when a phase starts or ends, and never the other way round. One panel shows every repo.

### Consequences
- The repo is the only place where work and state are edited.
- If Notion is unreachable, the factory keeps working.
- The Notion key lives in the `NOTION_TOKEN` environment variable, never in a file.

## ADR-021 · The harness uses its own documents
- Date: 2026-11-11 17:30 (Europe/Madrid)
- Ts: 2026-11-11T16:30:46.892Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Design decision taken from the roadmap index. A format that is good enough for the harness itself is good enough for any project, and decisions that are not written down with their date and reason are forgotten.

### Decision
From Stage 1 the harness repo keeps its own `docs/decisions.md` and `docs/architecture.md`, in the formats it will install in projects. Design notes of the harness live in these files, not in an external note tool.

### Consequences
- The formats are tried on a real case before they are automated in Stage 6.
- Each finished stage adds a line to the `Changelog` of `docs/architecture.md`.
- Nothing about the harness depends on what an agent remembers from another session.

## ADR-022 · Decision entries carry five fields from the first entry
- Date: 2026-11-11 17:33 (Europe/Madrid)
- Ts: 2026-11-11T16:33:12.980Z
- Status: accepted
- Source: manual
- Supersedes: None

### Context
Roadmap task 1.1.4 shows an entry with three fields (`Date`, `Status`, `Source`) and says it is the format that Stage 6 automates. The Stage 6 format has five: it adds `Ts` and `Supersedes`, and its validator requires all five and a `Ts` later than the previous entry (`docs/roadmap/etapa-6-documentos.md`, tasks 6.1.4 and 6.3.3). This file is append-only, so entries written with three fields could not be fixed later without rewriting it.

### Decision
Every entry has, in this order, `Date`, `Ts`, `Status`, `Source` and `Supersedes`, followed by `### Context`, `### Decision` and `### Consequences`. `Date` is local time with its time zone; `Ts` is the same instant in UTC, ISO 8601. `Supersedes` is the id of the decision it replaces, or `None`.

### Consequences
- The entries written before `decision-append.mjs` exists already pass the Stage 6 validator, with no rewrite.
- The contract must state the same field list and the literal `None` when it defines this format.
- Until `stamp()` exists, `Date` and `Ts` are read from the system clock by a command, one read per entry.
