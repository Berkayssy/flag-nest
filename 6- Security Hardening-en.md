# Security Hardening

## Purpose
Harden critical endpoints with CSRF protection and rate‑limiting, and tighten input validations.

## My Development Flow

### Backend
1. Added login rate‑limit (IP + email, 5 attempts / 10 min).
2. Added CSRF protection (header + `_csrf_token` cookie).
3. Set CSRF cookie on login, cleared on logout.
4. Tightened FeatureFlag validations (name/key length, key format, description limit).
5. Updated request specs to require CSRF header (logout, feature_flags, rollout_rules).
6. Added bad‑case tests (invalid key, long name, >100% rollout).
7. Set cache store for test environment.
8. Full request suite passed.

### Frontend
1. Added CSRF helper (`_csrf_token` → `X‑CSRF‑Token`).
2. Added CSRF header to write requests in API clients.
3. Tests + lint + build passed.

## Expected Flow
1. User logs in → CSRF cookie is set.
2. Write requests require `X‑CSRF‑Token`.
3. Rate‑limit exceeded → `429`.
4. Validation errors → `422`.

## Security Notes
- CSRF enforced only on write requests.
- Rate‑limit blocks brute‑force and abuse.
- Validations protect input hygiene.

## Risks / Edge‑Cases
- Missing/invalid CSRF token → `403`.
- Cache misconfig disables rate‑limit.
- UI not aligned with backend validations → UX drop.

## Tests / Verification
- Backend:
  - Auth/feature_flags/rollout_rules request suite passed
  - Bad‑case tests passed
- Frontend:
  - `npm run test:run` passed
  - `npm run lint` passed
  - `npm run build` passed

## My Summary
Security hardening is complete; critical endpoints are now protected with CSRF and rate‑limit.

## My Development Algorithm
`security -> input hardening -> tests -> verify -> push`
