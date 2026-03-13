# CRUD System (Feature Flag)

## Purpose
Enable secure role-based actions by assigning correct permissions to users with different roles.

## My Implementation Flow

### Backend
1. Generated Feature Flag structure with Rails generate command and created required DB columns.
2. Edited the timestamped file under `db/migrate`, then applied it with `rails db:migrate`.
3. Created `feature_flag.rb` model under `app/models` and added base validations.
4. Created `feature_flags_controller.rb` under `app/controllers/api/v1` and implemented CRUD (`index/create/update/destroy`) methods.
5. Added RBAC guards in controller:
   - `index` with `require_manager_or_admin!`
   - `create/update/destroy` with `require_admin!`
6. Added `set_feature_flag` method and used `before_action` for update/destroy lookup.
7. Defined strong params contract with `feature_flag_params` (`params.require(:feature_flag)...`).
8. Added `resources :feature_flags, only: %i[index create update destroy]` in `routes.rb`.
9. Verified endpoints with `rails routes`.
10. Wrote base request tests in `feature_flags_spec.rb`.
11. Found create action status bug; fixed default `200` to `:created` (`201`).
12. After all tests passed, backend became push-ready.

### Frontend
1. Created `feature-flags-api.ts` module to manage Feature Flag API from one place.
2. Added type definitions for `/api/v1/feature_flags`.
3. Centralized `list` and `create` calls in the same module.
4. Integrated feature flag module into `dashboard/page.tsx`.
5. On page load, fetches `flag_list` and renders `loading/error` states.
6. Added create flag flow for admin role only.
7. `+ Create` button toggles the form, and submit refreshes `flag_list`.
8. Kept role-based UI behavior with RBAC helpers (`isAdmin`, `isManagerOrAdmin`).
9. Admin and non-admin behavior is clearly separated in UI.
10. Finalized minimal UI and completed test/lint/build checks before push.

## Expected Flow
1. User logs in with auth.
2. Dashboard loads and fetches feature flag list from backend.
3. Role check is enforced by backend guards.
4. Admin can create/update/destroy flags.
5. Manager can read list but cannot create/update/destroy.
6. Employee cannot access feature flag endpoints.
7. Frontend shows/hides actions based on role.

## Security Notes
- Authorization is enforced on backend endpoints, not only on frontend UI.
- Frontend hiding is UX-only; real protection is backend guards.
- Auth + RBAC + CRUD together prevent out-of-scope role actions.

## Risks / Edge Cases
- If nested strong params format (`feature_flag`) is broken, API returns `400 Bad Request`.
- If create action status is not set correctly, API contract breaks (`201` expected).
- `key` is unique, so duplicate create attempts return validation errors.
- If backend guards are skipped and only frontend logic is used, authorization gaps may occur.

## Test / Validation
- Automated:
  - `auth_spec.rb` passed
  - `rbac_spec.rb` passed
  - `feature_flags_spec.rb` passed
  - frontend vitest/lint/build passed
- Manual:
  - curl role-based endpoint checks passed
  - admin create success + manager/employee permission blocks verified
  - role-based UI visibility verified on dashboard

## My Summary
Feature Flag CRUD module is now securely integrated across backend and frontend with role-based access.
This is the first fully functional business module built on top of Auth + RBAC.
Next step is connecting rollout rules and targeted release behavior to this module.

## My Development Algorithm
`module -> frontend/backend integration -> modularity -> test -> log -> security -> performance -> commit`
