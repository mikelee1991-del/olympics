# Olympics

Vite + React + TypeScript demo app: medal standings with a country watchlist.

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

## App behavior

- Browse sample Winter Games medal standings
- Filter by highlight sport
- Pin countries to a watchlist (persisted in `localStorage`)
