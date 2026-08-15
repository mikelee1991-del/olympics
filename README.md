# LA 2028 Olympics

Vite + React + TypeScript app for **Los Angeles 2028 Summer Olympics** family
ticket planning (plus a small summer medal-table demo).

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/) 9+ (or enable via `corepack enable`)

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

App runs at http://localhost:5173

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Vite dev server |
| `pnpm lint` | Run oxlint |
| `pnpm test` | Run Vitest once |
| `pnpm build` | Typecheck and production build |
| `pnpm preview` | Preview production build |

## Schedule planner

Default tab: interactive family schedule seeded from `Olympics_Scheduling.xlsx` medal days for sports people ranked.

- Set each session to **have** / **want** / **skip** tickets
- Toggle attendees (Mike + family)
- Edit date/time/venue (times start as estimates)
- Map shows active venues (Leaflet / OSM)
- Conflict panel lists per-person double-books and tight long-distance travel

State persists in `localStorage` (`olympics-planner-v1`).

## Medal demo

Secondary tab with sample standings + country watchlist.
