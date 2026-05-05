# Desert Pulse Festival - Project Documentation

## Title page

Course: Markup Languages  
Academic year: 2025-2026  
Project theme: Festival (fictional)  
Project title: Desert Pulse Festival  
Group members: Add names before submission  
Submission date: 2026-05-05

## Table of contents

1. Brief description of the festival
2. List of all requirements and where they are addressed
3. Project methodology
4. Development process
5. Tools used (with versions)
6. Examples of key prompts
7. Critical evaluation of AI usage

## 1. Brief description of the festival

Desert Pulse Festival is a fictional three-day event in Solara Desert Park, Arizona, USA (17-19 April 2026). The programme combines concerts, DJ sets, talks, and workshops across four venues. The final data package includes 60 performers and 60 programme items, with a static website and API artifacts generated from XML data.

## 2. List of all requirements and where they are addressed

| Requirement | Location where addressed |
|---|---|
| Festival concept specification in Markdown | `specification.md` |
| Festival XML data file | `data/festival.xml` |
| Well-formed XML | `data/festival.xml` |
| Minimum 3 days | `data/festival.xml` (`info/startDate`, `info/endDate`) |
| Minimum 2 venues | `data/festival.xml` (`venues/venue`, 4 total) |
| Minimum 60 performers | `data/festival.xml` (`performers/performer`, 60 total) |
| Minimum 60 programme events | `data/festival.xml` (`programme/event`, 60 total) |
| Mandatory HTML pages | `web/index.html`, `web/programme.html`, `web/performers.html`, `web/info.html` |
| Semantic HTML elements and hierarchy | all files in `web/` |
| Metadata (`title`, `description`) | all files in `web/` |
| Open Graph tags | all files in `web/` |
| JSON-LD for festival/events | `web/index.html`, `web/programme.html` |
| One external CSS file, 50-100 lines | `web/style.css` |
| XSD validation schema | `data/festival.xsd` |
| Custom XSD restrictions with comments | `data/festival.xsd` |
| 7 XSLT transformations | `data/API/transformation/` |
| 7 JSON outputs | `data/API/json/` |
| 7 JSON Schemas | `data/API/json-schema/` |
| OpenAPI 3.1 specification | `data/openapi.yaml` |
| Required endpoints (`/festival`, `/venues`, `/venues/{id}`, `/performers`, `/performers/{id}`, `/events`, `/events/{id}`) | `data/openapi.yaml` |
| Required `/api/events` filters | `data/openapi.yaml` (`day`, `venueId`, `performerId`) |
| Pagination on list endpoints | `data/openapi.yaml` (`/api/performers`, `/api/events`) |
| Update justification for data changes | Section 4 in this documentation |

## 3. Project methodology

The team used a data-first workflow:
1. Define the festival concept and required entities.
2. Build complete XML data.
3. Validate structure and constraints using XSD.
4. Transform XML into JSON endpoint outputs via XSLT.
5. Describe the API using OpenAPI 3.1 and JSON Schemas.
6. Build a semantic static website aligned with API and data.
7. Document all requirement mappings and validation results.

## 4. Development process

1. Drafted the festival concept in `specification.md`.
2. Expanded `data/festival.xml` to satisfy required minimum scope (3 days, 4 venues, 60 performers, 60 events).
3. Added `data/festival.xsd` with explicit custom restrictions (`pattern`, `enum`, `range`) and comments marking them.
4. Created and validated 7 XSLT transformations and corresponding 7 JSON outputs.
5. Created matching 7 JSON Schema files and linked them in OpenAPI.
6. Finalized `data/openapi.yaml` with required endpoints, parameters, and response codes (200/400/404).
7. Updated web pages for semantic tags, metadata, Open Graph, JSON-LD, and API linkage.
8. Normalized project structure to avoid duplicate API artifact trees and keep one authoritative data/API source under `data/`.

Justification for updates to `festival.xml`: the XML was expanded and aligned to fully satisfy assignment minimums and to guarantee consistency with transformation outputs and OpenAPI endpoint examples.

## 5. Tools used (with versions)

- Python 3.13.5 - data generation/validation scripts and checks.
- python-docx 1.2.0 - generation of final `dokumentace.docx`.
- Cursor IDE - editing and project integration.
- Browser developer tools - static page checks.

## 6. Examples of key prompts

- Create a fictional festival XML dataset with at least 60 performers and 60 programme events.
- Build an XSD schema with explicit pattern, enum, and range restrictions.
- Generate XSLT files producing JSON responses for required GET endpoints.
- Write OpenAPI 3.1 specification with 200/400/404 responses and linked schemas.
- Improve semantic HTML pages to satisfy mandatory element and metadata requirements.

## 7. Critical evaluation of AI usage

AI accelerated repetitive data drafting and first-pass schema generation, which reduced routine effort. The main limitation was reliability of details: generated outputs required strict manual verification for ID consistency, schema alignment, endpoint references, and grading-template compliance. The strongest workflow was AI-assisted drafting followed by human validation and correction. Responsibility for correctness, originality, and final submission quality remains with the student team.
