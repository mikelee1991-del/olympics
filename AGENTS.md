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
- Hero imagery loads from Unsplash; offline/egress-restricted environments may show a broken hero image, but standings/watchlist still work.
