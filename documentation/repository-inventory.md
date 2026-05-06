# Repository Inventory and Risk Backlog

## Current Footprint
- `web`: static multi-page frontend (HTML/CSS/vanilla JS module architecture).
- `data`: XML source, XSLT transformations, OpenAPI contract, JSON schemas, JSON payloads.
- `tests`: Node test suite for filters, API helpers, schema and OpenAPI contract checks.
- `.github/workflows`: GitHub Pages deploy workflow and quality/security automation.

## Highest-Risk Findings
1. Network layer had no retry/timeout behavior; transient failures caused hard UI failures.
2. Fatal app-level JS errors were not surfaced in UI, reducing recoverability.
3. CI had validation checks, but no dependency audit/security pipeline.
4. Repo had no `.gitignore`, enabling accidental commits of local build and dependency artifacts.
5. OpenAPI contract checks covered paths and refs but not transport security and endpoint completeness.

## Prioritized Backlog
1. Harden API client with timeout + retries and preserve cancellability.
2. Add global fatal error handling path to frontend shell.
3. Expand CI with security checks (audit, CodeQL, secret scan).
4. Add stronger OpenAPI test constraints and keep contract tests in `npm verify`.
5. Perform performance/quality/documentation cleanup on each change batch.
