# Flag Nest

Feature‑flag and rollout control plane built as a Rails API + Next.js frontend.

## Why This Project
To demonstrate production‑minded full‑stack engineering: secure auth, RBAC, auditability, and clean frontend integration with test coverage.

## Tech Stack
- Backend: Rails API (Ruby, PostgreSQL, RSpec)
- Frontend: Next.js App Router (TypeScript)

## Architecture
- Monorepo: `backend/` + `frontend/`
- API proxy route: `frontend/src/app/api/v1/[...path]/route.ts`
- Auth: JWT in HttpOnly cookie
- Security: CSRF for write requests, login rate‑limit
- Audit: log create/update/delete on critical resources
- Scope: current MVP is the control plane (management UI + API). Evaluation/delivery SDK is out of scope for now.

## API Endpoints (v1)
- Auth: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- RBAC: `GET /admin/ping`, `GET /manager/ping`
- Feature Flags: `GET /feature_flags`, `POST /feature_flags`, `PATCH /feature_flags/:id`, `DELETE /feature_flags/:id`
- Rollout Rules: `GET /feature_flags/:feature_flag_id/rollout_rules`, `POST /feature_flags/:feature_flag_id/rollout_rules`, `PATCH /rollout_rules/:id`, `DELETE /rollout_rules/:id`
- Audit: `GET /audit_logs`

## Run Locally
Backend:
```bash
cd backend
bundle install
bin/rails db:create db:migrate
bin/rails s -p 3001
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Tests
Backend:
```bash
cd backend
bundle exec rspec spec/requests/auth_spec.rb spec/requests/rbac_spec.rb spec/requests/feature_flags_spec.rb spec/requests/rollout_rules_spec.rb spec/requests/audit_logs_spec.rb spec/requests/flag_evaluations_spec.rb
```

Frontend:
```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

## Docs
- `1- Auth&Cookie System-*.md`
- `2- RBAC System-*.md`
- `3- CRUD System (Feature Flag)-*.md`
- `4- Rollout Rules-*.md`
- `5- Audit Log-*.md`
- `6- Security Hardening-*.md`
- `7- Performance & Release Checklist-*.md`
- `E1- Evaluation API-*.md`
- `E2- Delivery Auth-*.md`
- `Final - Production Ready-*.md`

## Environment
Backend:
- `DATABASE_URL` (optional, local can use `config/database.yml`)
- `secret_key_base` (Rails credentials for JWT signing)

Frontend:
- `NEXT_SERVER_API_BASE` (optional, defaults to `http://localhost:3001`)

### Frontend (.env.local)
- localhost(line 3001)

## Roadmap

### P1

1. Auth & Cookie `OK`
2. RBAC `OK`
3. Feature Flag CRUD `OK`
4. Rollout rules `OK`
5. Audit log `OK`
6. Security hardening `OK`
7. Performance + release checklist `OK`

### P2

1. E1 `OK`
2. E2 `OK`
3. E3