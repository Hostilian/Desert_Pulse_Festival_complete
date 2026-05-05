# Desert Pulse Festival – Project Documentation

**Course:** Markup Languages  
**Academic year:** 2025–2026  
**Project theme:** Fictional festival  
**Group members:** Add names here before submission  
**Date:** 27 April 2026

## Table of contents

1. Brief description of the festival
2. Requirements table
3. Project methodology
4. Development process
5. Tools used
6. Examples of key prompts
7. Critical evaluation of AI usage

## 1. Brief description of the festival

Desert Pulse Festival is a fictional three-day music and arts festival located in Solara Desert Park, Arizona, USA. The concept combines indie, electronic, hip-hop, ambient, world fusion and experimental music with workshops, artist talks and practical visitor services. The final XML dataset contains four venues, sixty performers and sixty programme events across 17-19 April 2026.

## 2. List of all requirements

| Requirement | Location where addressed |
|---|---|
| Context package: specification.md | specification.md and web/specification.md |
| Context package: festival.xml | data/festival.xml |
| Minimum 3 days | data/festival.xml: info/startDate and info/endDate |
| Minimum 2 venues | data/festival.xml: venues/venue |
| Minimum 60 performers | data/festival.xml: performers/performer |
| Minimum 60 events | data/festival.xml: programme/event |
| Semantic HTML | web/index.html, programme.html, performers.html, info.html |
| Metadata and Open Graph | All HTML files in web/ |
| JSON-LD festival/events | web/index.html and web/programme.html |
| CSS external 50-100 lines | web/style.css |
| XSD validation | data/festival.xsd |
| Custom restrictions in XSD | data/festival.xsd comments |
| 7 XSLT transformations | data/API/transformation/ |
| 7 JSON outputs | data/API/json/ |
| 7 JSON schemas | data/API/json-schema/ |
| OpenAPI 3.1 specification | data/openapi.yaml and API/openapi.yaml |
| Filters on events endpoint | data/openapi.yaml and data/API/transformation/events.xslt |
| Pagination | data/openapi.yaml, performers.xslt, events.xslt |

## 3. Project methodology

The project was completed using a data-first method. First, the festival concept and XML data model were expanded. Second, the XML was validated structurally through an XSD schema. Third, REST-style API outputs were designed as JSON files generated from XML by XSLT transformation examples. Fourth, a simple semantic website was created as a static presentation layer. Finally, the documentation mapped every requirement to the relevant file.

## 4. Development process

1. Reviewed the original context package and identified that the dataset needed expansion.
2. Expanded festival.xml to include required venues, performers and events.
3. Created festival.xsd with explicit comments marking custom restrictions.
4. Created seven XSLT transformation files and seven JSON outputs corresponding to required GET endpoints.
5. Created JSON Schema files matching the JSON outputs.
6. Created openapi.yaml using OpenAPI 3.1.0 with paths, parameters and 200/400/404 responses.
7. Created four HTML pages and a single external CSS stylesheet.
8. Prepared this documentation and final folder structure.

## 5. Tools used, including versions

- ChatGPT, GPT-5.5 Thinking, used for generation and consistency checking.
- Visual Studio Code or similar editor for manual editing.
- Python 3.13.5 for generating static files and verifying JSON/XML syntax.
- LibreOffice for DOCX rendering/conversion.
- Browser developer tools for checking static HTML pages.

## 6. Examples of key prompts

- Generate a fictional festival XML dataset with at least 60 performers and 60 programme events.
- Create an XSD schema for the festival XML and add custom restrictions using pattern, enum and range.
- Create XSLT files that transform festival.xml into JSON outputs for seven REST API endpoints.
- Create OpenAPI 3.1 YAML for GET-only festival API endpoints with filters and pagination.
- Create semantic HTML pages for a festival website with metadata, Open Graph and JSON-LD.

## 7. Critical evaluation of AI usage

AI was useful for quickly expanding repetitive structured data, drafting schemas and producing consistent website/API files. However, the AI output still required human review. The group must verify that all generated IDs match, that JSON files are valid, that XSLT outputs do not contain comma errors, and that the documentation follows the exact Moodle template. AI helped with structure and speed, but the final responsibility for correctness, originality and submission quality remains with the students.
