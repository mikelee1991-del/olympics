# AGENTS.md

## Cursor Cloud specific instructions

### Service

Single Vite + React frontend (`pnpm dev` on port **5173**, bound to `0.0.0.0`). No backend, database, or Docker services are required.

### Commands

Standard scripts are in the root `package.json` / `README.md`:

- Lint: `pnpm lint` (oxlint)
- Test: `pnpm test` (Vitest)
- Dev: `pnpm dev`
- Build: `pnpm build`

### Notes

- Package manager is **pnpm** (`pnpm-lock.yaml`). Prefer it over npm/yarn.
- Watchlist state is stored in browser `localStorage` under key `olympics-watchlist`.
- Family schedule planner state is under `olympics-planner-v1` (sessions, tickets, attendees).
- Planner session times are **estimates** seeded from the spreadsheet medal calendar; edit times when real session times/tickets are known.
- Venue map uses OpenStreetMap tiles via Leaflet — needs network egress for tiles.
- Hero imagery on the medal demo tab loads from Unsplash; planner does not depend on it.
- `pnpm-workspace.yaml` must allow `esbuild` builds (`allowBuilds.esbuild: true`) for Vite.
