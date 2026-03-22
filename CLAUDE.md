# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Run client (Vite on :5173) and worker (Wrangler on :5172) concurrently
npm run dev:client   # Client only
npm run dev:worker   # Worker only
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm run build:images # Rebuild processed images (src/images.ts using sharp)
pnpm test            # Run Playwright e2e tests (requires dev server running)
pnpm test --grep "test name"  # Run a single test
```

Tests use Playwright (`tests/`) against the running dev server at `http://localhost:5173`. Fixtures in `tests/fixtures.ts` navigate to `/?new` for a fresh room.

## Architecture

This is a real-time collaborative board game application for *Arcs* (the board game), built on [tldraw](https://tldraw.dev/) with two deployable pieces:

- **Client** (`src/`) — React 19 + Vite app, deployed to Vercel
- **Worker** (`worker/`) — Cloudflare Worker + Durable Object, handles WebSocket sync and R2 asset storage

### Client (`src/`)

- `App.tsx` — generates/reads a room ID from URL params (`?room=...`)
- `Room.tsx` — mounts `<Tldraw>` with custom shapes, bindings, tools, actions, and UI overrides; connects to worker via `useSync`
- `setup.ts` — initial board setup (called once per new room: places map, cards, chapter marker, etc.)
- `multiplayerAssetStore.tsx` — uploads assets to R2 via `POST /uploads/:filename`, retrieves via the same URL

UI is heavily stripped: toolbar, style panel, selection UI all hidden/replaced. Only game-relevant tools remain.

### Worker (`worker/`)

- `worker.ts` — itty-router entry point; routes `/connect/:roomId` (WebSocket) and `/uploads/:filename` (R2 asset CRUD)
- `TldrawDurableObject.ts` — one instance per room; manages `TLSocketRoom` in memory, persists room state to R2, handles WebSocket lifecycle

Worker URL defaults to `http://localhost:5172` in dev; set `TLDRAW_WORKER_URL` env var for production.

### Custom Shapes (`src/shapes/`)

18 custom tldraw shape types organized by game concept:

- **Player pieces** (`player/`): `agent`, `ship`, `board`, `city`, `starport`, `power`
- **Game mechanics**: `card`, `cardHolder`, `die`, `initiative`, `block`, `resource`, `stack`
- **Campaign/story**: `ambition`, `ambitionDeclared`, `chapter`, `map`

Each shape follows the tldraw pattern: a `*ShapeUtil` class (geometry, rendering, behavior) exported from `src/shapes/index.ts` alongside its migration record.

Two custom bindings: `CardHolderBinding` (cards snap to card holder shapes) and `StackBinding` (shapes stack together).

### Data Flow

1. Client connects to `wss://worker/connect/:roomId` via tldraw's `useSync`
2. `TldrawDurableObject` loads room state from R2 on first connect, broadcasts changes via `TLSocketRoom`
3. All shape mutations flow through tldraw's CRDT sync — no separate API calls for game state
4. Assets (images) uploaded directly to R2; URL returned and stored in the tldraw document
