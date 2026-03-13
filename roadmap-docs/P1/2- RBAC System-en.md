# RBAC System

## Purpose
To securely and correctly route users with different roles according to role-based business logic.

## My Implementation Flow

### Backend
1. Added private role guard methods `require_admin!` and `require_manager_or_admin!` in `application_controller.rb`.
2. Added `ping` action in `/api/v1/admin_controller.rb` (for isolated validation) and protected it with `before_action :require_admin!`.
3. Added `ping` action in `/api/v1/manager_controller.rb` and protected it with `before_action :require_manager_or_admin!`.
4. Added RBAC routes in `config/routes.rb` (`admin/ping`, `manager/ping`).
5. Fixed control flow of `current_user&.is_active?` in `authenticate_request`; removed `ActiveRecord::RecordNotFound` expectation because `find_by` is used.
6. Added RBAC request specs for admin/manager/employee scenarios.
7. Seeded sample users with real roles in DB and validated with curl tests.
8. Verified with both Rails logs and curl outputs; RBAC module works as expected on backend.
9. After RuboCop and request tests, backend RBAC module became push-ready.

### Frontend
1. Reused previously defined `UserRole` type from the auth module.
2. Added `isAdmin` and `isManagerOrAdmin` helpers in `rbac.ts`.
3. Implemented role-based conditional UI rendering on dashboard.
4. Added role visibility smoke tests in `dashboard/page.test.tsx`.
5. After test + lint + build checks, frontend RBAC module became push-ready.

## Expected Flow
1. User logs in with auth cookie.
2. Request reaches RBAC endpoint (`/api/v1/admin/ping` or `/api/v1/manager/ping`).
3. `authenticate_request` runs first and validates user.
4. Then role guard runs:
   - `require_admin!`
   - `require_manager_or_admin!`
5. If unauthorized: `401`; if forbidden by role: `403`; if allowed: `200`.
6. On frontend, role helpers conditionally show/hide UI sections.

## Security Notes
- RBAC must be enforced on backend endpoints, not only on frontend.
- Frontend hiding is only UX; real authorization is backend guard logic.
- Since Auth + RBAC run together, role bypass attempts return `401/403`.

## Risks / Edge Cases
- If backend guard is skipped and only frontend hiding is used, it creates an authorization gap.
- If role values are used inconsistently as strings, mismatch risk increases.
- If inactive-user and expired-token flows are not clearly separated, auth/rbac results can become inconsistent.

## Test / Validation
- Manual (curl):
  - unauth `admin/ping` -> `401`
  - employee `admin/ping` -> `403`
  - employee `manager/ping` -> `403`
  - manager `manager/ping` -> `200`
  - manager `admin/ping` -> `403`
  - admin `admin/ping` -> `200`
  - admin `manager/ping` -> `200`
- Automated:
  - Backend `rbac_spec.rb` passed
  - Backend `auth_spec.rb` passed
  - Frontend dashboard role smoke tests passed
  - Frontend lint/build passed

## My Summary
RBAC module is working with role-based control on both backend and frontend.
Endpoint-level guards created a clear authorization wall.
Next step is combining RBAC with real feature flag CRUD and rollout logic.

## My Development Algorithm
`module -> frontend/backend integration -> modularity -> test -> log -> security -> performance -> commit`