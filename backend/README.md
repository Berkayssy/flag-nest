# Flag Nest Backend (Rails API)

Rails API for authentication, RBAC, feature flags, rollout rules, and audit logs.

## Requirements
- Ruby 3.2+
- Bundler
- PostgreSQL

## Setup
```bash
cd backend
bundle install
bin/rails db:create db:migrate
```

Optional (demo data):
```bash
bin/rails db:seed
```

## Run
```bash
bin/rails s -p 3001
```

## Test
```bash
bundle exec rspec spec/requests/auth_spec.rb spec/requests/rbac_spec.rb spec/requests/feature_flags_spec.rb spec/requests/rollout_rules_spec.rb spec/requests/audit_logs_spec.rb
```

## Environment
- `DATABASE_URL` (optional, local can use `config/database.yml`)
- `secret_key_base` (Rails credentials for JWT signing)

## Notes
- Auth is JWT stored in HttpOnly cookie.
- CSRF is enforced on write requests via `X-CSRF-Token`.
- Rate limit applies to login attempts.
