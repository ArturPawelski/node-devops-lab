# Node.js DevOps Lab

A small DevOps lab built around a minimal NestJS API, covering Docker builds, PostgreSQL migrations, CI checks and deployment to an Azure VM.

## Stack

Node.js 24 · NestJS · PostgreSQL 17 · Docker Compose · GitHub Actions · GHCR · Azure VM

Flow: push to main → CI → GHCR image → manual deployment → Azure VM running API + PostgreSQL.

## Run locally

Requires Node.js 24 and Docker Compose. Run commands from the repository root.

```bash
npm ci

docker compose up -d --wait db

DATABASE_URL=postgres://app:app@localhost:5432/orders npm run migrate -- up

docker compose exec -T db \
  psql -v ON_ERROR_STOP=1 -U app -d orders < db/seed.sql

docker compose up --build -d api
```

Once the API has started:

```bash
curl --fail http://localhost:3002/health
curl --fail http://localhost:3002/orders
```

- `GET /health` checks the database connection; returns `503` on failure.
- `GET /orders` returns orders from PostgreSQL.

Local credentials (`app/app`) are for demo purposes only. No Azure account or `.env` file is needed locally.

Stop with `docker compose down`. Adding `-v` also deletes the database data.

## Tests and CI

```bash
npm run lint
npm test
npm run build
```

CI runs lint, unit tests, a build and smoke tests with a real PostgreSQL database. The smoke test checks readiness and validates the `/orders` JSON response.

Migrations are stored in `migrations/`; demo data is separate in `db/seed.sql`. Only pending migrations are applied.

## Deployment

Deployment requires a configured Azure VM with Docker Compose, federated OIDC access for GitHub Actions and the deployment configuration files.

After successful CI on `main`, the Docker image is published to GHCR with the full commit SHA as its tag.

Run **Actions → Deploy to Azure** on `main` and provide a published image SHA. The workflow uses Azure OIDC authentication and Run Command to deploy on the VM.

Deployment pulls the image, runs migrations, updates the API and checks `/health`. PostgreSQL data persists in a Docker volume.

GitHub secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.

The VM stores its own database password and image tag in `.env`, plus a read-only GHCR token in `.ghcr-token`. These files are excluded from Git. The API is accessible through an SSH tunnel, not a public endpoint.

## Operations practised

- Manual application rollback to a previous image SHA compatible with the current database schema.
- Failed image pull without interrupting the running API.
- Container logs, CPU/RAM usage and disk checks.
- Log rotation: three files of approximately 10 MB for each API and database container.
- PostgreSQL backup and restore, verified with sample records.

## Limitations

A single VM runs the API and database. Deployments may briefly interrupt the API. Rollback does not revert database migrations, and backups remain on the same VM.

This is a learning project without high availability or automated alerting. The VM is stopped and deallocated between sessions.
