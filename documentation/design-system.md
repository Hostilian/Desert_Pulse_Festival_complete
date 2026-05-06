# Premium Design System Foundations

## Theme Strategy
- Primary visual mode: deep indigo premium surface with violet/cyan accents.
- Alternate mode: high-legibility dawn surface with preserved brand accents.
- Runtime toggle persists in `localStorage` under `dpf-theme`.

## Core Tokens
- Base brand tokens: `--brand-indigo`, `--brand-slate`, `--brand-ink`, `--brand-ice`, `--brand-silver`.
- Accent tokens: `--brand-violet`, `--brand-cyan`, `--brand-gold`.
- Semantic tokens: `--bg`, `--fg`, `--muted`, `--line`, `--surface-1..3`, `--accent-1..2`.
- Motion/elevation tokens: `--shadow-1`, `--shadow-2`, `--shadow-glow`.

## Component Language
- Premium surfaces: `section`, `aside`, `.card` with layered elevation and soft borders.
- Action controls: `.button`, `.chip`, `.toggle`.
- Data display: `.pill`, `.statline`, `.timeline`, `.checklist`.
- Progressive reveal: `.reveal` with reduced-motion fallback.

## Accessibility and Interaction Baselines
- Keyboard focus is always visible via `:focus-visible`.
- Skip link exists on all top-level pages.
- Tablist navigation is keyboard-enabled on programme day filters.
- Live regions provide status updates in dynamic views.

## Structure Baselines
- Common shell pattern across all pages: skip-link -> sticky header -> main content -> footer.
- Shared behavior pipeline in modular JS:
  - `web/js/main.js`
  - `web/js/pages/*`
  - `web/js/utils.js`
