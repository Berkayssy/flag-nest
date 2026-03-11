# Flag Nest Frontend (Next.js)

Next.js app that consumes the Rails API via a proxy route and provides the UI for auth, feature flags, rollout rules, and audit logs.

## Setup
```bash
cd frontend
npm install
```

## Run
```bash
npm run dev
```

## Test / Lint / Build
```bash
npm run test:run
npm run lint
npm run build
```

## Environment
- `NEXT_SERVER_API_BASE` (optional, default `http://localhost:3001`)

## Notes
- API proxy route: `src/app/api/v1/[...path]/route.ts`
- Requests include cookies (`credentials: "include"`).
