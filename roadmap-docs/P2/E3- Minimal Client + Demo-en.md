# Minimal Client + Demo

## Purpose
Provide a minimal TypeScript client and a demo usage example so apps can call the evaluation endpoint easily.

## My Development Flow

### Backend
1. No backend changes in this step.

### Frontend
1. Add `flag-nest-client-api.ts` with `createFlagNestClient`.
2. Implement `isEnabled(flagKey, userId)`.
3. Add minimal tests.

### Documentation
1. Add usage example.
2. Update E3 docs.

## Expected Flow
1. App creates a client with `createFlagNestClient`.
2. `isEnabled` calls the evaluation endpoint.
3. The `enabled` result drives app logic.

## Security Notes
- Token is sent by the client.
- Token must not leak to logs.

## Risks / Edge-case
- Network errors throw in client.
- `401` responses throw.

## Test / Verification
- `isEnabled` returns `true` when API returns enabled.
- Throws on `401`.

## My Summary
Minimal client makes integration cleaner and reusable.

## My Development Algorithm
`client -> test -> docs`