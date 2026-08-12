# AGENTS.md

Guidance for coding agents working on CourseTable. For human setup, see [CONTRIBUTING.md](CONTRIBUTING.md) and [README.md](README.md).

## Overview

CourseTable is Yale’s course exploration site. This repo is a Bun workspace with:

- `frontend/` — React + Vite app (coursetable.com)
- `api/` — Express API + Docker Compose (auth, worksheets, friends, etc.)

Course catalog data is crawled separately in [ferry](https://github.com/coursetable/ferry). Prefer changing the smallest surface that solves the task.

## Commands

Use **Bun**, never `npm` or `yarn` (except documented one-offs inside Docker such as `api` container `db:push`).

```sh
bun install                 # from repo root
bun run checks              # depcheck, format, lint, typecheck, frontend tests (what CI runs)
bun run checks:fix         # autofix format/lint where possible
bun run --cwd frontend test # Vitest
bun run --cwd frontend test -- src/path/to/file.test.ts
```

Local app (details in CONTRIBUTING.md):

```sh
cd api && ./start.sh -d     # backend (Docker); first time may need -f
cd frontend && ./start.sh   # https://localhost:3000
```

## Git & pull requests

- Base PRs on `master`.
- Use **lowercase conventional commits**, e.g. `fix: ...`, `feat: ...`, `chore: ...`, `refactor: ...`, `test: ...`, `docs: ...`.
- Prefer one logical change per PR.
- PR descriptions must follow [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md): fill **Summary** and **Test plan (required)**. Leave every pre-flight checklist item unchecked — the human author marks those. Small/straightforward changes may skip the template as noted there.
- Link issues with `Fixes #1234` when relevant.
- Do not commit unless asked; do not push with `--force` to `master`.

## Code conventions

- Match existing style in nearby files; do not introduce new libraries without a clear need.
- Prefer shared utilities (`frontend/src/utilities/`, API helpers) over copy-paste.
- Keep changes focused: no drive-by refactors (unrelated renames, formatting-only churn, or “while I’m here” cleanups outside the task).
- When changing pure logic, add or update Vitest unit tests when practical. There is little existing coverage and no Storybook/e2e suite — do not invent a large testing stack unless asked.
- API: Express handlers + Drizzle; reuse existing error code strings (`ALREADY_BOOKMARKED`, etc.) rather than inventing new ones casually.
- Secrets live in Doppler. Never commit `.env`, tokens, or credentials.

## Frontend React

Patterns already used in this repo; follow them rather than inventing a new stack.

**Architecture**

- Function components only (no class components, no `React.memo` by default).
- App state: Zustand slices under `frontend/src/slices/`, composed in `store.ts` (immer + persist). Prefer narrow selectors / `useShallow`.
- Catalog GraphQL: generated Apollo hooks. User/auth/worksheets/friends REST: `fetchAPI` via slice actions (or a cancelled effect when one-off).
- Local `useState` for ephemeral UI only.
- `eslint-plugin-react-compiler` is **error**-level — write compiler-friendly code (no mutating props/state, no conditional hooks, avoid patterns the rule flags). Inline event handlers are fine (`react/jsx-no-bind` is off); do not sprinkle `useCallback`/`useMemo` “for performance” unless a hot path needs it (search/calendar already do this selectively).

**Limit `useEffect`**

Prefer deriving values during render, event handlers, and store actions. Use effects mainly for:

- Subscribing to external systems (DOM events, persist hydration, maps) with cleanup — see `store.ts`, `WorksheetMap.tsx`
- Syncing to something outside React (e.g. `document.documentElement.dataset.theme`)
- One-off async with cancellation when not already in a slice/Apollo hook

Avoid:

- Props → local state sync effects (prefer controlled props or keyed remount). Don’t copy existing ones; leave old instances unless the task is to fix them
- Effects that only recompute derived data (compute in render or a selector)
- Missing dependency arrays (re-run every render) except rare intentional cases
- Putting business logic in effects when a Zustand action or click handler is clearer

## Do not

- Expand scope beyond what was asked.
- Rewrite working code for taste alone.
- Check in generated catalog dumps or large static assets unless the task requires it.

## Docs map

| Topic       | Where                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| Dev setup   | [CONTRIBUTING.md](CONTRIBUTING.md)                                     |
| Deploy      | [docs/deployment.md](docs/deployment.md)                               |
| API notes   | [docs/api.md](docs/api.md)                                             |
| PR template | [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) |
