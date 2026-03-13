# Evaluation API

## Purpose
Provide a minimal evaluation endpoint so an application can decide whether a flag is enabled for a specific user.

## My Development Flow

### Backend
1. Add `GET /api/v1/flags/:key/evaluate`.
2. Query params: `user_id` required, `tenant_id` optional.
3. Support only `percentage` rollout rule.
4. Response: `{ enabled: true|false, reason: "percentage|off|not_found|invalid" }`

### Frontend
1. No UI changes in this step.
2. Integration happens in E3.

### Documentation
1. Write endpoint contract.
2. Add a curl example.

## Expected Flow
1. App calls evaluate endpoint with `:key`.
2. Backend finds flag and active rollout rule.
3. `user_id` is hashed and compared to percentage.
4. Response returns `enabled`.

## Security Notes
- This endpoint is not public, delivery auth will be added in E2.
- Invalid `user_id` or `key` returns a safe response.

## Risks / Edge-case
- Flag not found returns `enabled=false`.
- `percentage=0` and `percentage=100` must behave correctly.

## Test / Verification
- Missing `user_id` -> `400`.
- Missing flag -> `enabled=false`.
- `percentage=0` -> `enabled=false`
- `percentage=100` -> `enabled=true`
- Test result: `47 examples, 0 failures`

## My Summary
This step turns Flag Nest from a pure control plane into a service that can make runtime decisions.

## My Development Algorithm
`endpoint -> rule -> test -> docs`
