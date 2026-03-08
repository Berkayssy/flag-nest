# Rollout Rules

## Purpose
Enable controlled rollout of feature flags by adding rollout behavior on top of RBAC + CRUD, so the correct roles can safely manage how flags are released.

## My Development Flow

### Backend
1. Generated `RolloutRule` migration with `feature_flag` relation.
2. Updated migration fields:
   - `rule_type` (default: `percentage`)
   - `percentage`
   - `active` (default: `true`)
3. Added index `[:feature_flag_id, :active]` for performance.
4. Created `app/models/rollout_rule.rb`.
5. Added `has_many :rollout_rules` relation to `feature_flag.rb`.
6. Added base validations (`rule_type`, `percentage`).
7. Created `Api::V1::RolloutRulesController`.
8. Implemented actions: `index`, `create`, `update`, `destroy`.
9. Added helper methods: `set_feature_flag`, `set_rollout_rule`.
10. Added strong params via `rollout_rule_params`.
11. Added RBAC guards:
    - read: `require_manager_or_admin!`
    - write: `require_admin!`
12. Added routes as nested with resources + flat:
    - nested: `feature_flags/:feature_flag_id/rollout_rules`
    - flat: `rollout_rules/:id`
13. Added `spec/requests/rollout_rules_spec.rb`.
14. After all request tests passed, backend became push-ready.

### Frontend
1. Created `src/types/rollout-rule.ts`.
2. Centralized rollout data types.
3. Created `src/lib/rollout-rules-api.ts`.
4. Added API functions aligned with backend routes (`list/create/update/delete`).
5. Added rollout state + fetch + action handlers into `dashboard/page.tsx`.
6. Applied role-based UI behavior:
   - admin: create/update/delete
   - manager: read only
7. Added minimal rollout UI components.
8. Added role-based rollout tests to `dashboard/page.test.tsx`.
9. After `test + lint + build` passed, frontend became push-ready.

## Expected Flow
1. User logs in with auth cookie.
2. Dashboard fetches feature flags list.
3. Rollout rules are fetched for the selected `feature_flag_id`.
4. Manager/Admin can view rollout rules.
5. Admin can create rollout rules (`percentage`, `active`).
6. Admin can update/delete rollout rules.
7. Invalid or missing `feature_flag_id` returns `404`.
8. Unauthorized/forbidden requests keep the `401/403` contract.

## Security Notes
- Rollout permissions are enforced at backend guard level; frontend hiding alone is not security.
- Read and write permissions are separated (`manager/admin` vs `admin`).
- Nested route structure keeps rule ownership to a specific feature flag explicit.
- Invalid id requests return `404` and keep resource behavior controlled.

## Risks / Edge Cases
- Manual id input in dashboard can create repeated `404` logs for invalid ids.
- Route naming mismatch (`feature_flags` vs `feature-flags`) can break frontend integration.
- Missing `:created` in create action breaks status contract tests.
- If role checks are only done in frontend, authorization gaps may occur.
- Weak `percentage` validation can break rollout behavior.

## Test / Verification
- Backend:
  - `bundle exec rspec spec/requests/rollout_rules_spec.rb` -> passed
  - Full request suite (`auth + rbac + feature_flags + rollout_rules`) -> passed
- Frontend:
  - `npm run test:run` -> passed
  - `npm run lint` -> passed
  - `npm run build` -> passed
- Manual log checks:
  - valid id -> `200`
  - invalid id -> `404`
  - employee feature_flags -> `403`
  - auth flow -> expected `200/401` behavior

## My Summary
The Rollout Rules module is working on both backend and frontend with role-based behavior.
Admin can manage rollout rules, manager can only view.
RBAC + CRUD + routes + tests are aligned, and Step 4 is completed.

## My Development Algorithm
`module -> frontend/backend integration -> modularity -> test -> logs -> security -> performance -> commit`
