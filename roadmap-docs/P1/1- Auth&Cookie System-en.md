# Auth Cookie System

## Purpose
Build a secure Auth flow by issuing a JWT and storing it in an HttpOnly cookie, then integrating it end-to-end between frontend and backend against common JS-based attacks.

## My Implementation Flow

### Backend
1. Backend is set up as Rails API, frontend as Next route-based app.
2. A proxy layer is designed at `api/v1/[...path]/route.ts` for centralized API routing.
3. Cookie helper and auth helper methods are added to `ApplicationController`.
4. `login`, `me`, `logout` endpoints are added in `config/routes.rb`.
5. `AuthController` is created with `login`, `me`, `logout`; all except `login` are protected by `:authenticate_request`.
6. `issue_auth_cookie`, `authenticate_request`, JWT encode/decode and shared response methods are added in `ApplicationController`.
7. Endpoints are manually tested with `curl` / Postman; errors are fixed.
8. `User` model is created and a sample user is prepared for auth tests.
9. Migration is generated and applied with `rails db:migrate`.
10. Required gems are installed via `bundle install` (`bcrypt`, `jwt`, `rspec`).
11. Middleware/config updates are applied in `application.rb` based on runtime errors.
12. Response format is standardized for frontend integration.
13. Auth flow and status code tests are written in `spec/requests/auth_spec.rb`.
14. After tests + RuboCop checks, the Auth core module is finalized for push.

### Frontend
1. Auth module is split into `api`, `types`, `contexts`, `lib` for modular structure.
2. Backend-aligned types are defined in `auth.ts`.
3. `auth-api.ts` centralizes auth requests.
4. `auth-context.tsx` centralizes auth state with provider wrapping.
5. Minimal `home`, `login`, `dashboard`, `logout` flows and components are implemented.
6. Required type/css fixes are applied for Next global style/type issues.
7. Tailwind adjustments are applied for a minimal and consistent UI/UX.
8. After lint and manual flow checks, frontend auth module is finalized for commit/push.

## Expected Flow
1. User submits login form. Next proxies request to `/api/v1/auth/login`.
2. Request is routed by Rails `routes.rb` to `AuthController`.
3. `AuthController#login` finds user by email; on success it generates token, sets auth cookie, and returns `200 OK` + `render_success`.
4. `ApplicationController` auth helpers (`issue_auth_cookie`, `authenticate_request`) complete the flow.
5. Browser stores HttpOnly cookie, user becomes authenticated (`200 OK`).
6. `auth/me` returns `401` before login and `200` after login.
7. On logout, cookie is cleared with `cookies.delete`; session cycle ends.

## Security Notes
- HttpOnly cookie blocks JavaScript access to auth token.
- `SameSite` and `Secure` options are managed per environment (dev/prod).
- This step covers auth session basics; CSRF/rate-limit and hardening are handled in separate security steps.

## Risks / Edge Cases
- Wrong `SameSite/Secure` in production can break login flow.
- If proxy does not correctly forward `Set-Cookie`, `auth/me` may keep returning `401`.
- Expired token behavior can degrade UX if session refresh handling is unclear.
- Hiding routes only in frontend is not enough; backend endpoint guards are mandatory.

## Test / Validation
- Manual:
  - Before login: `GET /api/v1/auth/me -> 401`
  - `POST /api/v1/auth/login -> 200`
  - After login: `GET /api/v1/auth/me -> 200`
  - `POST /api/v1/auth/logout -> 200`
  - After logout: `GET /api/v1/auth/me -> 401`
- Automated:
  - Backend RuboCop passed
  - Backend `auth_spec.rb -> 5/5 passed`
  - Frontend lint and build passed
  - Frontend auth smoke tests (home/login) passed

## My Summary
Auth & Cookie module is integrated and working across backend and frontend.
JWT + HttpOnly cookie provides baseline session security, validated by tests.
Next step is RBAC to enforce endpoint-level authorization and role-based structure.

## My Development Algorithm
`module -> frontend/backend integration -> modularity -> test -> log -> security -> performance -> commit`
