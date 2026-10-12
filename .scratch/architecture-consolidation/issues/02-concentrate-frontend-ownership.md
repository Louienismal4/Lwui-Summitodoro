# 02: Concentrate frontend ownership

**What to build:** Make React the owner of all user-facing pages. Retire Laravel's demo rendering and separate frontend asset workflow while preserving backend request handling and health checks.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] The gateway root continues to serve the existing React demo.
- [x] Laravel's direct root deliberately returns 404 instead of the welcome page, and its health endpoint remains available at `/up`.
- [x] Laravel's unused welcome rendering, asset entries, frontend build configuration and dependency manifest are removed after checking their callers.
- [x] Laravel setup no longer installs or builds its separate frontend assets; affected development commands remain coherent with the retained backend role.
- [x] Backend tests verify the direct-root 404 and healthy `/up` response; backend tests and formatting checks pass.
- [x] Frontend lint and build still pass, with no runtime or build references to the retired Laravel asset workflow.

## Comments

React-only frontend ownership and the direct backend root returning 404 were explicitly agreed in the architecture review conversation. Do not add replacement server-rendered pages or new adapter abstractions.

Implemented on 2026-10-12. Removed the welcome route, view, asset entries, Vite configuration, Node manifest, and npm configuration after checking callers. Composer setup is PHP-only; `composer dev` runs the backend HTTP server. Queue workers and logs remain available through their Artisan commands, rather than starting automatically with `composer dev`.

Installed Laravel Boost and generated its guidelines as required by the backend's bootstrap instructions. Synchronized the running backend container's Composer volume. Concurrent frontend work supplied the scoped Button lint exception; it is already committed separately.

Verified: root test failed before removing the welcome route and passed afterward; both HTTP feature tests pass; full backend suite passes (3 tests); Pint formatting check and Composer strict validation pass; frontend lint and build/typechecking pass. Live gateway `/` returns 200 with React/Vite entry scripts, direct backend `/` returns 404, gateway `/up` returns 200, and gateway `/api` preserves Laravel's 404. Existing frontend and Docker work remains outside this ticket's commit.
