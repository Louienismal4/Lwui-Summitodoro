# Summitodoro

React/Vite in `frontend/`, Laravel in `backend/`, PostgreSQL, and Redis, with Nginx as the local development entry point.

## Local development

Docker Compose is the canonical development workflow. Install Docker with Compose, then run these commands from the repository root. They prepare missing environment files without overwriting existing ones:

```sh
[ -f .env ] || cp .env.example .env
[ -f backend/.env ] || cp backend/.env.example backend/.env
docker compose up --build -d --wait
# Only if backend/.env has an empty APP_KEY:
docker compose exec backend php artisan key:generate --no-interaction
docker compose exec backend php artisan migrate --no-interaction
```

Keep an existing `APP_KEY`; regenerating it invalidates encrypted application data. Compose supplies Laravel's PostgreSQL and Redis connection settings. React owns frontend assets in `frontend/`; Laravel has no separate Node install or frontend build step.

Open http://localhost:8080. React and CSS changes hot reload through Nginx; PHP changes take effect on the next request. Source files are bind mounted, and Vite uses polling inside Docker.

If the browser reports an SSL record error, make sure the address starts with `http://`, since port `8080` serves HTTP. If the browser automatically upgrades it to HTTPS, add an HTTP exception for this local site in its HTTPS-Only settings ([Firefox instructions](https://support.mozilla.org/en-US/kb/https-only-prefs)). You can also try http://127.0.0.1:8080.

- `/` serves Vite, including its hot-reload WebSocket.
- `/api` and `/api/*` go to Laravel with the path preserved. No API endpoints exist yet, so these currently return Laravel's 404 response.
- `/up` serves Laravel's health endpoint.
- Direct development ports remain available: Vite at `5173`, Laravel at `8000`, and PostgreSQL at `5432` (or root `.env`'s `DB_PORT`). All published ports bind to `127.0.0.1`.

After changing a dependency manifest or lockfile (including pulling changes), refresh the affected service's dependency volume. `node_modules` and `vendor` are mounted in container volumes, so rebuilding images alone does not update dependencies in existing containers:

```sh
docker compose exec frontend npm ci
docker compose exec backend composer install
docker compose restart frontend backend
```

Run only the install and restart commands for the service whose dependencies changed. Restart after installation so Vite and Laravel reload their dependencies. If a Dockerfile or image configuration changed, also run `docker compose up --build -d --wait`. Keep the existing volumes; dependency refresh does not require `docker compose down -v`.

To check the final setup:

```sh
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
docker compose exec backend composer validate --strict
docker compose exec backend composer test
curl --fail http://localhost:8080/up
# Expected status: 404
curl -o /dev/null -s -w '%{http_code}\n' http://localhost:8000/
```

At http://localhost:8080, click the counter, then use Tab to focus it and Enter or Space to increment it. Keyboard focus should have a visible ring. Temporarily edit the heading in `frontend/src/App.tsx` and a style in `frontend/src/App.css`; both should update without manually reloading the page. Restore those edits afterward.

## Redis

Redis is available to Laravel at `redis:6379` through the PhpRedis extension ([Laravel Redis documentation](https://laravel.com/docs/13.x/redis)), and to host tools at `127.0.0.1:6379`. It uses append-only persistence in the `redis-data` volume and has no password in this local setup.

```sh
docker compose exec redis redis-cli ping
```

This should return `PONG`. Laravel's existing cache, session, and queue drivers still use the database. To use Redis for caching, set `CACHE_STORE=redis` in `backend/.env`, then restart the backend.

Use `docker compose logs -f` for logs and `docker compose down` to stop. The `pg-data` and `redis-data` volumes keep PostgreSQL and Redis data; `docker compose down -v` deletes both. This configuration uses development servers and is intended for local development.
