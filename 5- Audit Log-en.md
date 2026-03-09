# Audit Log

## Purpose
Make critical actions in the system (feature flag and rollout operations) traceable by recording who did what, when, and on which resource.

## My Development Flow

### Backend
1. `audit_logs` migration is generated with Rails generate command by entering required data types.
2. Migration fields are defined and indexes are added for performance.
3. Migration is executed, then implementation continues with `AuditLog` model.
4. `belongs_to :user` is added to `AuditLog` model (relational structure is established).
5. Base validations are added.
6. `has_many :audit_logs` is added to `User` model (model relation is completed).
7. Shared helper method (`log_audit!`) is added into `ApplicationController`.
8. Audit logging is added to `create/update/destroy` actions in `FeatureFlagsController`.
9. Audit logging is also added to `create/update/destroy` actions in `RolloutRulesController`.
10. `Api::V1::AuditLogsController` is created.
11. `GET /api/v1/audit_logs` endpoint is added.
12. RBAC guard is added for `AuditLogsController#index`.
13. Audit log route is added to `routes.rb`.
14. `audit_logs_spec.rb` is created and base test scenarios are written.
15. After full test and quality checks, backend becomes push-ready.

### Frontend
1. Type file is created with `audit-log.ts`.
2. API management is handled via `audit-logs-api.ts`.
3. Audit state is added to dashboard.
4. Fetch and mount/refetch functions are added for audit list.
5. Mock data in `Audit Activity` section is removed and replaced with real API data.
6. Role-based visibility is preserved.
7. Audit checks are added to dashboard role tests.
8. After `test + lint + build` pass, frontend becomes push-ready.

## Expected Flow
1. Admin/manager opens dashboard.
2. System calls `GET /api/v1/audit_logs`.
3. Backend returns latest records ordered by time.
4. Frontend lists records in `Audit Activity`.
5. A new audit record is created when feature flag or rollout create/update/delete runs.
6. If employee tries to access audit endpoint, it returns `403`.
7. Unauthenticated requests return `401`.

## Security Notes
- Audit log endpoint is protected with role guard.
- Log records are generated at backend action level, not dependent on frontend.
- `metadata` field is kept ready for controlled extension.
- Auth + RBAC work together to restrict log access.

## Risks / Edge-case
- If action names are inconsistent, log analysis gets harder.
- Fast-growing log volume may require pagination.
- Continuous refetch on frontend can produce unnecessary requests.
- Wrong role guard implementation can accidentally open/close audit endpoint.

## Test / Verification
- Backend:
  - `audit_logs_spec.rb` passed
  - Full request suite passed
- Frontend:
  - `npm run test:run` passed
  - `npm run lint` passed
  - `npm run build` passed
- Manual:
  - admin/manager audit list `200`
  - employee `403`
  - unauth `401`

## My Summary
With the audit log module, critical system changes became traceable.
Automatic log creation on backend and real log rendering on frontend are completed.
Step 5 improved operational visibility.

## My Development Algorithm
`module -> frontend/backend integration -> modularity -> test -> logs -> security -> performance -> commit`
