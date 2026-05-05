# Desert Pulse Festival - Specification

## Basic Festival Identity
Festival name: Desert Pulse Festival  
Edition: 1st edition  
Year: 2026  
Location: Solara Desert Park, Arizona, USA  
Dates: 17-19 April 2026

Desert Pulse Festival is a fictional three-day event focused on music and visual culture. The programme combines concerts, DJ sets, talks, and workshops in a desert setting.

## Target Audience
The festival is designed for:
- young adults (18-35)
- listeners interested in indie, electronic, hip-hop, and alternative music
- visitors who like art, design, and workshop formats
- both international visitors and local attendees

## Festival Character
Main genres:
- Indie
- Electronic
- Hip-Hop
- Alternative
- Experimental

Additional activities:
- visual installations
- practical workshops
- artist and producer talks

## Website Structure

### 1. Home Page
- festival introduction
- short concept summary
- highlighted performers
- links to programme and practical information

### 2. Programme
- schedule grouped by day
- event time and venue details
- references to filters used in the API (`day`, `venueId`, `performerId`)

### 3. Performers
- performer list
- selected performer detail blocks
- genre and country information

### 4. Practical Information
- venue overview and addresses
- accommodation options
- parking and transport notes
- basic visitor rules

## Data Entities
The XML model includes:
- festival information
- venues/stages
- performers
- programme items (events)

Minimum planned dataset:
- at least 3 festival days
- at least 2 venues
- at least 60 performers
- at least 60 events
