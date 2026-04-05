# Project State

> **Last Updated:** 2026-04-05
> **Purpose:** Single source of truth for the current state of the AsciiCanvas project. Update this file after every significant change.

## Project Identity

- **Name:** AsciiCanvas
- **Version:** 0.0.1
- **License:** MIT
- **Package Manager:** pnpm (workspaces monorepo)
- **Node.js:** 24
- **TypeScript:** 5.9

## Workspace Packages

| Package          | Name                            | Path                        | Description                        |
| ---------------- | ------------------------------- | --------------------------- | ---------------------------------- |
| api-server       | `@asciicanvas/api-server`       | `artifacts/api-server/`     | Express 5 API server               |
| ascii-editor     | `@asciicanvas/ascii-editor`     | `artifacts/ascii-editor/`   | React frontend (ASCII art editor)  |
| mockup-sandbox   | `@asciicanvas/mockup-sandbox`   | `artifacts/mockup-sandbox/` | React frontend (mockup preview)    |
| db               | `@asciicanvas/db`               | `lib/db/`                   | Drizzle ORM schema + DB connection |
| api-spec         | `@asciicanvas/api-spec`         | `lib/api-spec/`             | OpenAPI spec + Orval codegen       |
| api-zod          | `@asciicanvas/api-zod`          | `lib/api-zod/`              | Generated Zod schemas              |
| api-client-react | `@asciicanvas/api-client-react` | `lib/api-client-react/`     | Generated React Query hooks        |
| scripts          | `@asciicanvas/scripts`          | `scripts/`                  | Utility scripts                    |

## Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Monorepo    | pnpm workspaces                    |
| Language    | TypeScript 5.9                     |
| Frontend    | React 19 + Vite 7 + Tailwind CSS 4 |
| Backend     | Express 5                          |
| Database    | PostgreSQL + Drizzle ORM           |
| Validation  | Zod (v4)                           |
| API codegen | Orval                              |
| State       | TanStack React Query               |
| UI          | Radix UI + shadcn/ui               |

## Environment Variables

| Variable       | Required By                  | Description                  |
| -------------- | ---------------------------- | ---------------------------- |
| `PORT`         | All artifacts                | Port number to listen on     |
| `BASE_PATH`    | ascii-editor, mockup-sandbox | Base URL path (e.g., `/`)    |
| `DATABASE_URL` | api-server, lib/db           | PostgreSQL connection string |

## Root Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm run typecheck` | Typecheck all packages via `tsc --build` |
| `pnpm run build`     | Typecheck then build all packages        |

## Dev Commands

```bash
pnpm --filter @asciicanvas/ascii-editor run dev
pnpm --filter @asciicanvas/mockup-sandbox run dev
pnpm --filter @asciicanvas/api-server run dev
pnpm --filter @asciicanvas/db run push
pnpm --filter @asciicanvas/api-spec run codegen
```

## Key Configuration Files

| File                  | Purpose                                |
| --------------------- | -------------------------------------- |
| `pnpm-workspace.yaml` | Workspace config, catalog, overrides   |
| `tsconfig.base.json`  | Shared TypeScript compiler options     |
| `tsconfig.json`       | Root project references                |
| `.npmrc`              | pnpm config (auto-install-peers=false) |

## Current State Notes

- All `@workspace/*` package names migrated to `@asciicanvas/*`
- All Replit-specific files and packages removed
- No `.git` directory (was removed during cleanup)
- No `.env` files present — environment variables must be set manually
- `pnpm-lock.yaml` is up to date with 464 packages
- **Hand tool** added to ascii-editor (click-drag panning, `H` key)
- **Keybindings reorganized** — see dev-guide.md for current key map
- **New shortcuts**: Arrow keys (pan), Ctrl+A (select all)

## Known Issues

- API server dev script uses Unix syntax (`NODE_ENV=development tsx ...`) — fails on Windows
- `preinstall` script was removed from root `package.json` due to Windows `sh` incompatibility

## Editor Keybindings (ascii-editor)

| Key | Tool          | Key | Tool     |
| --- | ------------- | --- | -------- |
| `V` | Select        | `L` | Line     |
| `H` | Hand          | `A` | Arrow    |
| `B` | Box (single)  | `M` | Diamond  |
| `D` | Box (double)  | `T` | Text     |
| `O` | Box (rounded) | `F` | Freehand |
| `U` | Box (heavy)   | `G` | Fill     |
|     |               | `E` | Eraser   |

| Shortcut                  | Action                                      |
| ------------------------- | ------------------------------------------- |
| `Ctrl+Z`                  | Undo                                        |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo                                        |
| `Ctrl+C`                  | Copy ASCII to clipboard                     |
| `Ctrl+A`                  | Select all content                          |
| `Ctrl+E`                  | Toggle export modal                         |
| `Ctrl+0`                  | Reset view                                  |
| `Ctrl+Shift+F`            | Zoom to fit                                 |
| `[` / `]`                 | Zoom out / in                               |
| Arrow keys                | Pan canvas (20px)                           |
| `Home`                    | Reset view                                  |
| `Escape`                  | Clear selection / cancel text / close modal |
| `Delete` / `Backspace`    | Delete selection                            |
| Space+drag                | Pan canvas (any tool)                       |
| Middle-click+drag         | Pan canvas                                  |
| Ctrl+scroll               | Zoom (cursor-centered)                      |
| Scroll                    | Pan canvas                                  |
