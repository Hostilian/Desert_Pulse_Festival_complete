# Desert Pulse Product Inventory and Gap Map

## Scope
- Full product audit across frontend pages, API contract, data pipeline, documentation, and deployment checks.
- Classification model: `keep`, `improve`, `replace`, `remove`.

## Frontend Pages

### `web/index.html`
- `keep`: Hero countdown, featured performer feed, API visibility section, JSON-LD.
- `improve`: Information hierarchy, premium voice consistency, CTA framing.
- `replace`: Legacy footer copy and low-value static fallback snippets.
- `remove`: Redundant "student project" framing from main brand-facing messaging.

### `web/programme.html`
- `keep`: Day tabs, venue chips, search, status announcements.
- `improve`: Toolbar spacing and state readability, filter affordances.
- `replace`: Dense status text with clearer structured messaging.
- `remove`: Overly verbose API notes in customer-facing area.

### `web/performers.html`
- `keep`: Genre filtering, quick search, shuffle behavior.
- `improve`: Scanability of card metadata and active filtering indicators.
- `replace`: Generic heading/body copy with premium brand tone.
- `remove`: Repetitive explanatory copy that duplicates UI affordances.

### `web/info.html`
- `keep`: Venue cards, timeline, checklist persistence, practical detail blocks.
- `improve`: Content grouping for quick planning and accessibility labels.
- `replace`: Flat narrative sections with stronger premium utility framing.
- `remove`: Low-signal decorative text that does not aid planning decisions.

## Shared UI Layer

### `web/style.css`
- `keep`: Token-driven architecture and semantic surface levels.
- `improve`: Typographic rhythm, contrast pairs, reusable utility classes.
- `replace`: Current warm-neon palette with a premium brand palette.
- `remove`: One-off visual styles that prevent component-level reuse.

### `web/app.js`
- `keep`: Page routing by `data-page`, progressive enhancement behavior.
- `improve`: Error boundaries and clearer state ownership.
- `replace`: Monolithic structure with modular architecture.
- `remove`: Mixed concerns in one file without exportable testable logic.

## Data and API Layer

### `data/openapi.yaml`
- `keep`: Endpoint surface and response model references.
- `improve`: Environment-accurate server URL and contract clarity notes.
- `replace`: Placeholder values (`example.com`) with deploy-ready values.
- `remove`: Ambiguous language around pagination/filter behavior.

### `data/API/json-schema/*.json`
- `keep`: Existing schema inventory and naming.
- `improve`: CI coverage of detail schemas.
- `replace`: None required if schema shape already valid.
- `remove`: Validation blind spots for detail payloads.

## CI and Quality

### `.github/workflows/pages.yml`
- `keep`: Required path checks, syntax checks, schema checks, link checks.
- `improve`: Add detail schema validation, lint checks, automated tests.
- `replace`: Narrow validation-only pipeline with full quality gate pipeline.
- `remove`: Missing enforcement for JS/CSS/style consistency.

## Documentation and Metadata

### `documentation/dokumentace.md`
- `keep`: Requirement mapping and process record.
- `improve`: Ownership metadata completeness and launch-readiness wording.
- `replace`: Placeholder "add names" line with explicit final statement.
- `remove`: Submission placeholders and incomplete identity markers.

## Backlog Priority Buckets

### Critical
- Modularize frontend runtime.
- Refresh full design system and theme architecture.
- Enforce CI quality gates beyond schema syntax.
- Eliminate placeholder metadata and server URLs.

### Important
- Improve accessibility semantics and landmark consistency.
- Strengthen status messaging and empty-state behavior.
- Produce release governance and phased rollout documentation.

### Polish
- Refine content voice for premium positioning.
- Improve micro-interactions and visual hierarchy consistency.
