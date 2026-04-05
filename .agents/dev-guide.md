# Development Guide for Agents

> **Purpose:** Instructions and conventions for AI agents working on this project. Read this before making changes.

## Before Making Changes

1. Read `.agents/project-state.md` to understand the current state
2. Read `.agents/agent-log.md` to see recent changes
3. Update both files after completing your work

## Project Conventions

### Package Naming

All packages use the `@asciicanvas/` scope:

- `@asciicanvas/api-server`
- `@asciicanvas/ascii-editor`
- `@asciicanvas/mockup-sandbox`
- `@asciicanvas/db`
- `@asciicanvas/api-spec`
- `@asciicanvas/api-zod`
- `@asciicanvas/api-client-react`
- `@asciicanvas/scripts`

**Never** use `@workspace/*` — that was the old scope.

### TypeScript

- All packages extend `tsconfig.base.json` which sets `composite: true`
- Always run typecheck from root: `pnpm run typecheck`
- Running `tsc` inside a single package will fail if dependencies haven't been built
- `emitDeclarationOnly` — only `.d.ts` files are emitted; JS bundling is done by esbuild/vite/tsx

### Package Manager

- **Always use pnpm**, never npm or yarn
- Root `package.json` has a `preinstall` guard that rejects non-pnpm (if present)
- Add dependencies: `pnpm --filter <package> add <dep>`
- Add dev dependencies: `pnpm --filter <package> add -D <dep>`
- Use `catalog:` for versions defined in `pnpm-workspace.yaml`
- Use `workspace:*` for internal package references

### Code Style

- No comments unless explicitly requested
- Follow existing code conventions in the file being edited
- Use TypeScript for all new code
- Keep components focused and single-responsibility

### Windows Compatibility

- This project runs on Windows — avoid Unix-only shell syntax
- Do NOT use `NODE_ENV=development command` syntax — use PowerShell `$env:NODE_ENV='development'; command` instead
- The api-server dev script currently has this issue and needs fixing

## Common Tasks

### Running a dev server

```bash
pnpm --filter @asciicanvas/ascii-editor run dev
pnpm --filter @asciicanvas/mockup-sandbox run dev
pnpm --filter @asciicanvas/api-server run dev
```

### Adding a new dependency

```bash
pnpm --filter @asciicanvas/ascii-editor add <package>
```

### Creating a new package

1. Create directory under `artifacts/` or `lib/`
2. Create `package.json` with `@asciicanvas/` scope
3. Create `tsconfig.json` extending `../../tsconfig.base.json`
4. Add project reference to root `tsconfig.json`
5. Run `pnpm install`

### Database operations

```bash
pnpm --filter @asciicanvas/db run push
pnpm --filter @asciicanvas/db run push-force
```

### API codegen

```bash
pnpm --filter @asciicanvas/api-spec run codegen
```

## After Making Changes

1. Run `pnpm install` if package.json files changed
2. Run `pnpm run typecheck` to verify TypeScript
3. Update `.agents/project-state.md` with current state
4. Append an entry to `.agents/agent-log.md`
