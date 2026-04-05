# Agent Log

> **Purpose:** Chronological record of all agent actions taken on this project. Append new entries at the top.

---

## 2026-04-05 — Added hand tool and improved keybindings

**Agent:** opencode

**Hand Tool:**

- Added `hand` tool type in `types.ts`
- Implemented click-drag panning in `InfiniteCanvas.tsx` (no Space key needed)
- Shows `grab`/`grabbing` cursor, no cell highlighting on hover
- Added hand button with SVG icon to `Toolbar.tsx`
- Added hand tool label and hint to `StatusBar.tsx`

**Keybinding Reorganization:**

- `V` = Select, `H` = Hand (new)
- `B` = Box single (was R), `U` = Box heavy (was H)
- `G` = Fill (was B)
- Updated shortcut pills in TopBar to reflect new keys

**New Shortcuts:**

- Arrow keys — pan canvas 20px per press
- Ctrl+A — select all content on canvas
- Updated `.agents/project-state.md` with full keybinding reference

---

## 2026-04-05 — Created agent documentation files

**Agent:** opencode

Created `.agents/` documentation:

- `project-state.md` — Project state reference
- `agent-log.md` — This file
- `dev-guide.md` — Development guide for agents

---

## 2026-04-05 — Created README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT

**Agent:** opencode

Created root documentation files:

- `README.md` — Project overview, stack, structure, getting started
- `LICENSE` — MIT License
- `CONTRIBUTING.md` — Contribution guidelines
- `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1

---

## 2026-04-05 — Fixed remaining @workspace references

**Agent:** opencode

Updated remaining `@workspace/*` references to `@asciicanvas/*`:

- `artifacts/mockup-sandbox/package.json` — name changed to `@asciicanvas/mockup-sandbox`
- `scripts/src/hello.ts` — log message updated
- `artifacts/api-server/src/routes/health.ts` — import updated
- `package.json` — removed broken `preinstall` script
- Clean reinstalled `node_modules` to purge old references

---

## 2026-04-05 — Cleaned Replit packages and code

**Agent:** opencode

Removed all Replit traces from source files:

- `pnpm-workspace.yaml` — removed 3 `@replit/*` catalog entries and replit comment
- `artifacts/ascii-editor/package.json` — removed 3 `@replit/*` devDeps
- `artifacts/mockup-sandbox/package.json` — removed 2 `@replit/*` devDeps
- `artifacts/ascii-editor/vite.config.ts` — removed Replit imports + REPL_ID block
- `artifacts/mockup-sandbox/vite.config.ts` — removed Replit imports + REPL_ID block
- `artifacts/ascii-editor/src/components/ui/button.tsx` — removed `// @replit` comments
- `artifacts/ascii-editor/src/components/ui/badge.tsx` — removed `// @replit` comments

---

## 2026-04-05 — Deleted Replit files and .git

**Agent:** opencode

Deleted:

- `.replit`
- `.replitignore`
- `replit.md`
- `.local/`
- `.git/`

Preserved:

- `.agents/`

---

## 2026-04-05 — Initial project setup

**Agent:** opencode

- Installed dependencies via `pnpm install` (464 packages)
- Identified and started dev servers for ascii-editor (port 5173) and mockup-sandbox (port 5174)
- Identified Windows compatibility issue with api-server dev script
