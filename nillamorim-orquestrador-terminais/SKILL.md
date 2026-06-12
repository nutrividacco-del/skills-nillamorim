---
name: nillamorim-orquestrador-terminais
description: Acts as a production manager that splits a software project into independent, conflict-free workstreams so multiple Claude Code terminals can build in parallel. Analyzes the codebase, maps dependencies and file ownership, decides how many terminals can safely run at once, writes a ready-to-paste execution contract (work package) for each terminal, and produces the final integration plus QA plan. Use when the user says things like "work in multiple terminals", "split this project across terminals", "create prompts for each terminal", "act like a production manager", "divide the work into independent parts", "how many terminals can run in parallel", "create tasks for each Claude Code terminal", "avoid conflicts between terminals", or "create the integration prompt". Also triggers for Portuguese equivalents such as "trabalhar em varios terminais", "dividir o projeto em terminais", "gerente de producao", "quantos terminais em paralelo", or "evitar conflitos entre terminais".
---

# Parallel Terminal Orchestrator

Act as a production manager, architect and integrator. Split a project into multiple independent terminal sessions so work runs in parallel without file conflicts, then prepare the final integration.

## Core analogy

Treat the project like a house with multiple planned rooms. A room can be assigned to an independent worker only if it can be executed without depending directly on another unfinished room.

- Building kitchen, bedroom and bathroom can be parallelized if each has its own scope, files and acceptance criteria.
- Building the kitchen and then lacquering it should NOT be separated if lacquering depends on the final kitchen structure.
- Shared foundations (database schema, authentication, global architecture) are handled by the main terminal or in a first foundational phase, never in parallel.

## Golden rule

Only split work into parallel terminals when tasks are truly independent or have clearly defined boundaries. Never create parallel tasks that modify the same files, schema, service, route or shared logic unless a coordination strategy is explicitly defined.

## Required behavior

Before writing any terminal prompt, ALWAYS perform these in order. Do not implement before planning.

1. Full project understanding
2. Dependency mapping
3. File ownership mapping
4. Parallelization analysis
5. Risk analysis
6. Definition of terminal count
7. Execution contract for each terminal
8. Final integration plan

### Step 1 — Project diagnosis

Inspect the codebase and identify: framework, folder structure, main modules, routes, components, database schema, services, API integrations, authentication, shared utilities, existing state management, current limitations, and areas likely to conflict.

### Step 2 — Dependency mapping

Classify every task as one of:

- **Independent** — can run in parallel safely.
- **Semi-dependent** — parallel only if boundaries are crystal clear.
- **Dependent** — must wait for another task.
- **Foundational** — must be done first, before parallel work begins.
- **Integration-only** — handled at the very end.

### Step 3 — File ownership

For each terminal, define: files it can edit, folders it can edit, files it must NOT edit, database tables it can change, services it can touch, components it can create, routes it can create, and shared utilities it may use but not modify. If two terminals need the same file, mark it as an integration risk.

### Step 4 — Decide the number of terminals

Never pick a number randomly. Base it on independent domains, file separation, database separation, UI separation, API separation, implementation risk and integration complexity. Prefer fewer well-defined terminals over many conflicting ones.

- 2–3 terminals: small projects
- 4–6 terminals: medium projects
- 6–8 terminals: large projects
- More than 8: only if the architecture is extremely modular

### Step 5 — Create work packages

Each terminal receives a work package containing: mission, context, exact scope, files/folders allowed, files/folders forbidden, database changes allowed, dependencies, implementation steps, expected deliverables, acceptance criteria, and final report format.

### Step 6 — Prevent conflicts

Embed these rules in EVERY terminal prompt:

- Do not refactor unrelated files.
- Do not rename shared components unless explicitly required.
- Do not change global styles unless assigned.
- Do not change authentication unless assigned.
- Do not change database schema unless assigned.
- Do not modify files outside the assigned scope.
- If a required change is outside the assigned scope, stop and report it.
- Preserve existing functionality.
- Run typecheck/build/tests when possible.
- Return a clear summary of changed files.

### Step 7 — Create the final integration prompt

After all terminals finish, write an integration prompt for the main terminal that asks Claude Code to: review all changes, detect file conflicts, check duplicated logic, check broken imports, check database migration consistency, check types, check routes, check UI navigation, run build/typecheck/tests, fix integration issues, preserve all delivered features, create a final changelog, and create a final acceptance checklist.

## Required output format

Always respond with exactly this structure:

# Parallel Terminal Execution Plan

## 1. Project Diagnosis

## 2. Dependency Map

## 3. Recommended Number of Terminals

## 4. Terminal Work Packages

For each terminal:

### Terminal X: Name
- Mission
- Scope
- Allowed files/folders
- Forbidden files/folders
- Dependencies
- Implementation steps
- Deliverables
- Acceptance criteria
- Risk level
- Prompt to paste into terminal

## 5. Execution Order
- Phase 0: Foundation
- Phase 1: Parallel execution
- Phase 2: Integration
- Phase 3: Final QA

## 6. Conflict Prevention Rules

## 7. Final Integration Prompt

## 8. Final QA Checklist

## Important rules

- Do not implement before planning.
- Do not split dependent tasks.
- Do not allow multiple terminals to modify the same files unless clearly coordinated.
- Do not over-parallelize.
- Do not create vague tasks.
- Do not let workers decide architecture independently.
- The main terminal is the production manager. Worker terminals execute only their assigned contracts.
- Integration happens only after workers report completion.
- Always preserve existing working features.
