# AsciiCanvas

A monorepo for building and managing ASCII-based canvas applications, powered by a modern TypeScript stack.

## Overview

AsciiCanvas is a pnpm workspace monorepo that provides:

- **ASCII Editor** — A React-based frontend for creating and editing ASCII art
- **Mockup Sandbox** — An interactive preview environment for mockups and prototypes
- **API Server** — An Express 5 backend with PostgreSQL persistence

## Stack

| Layer                | Technology                         |
| -------------------- | ---------------------------------- |
| **Monorepo tool**    | pnpm workspaces                    |
| **Language**         | TypeScript 5.9                     |
| **Frontend**         | React 19 + Vite 7 + Tailwind CSS 4 |
| **Backend**          | Express 5                          |
| **Database**         | PostgreSQL + Drizzle ORM           |
| **Validation**       | Zod (v4)                           |
| **API codegen**      | Orval (from OpenAPI spec)          |
| **State management** | TanStack React Query               |
| **UI components**    | Radix UI + shadcn/ui               |

## Project Structure

```
AsciiCanvas/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express 5 API server
│   ├── ascii-editor/       # React frontend (ASCII art editor)
│   └── mockup-sandbox/     # React frontend (mockup preview)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # Workspace configuration
├── tsconfig.base.json      # Shared TypeScript config
└── tsconfig.json           # Root project references
```

## Getting Started

### Prerequisites

- Node.js 24
- pnpm
- PostgreSQL (for the API server)

### Installation

```bash
pnpm install
```

### Environment Variables

Each artifact requires environment variables to run. Create `.env` files in each artifact directory or set them in your shell:

| Variable       | Required By                  | Description                           |
| -------------- | ---------------------------- | ------------------------------------- |
| `PORT`         | All artifacts                | Port number to listen on              |
| `BASE_PATH`    | ascii-editor, mockup-sandbox | Base URL path for the app (e.g., `/`) |
| `DATABASE_URL` | api-server, lib/db           | PostgreSQL connection string          |

### Development

Run individual artifacts:

```bash
# ASCII Editor
pnpm --filter @asciicanvas/ascii-editor run dev

# Mockup Sandbox
pnpm --filter @asciicanvas/mockup-sandbox run dev

# API Server
pnpm --filter @asciicanvas/api-server run dev
```

### Building

```bash
# Typecheck all packages
pnpm run typecheck

# Build all packages
pnpm run build
```

### Database

```bash
# Push schema changes (development)
pnpm --filter @asciicanvas/db run push

# Force push (use with caution)
pnpm --filter @asciicanvas/db run push-force
```

### API Codegen

Generate React Query hooks and Zod schemas from the OpenAPI spec:

```bash
pnpm --filter @asciicanvas/api-spec run codegen
```

## Scripts

Run utility scripts:

```bash
pnpm --filter @asciicanvas/scripts run hello
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Please read the [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectful.
