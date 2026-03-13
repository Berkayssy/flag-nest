# Delivery Auth

## Purpose
Allow evaluation endpoint access only with a service token.

## My Development Flow

### Backend
1. Define `DELIVERY_API_KEY` env var.
2. Add `require_delivery_token!` guard to evaluation controller.
3. Validate `Authorization: Bearer <token>` header.

### Frontend
1. No UI changes in this step.
2. Integration happens in E3.

### Documentation
1. Document token format and curl example.
2. Document invalid token behavior.

## Expected Flow
1. App calls evaluate endpoint with token.
2. Token is validated.
3. Missing or invalid token returns `401`.

## Security Notes
- Endpoint does not work without a token.
- Header: `Authorization: Bearer <token>`
- Token is read from server env.
- Token expiry should be added to improve security.

## Risks / Edge-case
- Empty `DELIVERY_API_KEY` makes all requests `401`.
- Token must not leak to logs.

## Test / Verification
- Missing token -> `401`.
- Invalid token -> `401`.
- Valid token -> `200`.
- Backend test suite -> `50 examples, 0 failures`

## My Summary
Delivery auth is added and the evaluation endpoint is protected.

## My Development Algorithm
`token -> guard -> test -> docs`
