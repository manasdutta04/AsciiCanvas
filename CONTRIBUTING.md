# Contributing Guide

Thank you for your interest in contributing to AsciiCanvas! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, pnpm version)
- Any relevant logs or screenshots

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating one:

- Use a clear and descriptive title
- Provide a detailed description of the proposed functionality
- Explain why this enhancement would be useful
- Include examples of how it would be used

### Pull Requests

1. Fork the repository and create your branch from `main`
2. Install dependencies with `pnpm install`
3. Make your changes
4. Ensure the code passes type checking: `pnpm run typecheck`
5. Ensure the code builds: `pnpm run build`
6. Commit your changes with a clear, descriptive message
7. Push to your fork and submit a pull request

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Development Workflow

### Setting Up Your Environment

```bash
# Clone the repository
git clone <repository-url>
cd AsciiCanvas

# Install dependencies
pnpm install

# Set up environment variables (see README.md)
```

### Running the Project

```bash
# Typecheck all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Run individual artifacts
pnpm --filter @asciicanvas/ascii-editor run dev
pnpm --filter @asciicanvas/mockup-sandbox run dev
pnpm --filter @asciicanvas/api-server run dev
```

### Project Structure

This is a pnpm workspace monorepo. Key points:

- Each package manages its own dependencies
- Shared libraries live in `lib/`
- Deployable applications live in `artifacts/`
- Always run typecheck from the root using `pnpm run typecheck`
- TypeScript uses project references — `tsc --build` builds the full dependency graph

### Adding Dependencies

```bash
# Add to a specific package
pnpm --filter @asciicanvas/ascii-editor add <package>

# Add dev dependency
pnpm --filter @asciicanvas/ascii-editor add -D <package>
```

## Code Style

- Follow existing code conventions
- Use TypeScript for all new code
- Run `pnpm run typecheck` before submitting
- Keep components focused and single-responsibility
- Use meaningful variable and function names

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
