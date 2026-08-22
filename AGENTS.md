# AGENTS.md

## Cursor Cloud specific instructions

### Product

Los Angeles **2028 Summer Olympics / Paralympics** family ticket planner (not Winter Games).
Olympic schedule is July 2028; Paralympic schedule is August 2028.

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
- Family schedule planner state is under `olympics-planner-v6-alloc` (Olympic + Paralympic sessions, tickets, attendees, free/boat access, purchased Olympic tickets seated by sport interest only). Older planner keys are ignored after bumps; Hard reset clears all `olympics-planner-*` keys.
- Olympic seed times come from the LA28 **Competition Schedule by Event V4.0** PDF (`src/data/officialSessions.json`). Paralympic seed/placeholder times come from **Paralympic By Event V3.2** (`src/data/paralympicSessions.json`) — all Para seeded sessions start as **want** (no tickets yet). Calendar toggles Olympics · July vs Paralympics · August.
- Owned tickets (`src/data/ownedTickets.ts`) seat only people who ranked that sport on **first insert** — open seats stay empty (no padding). `mergeOwnedTickets` keeps saved attendees/notes on reload. Free / boat sessions start with **no attendees** (opt-in). Conflicts UI labels each side as Ticketed / Free course / Free w/ boat (plus `n/qty seats` when purchased).
- Conflicts use drive + parking exit/enter + contingency (`src/lib/travel.ts`). Free course events (marathon, race walk, road cycling) and boat-viewable water sports are tagged in `src/data/access.ts`.
- Venue map uses OpenStreetMap tiles via Leaflet — needs network egress for tiles. Pins live in `src/data/venues.ts` (audited against OSM/Wikipedia; **2028 Stadium = SoFi in Inglewood**, not Exposition Park).
- `pnpm-workspace.yaml` must allow `esbuild` builds (`allowBuilds.esbuild: true`) for Vite.
- `.cursor/environment.json` declares port 5173 for Cursor Agents Window forwarding.
- Production static host: GitHub Pages via `.github/workflows/deploy-pages.yml` (set `GITHUB_PAGES=true` for `/olympics/` base path).
- **Always merge to `main` when work is done.** Prefer merging the feature PR (not leaving it as draft). `.github/workflows/auto-merge-agent-prs.yml` auto-merges open `cursor/*` → `main` PRs. After merge, Pages redeploys from `main`.
