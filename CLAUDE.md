# CLAUDE.md

このファイルは、このリポジトリのコードで作業する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

Fluorite Recipesは、Next.js 15アプリケーションを含むモノレポです。メインの本番アプリケーションは `apps/base` にあり、React 19、TypeScript 5（strict mode）、Tailwind CSS v4、およびBiomeをlinting/formattingに使用したApp Routerアーキテクチャを採用しています。

## Working Directory

**IMPORTANT**: All development commands must be run from `apps/base/` directory, not the repository root.

```bash
cd apps/base
```

## Development Commands

### Core Commands

```bash
# Start development server (Turbopack enabled)
npm run dev
# or
pnpm dev

# Production build
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Auto-format code
npm run format
```

### Port Information

Development server runs at `http://localhost:3000`

## Architecture

### Next.js 15 App Router Structure

- **Entry Point**: `apps/base/src/app/page.tsx` - Home page
- **Root Layout**: `apps/base/src/app/layout.tsx` - Shared layout with Geist fonts and global styles
- **Global Styles**: `apps/base/src/app/globals.css` - Tailwind imports and CSS variable definitions
- **Static Assets**: `apps/base/public/` - SVGs and static files

### Key Architectural Patterns

- **Server Components by Default**: Use React Server Components unless client interactivity is needed
- **CSS Variables as Source of Truth**: All colors and fonts defined in `globals.css` using CSS variables
- **Tailwind CSS v4**: Uses `@theme inline` directive for token definition
- **Font Loading**: Geist Sans and Geist Mono loaded via `next/font/google` and exposed as CSS variables

### Path Aliases

TypeScript configured with `@/*` alias mapping to `apps/base/src/*`:

```typescript
import Component from "@/components/Component";
```

## Code Standards

### TypeScript

- Strict mode enabled
- Target: ES2017
- All components should be typed React function components
- Prefer explicit types over inference for public APIs

### Styling

- Tailwind CSS v4 using PostCSS
- Order utilities logically: layout → spacing → typography
- CSS variables in `globals.css` define theme tokens
- Dark mode handled via `prefers-color-scheme` media query
- Custom theme tokens defined in `@theme inline` block

### Code Formatting

- **Tool**: Biome 2.2.0 (not ESLint/Prettier)
- **Indentation**: 2 spaces
- **Import Organization**: Automatic via Biome's `organizeImports`
- **Rules**: Next.js and React recommended rules enabled
- Run `npm run format` before committing

### File Organization

- Co-locate related components in feature folders within `src/app`
- Use TypeScript `.tsx` extension for components, `.ts` for utilities
- Keep test files as `*.test.tsx` adjacent to components (when testing is added)

## Testing

**Current State**: No testing infrastructure configured yet.

**Future Testing Strategy** (from AGENTS.md):

- Framework: Vitest + React Testing Library
- Add `npm run test` script
- Co-locate tests as `*.test.tsx` next to components or in `__tests__` folders
- Target: ≥80% coverage on new code
- Include integration tests for routing and async flows

## Git Workflow

### Commit Messages

Use Conventional Commits format:

```
feat: add new feature
fix: resolve bug
chore: update dependencies
docs: update documentation
```

### Branch Strategy

- Main branch: `main`
- Development branch: `develop`
- Create PRs against `develop` branch

### Pull Request Requirements

- Explain the change clearly
- Link related issues
- Include screenshots for UI changes
- Ensure `npm run lint` and `npm run format` pass
- Document follow-up tasks or technical debt

## Environment Requirements

- **Node.js**: 18.18+ or 20.x required for Next.js 15
- **Package Manager**: pnpm preferred, npm works (align with lockfile you modify)
- Keep `node_modules` and `.next` out of version control

## Configuration Files

- `biome.json` - Linting and formatting rules
- `next.config.ts` - Next.js configuration (currently minimal)
- `tsconfig.json` - TypeScript compiler options with strict mode
- `postcss.config.mjs` - Tailwind PostCSS setup
- `pnpm-workspace.yaml` - Monorepo workspace configuration

## Important Notes

- **Turbopack**: Enabled by default for dev and build commands
- **React 19**: Using latest React version with new features
- **Biome over Prettier/ESLint**: Project uses Biome for all linting/formatting
- **No Unknown At-Rules**: Disabled in Biome for Tailwind CSS v4 compatibility
