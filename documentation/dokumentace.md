# Desert Pulse Festival - Project Documentation

## Title page

Course: Markup Languages  
Academic year: 2025-2026  
Project theme: Festival (fictional)  
Project title: Desert Pulse Festival  
Submission date: 2026-05-06

## Table of contents

1. Brief description of the festival  
2. List of all requirements and where they are addressed  
3. Project methodology  
4. Development process  
5. Tools used (with versions)  
6. Examples of key prompts  
7. Critical evaluation of AI usage

## 1. Brief description of the festival

Desert Pulse Festival is a fictional three-day multi-genre festival in Solara Desert Park, Arizona (17-19 April 2026). It combines concerts, DJ sets, talks, and workshops across multiple venues.

## 2. List of all requirements and where they are addressed

| Requirement | Evidence location |
|---|---|
| Context package: specification.md | `specification.md` |
| Context package: festival.xml | `data/festival.xml` |
| Basic identity (name, edition/year, location, dates) | `specification.md` |
| Target audience + event character | `specification.md` |
| Website structure in concept | `specification.md` |
| Well-formed XML | `data/festival.xml` |
| Minimum 3 days | `data/festival.xml` (`startDate`, `endDate`) |
| Minimum 2 venues | `data/festival.xml` (`venues/venue`) |
| Minimum 60 performers | `data/festival.xml` (`performers/performer`) |
| Minimum 60 programme items | `data/festival.xml` (`programme/event`) |
| Required data entities | `data/festival.xml` |
| Home page | `web/index.html` |
| Programme page | `web/programme.html` |
| Performers page (list + detail) | `web/performers.html` |
| Practical information page | `web/info.html` |
| Semantic HTML + heading hierarchy | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Required semantic elements list | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Metadata: title + description | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Open Graph tags | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| JSON-LD for festival/events | `web/index.html`, `web/programme.html` |
| One external CSS file, no frameworks | `web/style.css` |
| CSS baseline (colours, fonts, backgrounds, section separation) | `web/style.css` |
| CSS line count 50-100 | `web/style.css` |
| XSD validation schema | `data/festival.xsd` |
| Custom restrictions with comments | `data/festival.xsd` |
| 7 XSLT files | `data/API/transformation/` |
| 7 JSON outputs | `data/API/json/` |
| 7 JSON Schemas | `data/API/json-schema/` |
| OpenAPI 3.1+ with info/servers/paths | `data/openapi.yaml` |
| Endpoints: festival, venues, venue by id, performers, performer by id, events, event by id | `data/openapi.yaml` |
| Path/query parameters | `data/openapi.yaml` |
| Responses with 200/400/404 | `data/openapi.yaml` |
| application/json + response schemas ($ref) | `data/openapi.yaml` |
| Events filters (day, venueId, performerId) | `data/openapi.yaml` |
| Pagination (page, pageSize) | `data/openapi.yaml` |
| Documentation submission: `dokumentace.docx` | `documentation/dokumentace.docx` |

## 3. Project methodology

Data-first workflow was used:
1. Define concept and scope.
2. Create XML dataset.
3. Validate XML with XSD.
4. Transform XML to JSON via XSLT.
5. Describe endpoints and schemas in OpenAPI.
6. Build static semantic HTML/CSS pages.
7. Map every requirement to concrete files.

## 4. Development process

1. Created the fictional festival concept in `specification.md`.
2. Prepared `data/festival.xml` with required minimum volumes and entities.
3. Added `data/festival.xsd` with custom restrictions (pattern/enum/range).
4. Implemented 7 transformations in `data/API/transformation/`.
5. Generated 7 JSON outputs in `data/API/json/`.
6. Prepared 7 JSON Schemas in `data/API/json-schema/`.
7. Finalized `data/openapi.yaml` including required endpoints, parameters, and responses.
8. Built and adjusted static pages in `web/` and baseline styling in `web/style.css`.
9. Produced final documentation in Markdown and DOCX.

Justification for XML updates: the XML data was expanded and synchronized with transformation and API outputs to satisfy required minimum counts and endpoint consistency.

## 5. Tools used (with versions)

- Python 3.13.5
- python-docx 1.2.0
- Cursor IDE
- Browser developer tools

## 6. Examples of key prompts

- Create a fictional festival XML dataset with at least 60 performers and 60 programme events.
- Build an XSD schema with pattern, enum, and range restrictions.
- Generate XSLT files for XML to JSON endpoint outputs.
- Write OpenAPI 3.1 YAML with required GET endpoints, filters, and response codes.
- Check static pages for semantic HTML, metadata, Open Graph, and JSON-LD.

## 7. Critical evaluation of AI usage

AI accelerated drafting and repetitive structuring, but manual validation was required for correctness. Final quality depended on human checks of schema consistency, endpoint coverage, and requirement traceability. The most effective approach was iterative prompting with strict verification before accepting outputs.
