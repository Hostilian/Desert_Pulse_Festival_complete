# Premium Rollout and QA Gates

## Phase A - Foundation
- Deliverables: `documentation/product-audit.md`, refreshed `web/style.css`, modular `web/js/` architecture baseline.
- Gate checks: HTML pages load with module scripts, all primary interactions still functional, no broken internal links.

## Phase B - Core Refactor
- Deliverables: page controllers in `web/js/pages/`, shared utilities and renderers, lean `web/app.js` bootstrap.
- Gate checks: search/filter/checklist flows validated manually on all pages, unit tests passing.

## Phase C - Experience Upgrade
- Deliverables: premium theme palette, refined footer/meta copy, updated manifest + theme colors.
- Gate checks: color contrast review, keyboard navigation check, reduced-motion behavior preserved.

## Phase D - Hardening
- Deliverables: CI enhancements in `.github/workflows/pages.yml`, detail schema validation, JS syntax checks, tests.
- Gate checks: workflow green with schema + test + syntax steps, OpenAPI server URL aligned with deployed site, dependencies pinned via lockfile.

## Phase E - Launch
- Deliverables: finalized documentation placeholders removed and production links normalized.
- Gate checks:
  - CI passes on latest branch state.
  - Manual smoke test on `index`, `programme`, `performers`, `info`.
  - Metadata and manifest values match the premium theme system.
  - Security checklist passes (CSP/referrer policy present, self-hosted social images, `SECURITY.md` available).
