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
bundle exec rspec spec/requests/auth_spec.rb spec/requests/rbac_spec.rb spec/requests/feature_flags_spec.rb
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
4. Rollout rules
5. Audit log
6. Security hardening
7. Performance + release checklist