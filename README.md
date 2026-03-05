# Flag Nest

Feature flag and rollout-focused SaaS infrastructure (Rails API + Next.js frontend).

## Tech Stack
- Backend: Rails API (Ruby, PostgreSQL, RSpec)
- Frontend: Next.js (TypeScript)

## Monorepo Structure
- `backend/` -> Rails API
- `frontend/` -> Next.js app

## Step 1 (Auth) Status
Completed:
- JWT + HttpOnly cookie auth
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- Request spec: `spec/requests/auth_spec.rb` (5/5 passing)

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
bundle exec rspec spec/requests/auth_spec.rb
```

## Environment

### Backend (backend/.env or credentials)
- DATABASE_URL (optional, local can use database.yml)
- secret_key_base for JWT signing (Rails credentials)

### Frontend (.env.local)
- localhost(line 3001)

## Roadmap
1. Auth & Cookie 
2. RBAC
3. Feature Flag CRUD
4. Rollout rules
5. Audit log
6. Security hardening
7. Performance + release checklist