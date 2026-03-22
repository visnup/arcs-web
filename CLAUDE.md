# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style

Tight, concise, clever. Prefer short, apt, one-word variables over multi-word descriptors. Don't repeat context already established by scope or type. Be idiomatic tldraw and React.

## Commands

```bash
pnpm dev          # Run client (Vite on :5173) and worker (Wrangler on :5172) concurrently
pnpm dev:client   # Client only
pnpm dev:worker   # Worker only
pnpm build        # tsc -b && vite build
pnpm build:images # Rebuild processed images (src/images.ts using sharp)
pnpm lint         # ESLint
pnpm test         # Run Playwright e2e tests (requires dev server running)
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

16 custom tldraw shape types:

- **Player pieces** (`player/`): `agent`, `ship`, `board`, `city`, `starport`, `power`
- **Game mechanics**: `card`, `card-holder`, `die`, `initiative`, `block`, `resource`, `stack`
- **Campaign/story**: `ambition`, `ambition-declared`, `chapter`, `map`

Each shape is a `*ShapeUtil` class exported from `src/shapes/index.ts` alongside its migration record.

**Base class hierarchy:**
```
BaseBoxShapeUtil (tldraw)
  └── GameShapeUtil (game.tsx) — canSnap: false, canResize: false, default rect indicator
        └── StackableShapeUtil (stack.tsx) — adds auto-stack-on-drop behavior
```

Two custom bindings: `CardHolderBinding` (cards snap to and auto-layout within card holders) and `StackBinding` (same-type stackable pieces group into a stack shape showing count).

### Data Flow

1. Client connects to `wss://worker/connect/:roomId` via tldraw's `useSync`
2. `TldrawDurableObject` loads room state from R2 on first connect, broadcasts changes via `TLSocketRoom`
3. All shape mutations flow through tldraw's CRDT sync — no separate API calls for game state
4. Assets (images) uploaded directly to R2; URL returned and stored in the tldraw document
