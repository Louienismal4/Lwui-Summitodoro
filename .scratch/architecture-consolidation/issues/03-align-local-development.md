# 03: Align local development with Docker Compose

**What to build:** Give developers one canonical Docker Compose workflow for setup and dependency refresh that matches React frontend ownership and Laravel's backend role. Verify the actual gateway entry point rather than relying only on separate frontend and backend checks.

**Blocked by:** 02: Concentrate frontend ownership.

**Status:** ready-for-agent

- [x] Setup instructions identify Docker Compose as the canonical development workflow and contain no steps that install or build retired Laravel frontend assets.
- [x] Fresh setup covers environment preparation, startup, conditional application-key generation, migrations and the gateway address.
- [x] Existing environment files and application keys are preserved; named database and Redis volumes are retained.
- [x] Dependency-refresh instructions account for mounted dependency volumes and describe the required restart behavior.
- [x] Verify the React demo loads through the gateway, the counter works with visible keyboard focus, `/up` succeeds, and React/CSS changes hot reload.
- [x] Verify the direct Laravel root returns 404, and frontend lint/build and backend checks pass against the final setup.
- [x] Prefer aligning existing configuration and documentation; add no generic setup framework or redundant command script.

## Comments

Docker Compose was selected as the canonical workflow in the architecture review conversation. This ticket depends on 02 because instructions and verification must reflect the retained asset workflow. It does not depend on 01: the existing counter and focus behavior can be verified independently of styling consolidation. If 01 has landed, verify its updated rendering as part of the gateway check.


Implemented on 2026-10-13. Retained the existing Compose stack, gateway routing, loopback-only published ports, dependency-volume mounts, and named PostgreSQL/Redis volumes. Added the Compose files and environment example to version control, enabled Docker-only Vite polling, and aligned the root and service README instructions around Compose. Environment preparation copies only missing files; key generation is explicitly conditional on an empty APP_KEY. Dependency refresh installs into the mounted volumes and restarts the affected service without deleting data volumes. No setup framework or redundant repository script was added.

Verified the actual gateway in headless Chromium: React demo and images load; mouse, Enter, and Space each increment the counter once; counter and links have visible keyboard focus. Temporary React heading and CSS color changes hot reload without a page reload, preserving counter state; both source edits were restored.

Verified an isolated fresh Compose project using the current working tree, example environments, fresh volumes, and random loopback ports (fixed container names omitted solely for isolation). Image builds, startup, conditional key generation, PostgreSQL migrations, dependency refresh, and restarts pass. Repeating environment preparation preserves both files and the application key. PostgreSQL migrations and a Redis marker survive Compose down/up. Gateway root and /up return 200; direct Laravel root and gateway /api return 404. Frontend lint and build/typechecking, Composer strict validation, the full backend suite (3 tests), and Pint checks pass.

Code review: Standards found one missing --no-interaction flag in the backend container command; fixed and rebuilt successfully. Spec found no gaps. Existing unrelated frontend dependency, theme, component, and alias changes remain outside this commit; verification used the complete working tree. npm ci reported seven high-severity dependency advisories; dependency upgrades are outside this ticket and the lockfile was left unchanged.
