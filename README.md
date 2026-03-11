# Flag Nest

Feature flag and rollout-focused SaaS infrastructure (Rails API + Next.js frontend).

## Tech Stack
- Backend: Rails API (Ruby, PostgreSQL, RSpec)
- Frontend: Next.js (TypeScript)

## Monorepo Structure
- `backend/` -> Rails API
- `frontend/` -> Next.js app


## Progress Status

### Step 1 (Auth & Cookie) `Completed`
- JWT + HttpOnly cookie auth
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- Request spec: `backend/spec/requests/auth_spec.rb` (passing)

### Step 2 (RBAC) `Completed`
- Role guards in backend:
  - `require_admin!`
  - `require_manager_or_admin!`
- Protected endpoints:
  - `GET /api/v1/admin/ping`
  - `GET /api/v1/manager/ping`
- Backend RBAC request spec:
  - `backend/spec/requests/rbac_spec.rb` (passing)
- Frontend role-based dashboard visibility:
  - `isAdmin`
  - `isManagerOrAdmin`
- Frontend dashboard role smoke tests (passing)

### Step 3 (Feature Flag CRUD) `Completed`
- Backend `FeatureFlag` model + migration
- CRUD endpoints:
  - `GET /api/v1/feature_flags`
  - `POST /api/v1/feature_flags`
  - `PATCH/PUT /api/v1/feature_flags/:id`
  - `DELETE /api/v1/feature_flags/:id`
- RBAC integrated into CRUD endpoints
- Request spec:
  - `backend/spec/requests/feature_flags_spec.rb` (passing)
- Frontend:
  - Feature flag API module
  - Dashboard list + admin-only create flow
  - Role-based UI rendering for CRUD actions

## Step 4 (Rollout Rules) `Completed`
- RolloutRule model + migration
- RBAC-protected rollout endpoints
- `GET /api/v1/feature_flags/:feature_flag_id/rollout_rules`
- `POST /api/v1/feature_flags/:feature_flag_id/rollout_rules`
- `PATCH /api/v1/rollout_rules/:id`
- `DELETE /api/v1/rollout_rules/:id`
- Request spec: `spec/requests/rollout_rules_spec.rb` (passing)
- Dashboard rollout UI + frontend tests/lint/build passing

## Step 5 (Audit Log) `Completed`
- `audit_logs` table + `AuditLog` model
- Audit logging on feature flag and rollout create/update/delete actions
- `GET /api/v1/audit_logs` (RBAC-protected, manager/admin)
- Request spec: `spec/requests/audit_logs_spec.rb` (passing)
- Dashboard Audit Activity now reads real API data
- Frontend tests/lint/build passing

## Step 6 (Security Hardening) `Completed`
- Login rate‑limit (5 attempts / 10 min)
- CSRF protection via header + `_csrf_token` cookie
- FeatureFlag validations tightened
- Bad‑case request specs added
- Frontend API clients now send CSRF header
- Tests/lint/build passing

## Step 7 (Performance & Release Checklist) `Completed`
- Select‑only fields on list endpoints
- Audit log list limited + includes to avoid N+1
- Frontend audit fetch condition fixed
- Release checklist added
- Tests/lint/build passing

## Run Locally

### Backend
```bash
cd backend
bundle install
bin/rails db:create db:migrate
bundle exec rails s -p 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing
```bash
cd backend
bundle exec rspec spec/requests/auth_spec.rb spec/requests/rbac_spec.rb spec/requests/feature_flags_spec.rb spec/requests/rollout_rules_spec.rb spec/requests/audit_logs_spec.rb
```

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

## Environment

### Backend (backend/.env or credentials)
- DATABASE_URL (optional, local can use database.yml)
- secret_key_base for JWT signing (Rails credentials)

### Frontend (.env.local)
- localhost(line 3001)

## Roadmap
1. Auth & Cookie `OK`
2. RBAC `OK`
3. Feature Flag CRUD `OK`
4. Rollout rules `OK`
5. Audit log `OK`
6. Security hardening `OK`
7. Performance + release checklist `OK`