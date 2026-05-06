# Desert Pulse Festival - Requirements Checklist

This document contains only assignment requirements and where each requirement is fulfilled in the repository.

## Context package (20 points)

| Requirement | Evidence location |
|---|---|
| Festival concept specification in Markdown (identity, audience, character, website structure) | `specification.md` |
| Festival XML data file submitted | `data/festival.xml` |
| XML is well-formed | `data/festival.xml` |
| Minimum 3 festival days | `data/festival.xml` (`<startDate>2026-04-17</startDate>`, `<endDate>2026-04-19</endDate>`) |
| Minimum 2 venues | `data/festival.xml` (`<venues><venue .../></venues>`, 4 venues total) |
| Minimum 60 performers | `data/festival.xml` (`<performers><performer .../></performers>`, 60 performers total) |
| Minimum 60 programme items (events) | `data/festival.xml` (`<programme><event .../></programme>`, 60 events total) |
| Required entities present: festival, venues/stages, performers, programme items | `data/festival.xml` |

## HTML, CSS part (20 points)

| Requirement | Evidence location |
|---|---|
| Home page (landing/about) | `web/index.html` |
| Programme page | `web/programme.html` |
| Performers page (list + detail blocks) | `web/performers.html` |
| Practical information page | `web/info.html` |
| Semantic HTML structure and heading hierarchy | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Required semantic elements (`head`, `meta`, `title`, `header`, `section`, `article`, `aside`, `time`, `address`, `footer`, `p`, `ul`/`ol`, `li`, `a`, `img`, `h1`, `h2`, `h3`) | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Metadata (`title`, `meta name="description"`) | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Open Graph minimum (`og:title`, `og:description`, `og:image`) | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Microdata or JSON-LD for festival and events | `web/index.html`, `web/programme.html` |
| API linkage in website content (corresponds to API endpoints) | `web/programme.html`, `web/performers.html` |
| One external CSS file, no frameworks/libraries | `web/style.css` |
| CSS line count between 50 and 100 lines | `web/style.css` |
| CSS baseline styling (colours, fonts, backgrounds, section separation) | `web/style.css` |

## Data model and API (20 points)

| Requirement | Evidence location |
|---|---|
| XML data source | `data/festival.xml` |
| XSD validation schema | `data/festival.xsd` |
| Custom XSD restrictions (pattern/enum/range) with comments | `data/festival.xsd` (`CUSTOM RESTRICTION` comments) |
| 7 XML -> XSLT -> JSON transformations (executable) | `data/API/transformation/festival.xslt`, `data/API/transformation/venues.xslt`, `data/API/transformation/venue-detail.xslt`, `data/API/transformation/performers.xslt`, `data/API/transformation/performer-detail.xslt`, `data/API/transformation/events.xslt`, `data/API/transformation/event-detail.xslt` |
| 7 JSON outputs (API response targets) | `data/API/json/festival.json`, `data/API/json/venues.json`, `data/API/json/venue-v1.json`, `data/API/json/performers.json`, `data/API/json/performer-p1.json`, `data/API/json/events.json`, `data/API/json/event-e1.json` |
| 7 JSON Schemas linked to outputs | `data/API/json-schema/festival.schema.json`, `data/API/json-schema/venues.schema.json`, `data/API/json-schema/venue-detail.schema.json`, `data/API/json-schema/performers.schema.json`, `data/API/json-schema/performer-detail.schema.json`, `data/API/json-schema/events.schema.json`, `data/API/json-schema/event-detail.schema.json` |
| OpenAPI specification (3.1+) with `info`, `servers`, `paths` | `data/openapi.yaml` |
| GET `/api/festival` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/festival.json`) |
| GET `/api/venues` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/venues.json`) |
| GET `/api/venues/{id}` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/venue-{id}.json`) |
| GET `/api/performers` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/performers.json`) |
| GET `/api/performers/{id}` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/performer-{id}.json`) |
| GET `/api/events` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/events.json`) |
| GET `/api/events/{id}` equivalent endpoint | `data/openapi.yaml` (`/data/API/json/event-{id}.json`) |
| Path/query parameters documented | `data/openapi.yaml` |
| Response status codes include minimum `200`, `400`, `404` per endpoint definition | `data/openapi.yaml` |
| `/api/events` has at least 2 filters (`day`, `venueId`, `performerId`) | `data/openapi.yaml` (`/data/API/json/events.json` parameters) |
| Pagination on list endpoint (`page`, `pageSize`) | `data/openapi.yaml` (`/data/API/json/performers.json`, `/data/API/json/events.json`) |
| JSON response schema linkage via `application/json` and `$ref` | `data/openapi.yaml` |

## Documentation (10 points)

| Requirement | Evidence location |
|---|---|
| Documentation file in Markdown | `documentation/dokumentace.md` |
| Documentation file in DOCX | `documentation/dokumentace.docx` |
| Requirements list with location links | `documentation/dokumentace.md`, `documentation/dokumentace.docx` |
