# Guidance for Contributors

This repository uses **pnpm** workspaces.

### Prisma
- Generate client: `pnpm --filter api prisma generate`
- Apply migrations (SQLite dev): `pnpm --filter api prisma migrate dev`
- Seed database: `pnpm --filter api prisma db seed`

Always run tests with `pnpm --filter api test` before committing.
