# Dalton Platform

Monorepo for Instituto Dalton Salomão digital platform.

## Structure

- `apps/web` — Main Next.js app (patrimônio, presença, admin). See `apps/web/CLAUDE.md` for app-specific instructions.
- `apps/portal` — Public transparency portal (planned).
- `docs/` — Legal specs and references.
- `packages/shared` — Shared types and utilities.

## Commands (from apps/web/)

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run test:e2e   # Playwright e2e tests
npm run test:e2e:ui # Playwright UI mode
```

## Database

PostgreSQL via Prisma. Schema in `apps/web/prisma/schema.prisma`.
Cloud SQL instance: `pact-app-2025:southamerica-east1:pact-db` (shared with incubator, migration planned).

## Deploy

Cloud Run in `dalton-platform` GCP project. Artifact Registry: `southamerica-east1-docker.pkg.dev/dalton-platform/dalton-apps`.
