# Cultivated Consultation — POC

Verification-gated professional consultation community. This POC covers exactly two features: Google sign-in with a manual admin-approval gate, and a basic consultation feed (post + reply). Everything else in the full product brief (groups, anonymous posting, payments, university rosters, public directory) is intentionally out of scope for now.

## Stack

- **Backend:** Java 21, Spring Boot 3.3, Spring Security (OAuth2 login, Google), Spring Data JPA, Postgres
- **Frontend:** React 18, Vite, react-router
- **Database:** Postgres — local via Docker for dev, Supabase in the cloud
- **Schema migrations:** Liquibase — the schema is defined in changelogs, not by Hibernate auto-DDL
- **Hosting (later):** Render

## Project layout

```
backend/    Spring Boot API
frontend/   React app
design-references/   Non-shipped images/mockups for design context
docker-compose.yml    Local Postgres for dev
```

## Where images go

- **`frontend/src/assets/images/`** — anything the running app actually displays (logo, icons). Import it directly in a component.
- **`design-references/`** — anything that's just for context (mockups, screenshots of the current WordPress/BuddyBoss site, inspiration). Drop files here and point Claude at them when you want a screen designed.

## First-time setup

### 1. Google OAuth client

In Google Cloud Console, create an OAuth 2.0 Client ID (type: Web application).
- Authorized redirect URI (local dev): `http://localhost:8080/login/oauth2/code/google`
- Authorized JavaScript origin: `http://localhost:5173`

You'll get a **Client ID** and **Client Secret** — these are environment variables, never committed.

### 2. Local database

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with database `cultivated_consultation` / user `postgres` / password `postgres` (matches the backend's default `application.yml` values — fine for local dev only).

The schema itself (tables, columns, foreign keys) is **not** created by this step — Liquibase creates it automatically the first time the backend starts (see below).

### 3. Backend environment variables

Export before running (or set in your IDE's run configuration):

```bash
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export APP_ADMIN_EMAILS=you@example.com   # comma-separated; these accounts auto-approve on first login
```

`SPRING_DATASOURCE_URL/USERNAME/PASSWORD` default to the local Docker Postgres above — override them once you switch to Supabase (see below).

Run it:

```bash
cd backend
./mvnw spring-boot:run
```

(No `mvnw` wrapper committed yet — run `mvn -N io.takari:maven:wrapper` once inside `backend/`, or just use your local `mvn` for now.)

### 4. Frontend environment variables

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Visit `http://localhost:5173`. Sign in with a Google account whose email is in `APP_ADMIN_EMAILS` to land directly in the feed; any other account lands on the pending screen until an admin approves it (see below).

### 5. Approving a test user

No admin UI yet — for the POC, either:
- Add your test account's email to `APP_ADMIN_EMAILS` (auto-approves on first login), or
- Sign in as an admin account and call `POST /api/admin/users/{id}/approve` (get the id from `GET /api/admin/users/pending`).

## Database migrations (Liquibase)

The schema lives in `backend/src/main/resources/db/changelog/`, not in the entity classes. `db.changelog-master.yaml` includes changeset files in order: `000-create-schema.yaml` creates a dedicated `cultivated_consultation` schema, then `001-initial-schema.yaml` creates `app_user`, `post`, and `reply` inside it.

- **We don't use Postgres's default `public` schema for app tables.** Everything the app owns lives in `cultivated_consultation` instead — keeps it isolated from anything else in the same database (Supabase or otherwise). Liquibase's own two bookkeeping tables (`databasechangelog`, `databasechangeloglock`) still live in `public`; that's just Liquibase's internal tracking, not app data, and keeping them there avoids a chicken-and-egg problem (Liquibase needs somewhere to track changesets before it can create the schema our tables live in). Both Hibernate (`hibernate.default_schema`) and the JDBC connection itself (`?currentSchema=...`) are configured to point at `cultivated_consultation`.
- On every startup, Liquibase compares the changelog against the database's `databasechangelog` tracking table and applies anything new. This happens automatically — no manual migration step, locally or on Render.
- Hibernate's `ddl-auto` is set to `validate`: it checks the entities match the real schema at startup and fails fast if they don't, but it never writes DDL itself. Liquibase is the only thing allowed to change the schema.
- **To change the schema:** add a new changeset file (e.g. `002-add-post-category.yaml`), reference it from `db.changelog-master.yaml`, and update the matching JPA entity to match. Never edit an already-applied changeset — Liquibase tracks changesets by id+author+checksum and will error if a previously-run one changes. Add a new one instead, even for a one-line fix.
- This also means the same changelog creates the schema identically on your local Docker Postgres, on Supabase, and in any future environment — no more "works locally, missing a column in prod."

## Switching the database to Supabase

Once your Supabase project exists, set these instead of the local Docker values:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://<your-supabase-host>:5432/postgres
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=<your-supabase-db-password>
```

Use Supabase's connection pooler (port 6543) instead of the direct connection if you hit connection-limit issues. Don't add `?currentSchema=...` yourself — `application.yml` appends that automatically.

## Deploying to Render

**We deploy as a single combined service, not two.** The `Dockerfile` at the repo root builds the React frontend and the Spring Boot backend together, and bundles the built frontend into the backend's static resources — one jar, one Render service, one URL serves both the API and the UI.

This was a deliberate choice, not just simpler ops: Render's free `*.onrender.com` subdomains are cross-site from each other, so two separate services (frontend on one subdomain, backend on another) would mean the session cookie our login relies on silently never reaches the API after the OAuth redirect. Combining them into one origin sidesteps that entirely — no CORS-across-services, no cross-site cookie flags needed.

**Render service settings:**
- Type: Web Service, Environment: Docker
- Leave Root Directory, Dockerfile Path, and Docker Build Context Directory all at their defaults (blank / `Dockerfile` / `.`) — the Dockerfile lives at the repo root specifically so Render finds it with zero custom path configuration. (It used to live at `backend/Dockerfile` with custom path settings — that's what caused the "open Dockerfile: no such file or directory" build error. `backend/Dockerfile` is now just a pointer comment; delete it once the root one deploys successfully.)

**Environment variables to set on that one service:**

```
GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>
SPRING_DATASOURCE_URL=<your Supabase JDBC url>
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<your Supabase db password>
APP_ADMIN_EMAILS=<your email, comma-separated if more than one>
APP_FRONTEND_BASE_URL=<this same service's own Render URL>
COOKIE_SECURE=true
```

Don't set `PORT` — Render sets that automatically and `application.yml` already reads it. `COOKIE_SAME_SITE` can stay at its default (`lax`) since everything's same-origin now; only needed if this ever gets split back into two services.

`APP_FRONTEND_BASE_URL` is what the backend redirects the browser to right after a successful Google login — since it's a combined deploy, that's just this service's own URL (e.g. `https://cultivatedconsultation.onrender.com`). Also update the Google OAuth client in Google Cloud Console once you have the real URL: authorized redirect URI `https://<your-render-url>/login/oauth2/code/google`, authorized JS origin `https://<your-render-url>`.

**Local dev is unaffected** — `frontend/` and `backend/` still run as two separate dev servers locally (`npm run dev` on 5173, Spring Boot on 8080), talking cross-origin the way they always have; that's why the CORS config and `VITE_API_BASE_URL` in `.env.local` still exist. The combined Dockerfile is a production-only build path.

## What's deliberately not built yet

Groups, anonymous posting, payments/subscriptions, university roster management, public directory, credential verification, push notifications, PWA manifest. See the product requirements brief in the project knowledge for the full picture — this repo is Phase 0/POC only.
