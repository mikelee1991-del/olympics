# LA 2028 Olympics

Vite + React + TypeScript app for **Los Angeles 2028 Summer Olympics** family
ticket planning (plus a small summer medal-table demo).

## Live site (GitHub Pages)

After Pages is enabled on this repo:

**https://mikelee1991-del.github.io/olympics/**

> The repo must be **public** (or on GitHub Pro) for Pages to be publicly reachable.
> In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

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

Split into focused tabs:

| Tab | Purpose |
| --- | --- |
| **Calendar** | July 2028 month grid + day agenda |
| **Sessions** | Have / Want / Skip tickets and attendees |
| **Map** | Venue pins for the selected day |
| **Conflicts** | Per-person double-books and drive+parking “can’t make it” |

Seed sessions use official LA28 By Event V4.0 clock times (`src/data/officialSessions.json`).
**Free** tags = LA28 non-ticketed course events; **Free w/ boat** = open-water sports viewable from a boat.
State persists in `localStorage` (`olympics-planner-v4-owned`).

## Medal demo

Secondary tab with sample standings + country watchlist.
