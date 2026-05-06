# Engineering Runbook

## Local Quality Gate
Run the full quality gate before every PR:

```bash
npm ci
npm run verify
```

## Security Gate
- Dependency security: `npm run audit:deps`
- Static analysis and secret detection run in CI (`security.yml`).

## Release Verification
1. Validate tests and contracts (`npm run verify`).
2. Confirm Pages workflow success.
3. Confirm security workflow success for push/PR.

## Failure Triage
- Schema drift: inspect `data/API/json-schema` and corresponding payload in `data/API/json`.
- OpenAPI drift: update `data/openapi.yaml` and ensure `tests/openapi.quality.test.mjs` passes.
- Frontend data failures: check `web/js/api.js` timeout/retry behavior and endpoint reachability.
