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

Desert Pulse Festival is a fictional three-day event held in Solara Desert Park, Arizona (17-19 April 2026). It combines concerts, DJ sets, artist talks, and workshops across four venues. For this project, we prepared a complete XML dataset (60 performers, 60 events), a static website, XSD validation, and API outputs created through XSLT.

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
| Update justification for data changes | Section 4 in this document |

## 3. Project methodology

We followed a data-first workflow:
1. Define the festival concept and required entities.
2. Build the XML dataset.
3. Validate structure and restrictions with XSD.
4. Generate JSON endpoint outputs through XSLT transformations.
5. Document the REST API in OpenAPI 3.1 and map outputs to JSON Schemas.
6. Build a semantic static website aligned with the same data model.
7. Write documentation that maps every requirement to concrete files.

## 4. Development process

1. We drafted the concept in `specification.md`.
2. We expanded `data/festival.xml` to meet the required scope (3 days, 4 venues, 60 performers, 60 events).
3. We prepared `data/festival.xsd` with explicit custom restrictions (`pattern`, `enum`, `range`) and comments.
4. We implemented 7 XSLT files and validated the resulting 7 JSON outputs.
5. We added 7 matching JSON Schema files.
6. We completed `data/openapi.yaml` with all required endpoints, parameters, and `200/400/404` responses.
7. We refined the website pages for semantic structure, metadata, Open Graph tags, and JSON-LD.
8. We cleaned the repository layout so the submission points to one canonical API/data source under `data/`.

Justification for updates to `festival.xml`: the file was expanded and aligned so that all mandatory minimum counts are met and all API transformation outputs stay consistent with the source data.

## 5. Tools used (with versions)

- Python 3.13.5 - validation checks and document generation scripts.
- python-docx 1.2.0 - generation of `dokumentace.docx`.
- Cursor IDE - editing and file management.
- Browser developer tools - static HTML review.

## 6. Examples of key prompts

- Create a fictional festival XML dataset with at least 60 performers and 60 programme events.
- Build an XSD schema with pattern, enum, and range restrictions.
- Generate XSLT files that transform festival XML data into JSON API responses.
- Write OpenAPI 3.1 YAML with required GET endpoints, filters, and response codes.
- Review HTML pages for semantic tags, metadata, and JSON-LD requirements.

## 7. Critical evaluation of AI usage

AI helped us speed up repetitive drafting tasks, especially in structured data and first-pass schema creation. The biggest limitation was that generated text and data often looked correct at first glance but still needed manual checking. We had to verify IDs, endpoint references, schema alignment, and wording quality ourselves. The useful approach was to treat AI as a draft assistant and keep final decisions and quality control in our hands.
