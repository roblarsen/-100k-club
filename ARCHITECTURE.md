# Architecture

## Purpose

`-100k-club` is a data-centric comic book project for exploring, visualizing, and managing high-value sales, pedigrees, and related historical records.

## Canonical source of truth

- JSON files under `data/` are authoritative.
- The CRUD app writes directly to those files.
- Visualization apps should treat `data/` as read-only.
- Do not assume a database, API service, or external storage layer exists unless explicitly documented.

## Repository map

| Path | Purpose | Tech | Read/Write |
|---|---|---|---|
| `100k-club/` | Primary sales visualization app | TypeScript, D3, webpack | Read |
| `record-sales/` | Sales-record visualization app | TypeScript, D3, webpack | Read |
| `silver-age-pedigrees/` | Pedigree visualization app | TypeScript, D3, webpack | Read |
| `timeline/` | Price-over-time visualization app | TypeScript, D3, webpack | Read |
| `crud-webapp/` | Browser + Express data manager | Node.js, Express, vanilla JS | Read/Write |
| `core/` | Shared helpers and domain utilities | TypeScript | Read |
| `data/` | Shared comic datasets | JSON | Read/Write via CRUD app only |

## Agent navigation rules

1. If the task is about **viewing, charting, or exploring data**, start with one of the visualization apps.
2. If the task is about **editing records**, use `crud-webapp/`.
3. If the task is about **shared formatting or domain logic**, use `core/`.
4. If the task is about **stored comic data**, inspect files in `data/`.
5. Prefer the nearest `README.md` in the target subproject before reading implementation files.
6. Do not assume a package workspace, shared backend, or centralized ORM unless this repo explicitly shows one.

## Disambiguation rules

- **Book** = a comic book record.
- **Record** = a high-value sales entry.
- **Pedigree** = a pedigree collection/grouping.
- **Provenance ledger** = the sale history attached to a comic record.
- **Visualization app** = read-only browser app.
- **CRUD app** = the only intended write path.

If a request is ambiguous:
- For display/analysis tasks, prefer the visualization apps.
- For mutation tasks, prefer `crud-webapp/`.
- For reusable logic, prefer `core/`.
- For data shape questions, inspect the JSON in `data/`.

## Common workflows

### Run a visualization app

```bash
cd 100k-club
npm install
npm run start
```

### Run the CRUD app

```bash
cd crud-webapp
npm install
npm start
```

Then open `http://localhost:3000`.

### Development mode for CRUD app

```bash
npm run dev
```

## Frontend architecture

The visualization apps share a similar structure:
- `webpack.common.ts` for bundling
- `scripts/index.ts` as the entrypoint
- TypeScript for app logic
- D3 for rendering and interaction
- Shared helper functions for formatting and domain-specific display

Common frontend responsibilities:
- load structured JSON data
- normalize and format records in memory
- render tables, charts, or timelines
- keep DOM-specific logic close to the entrypoint

## CRUD app architecture

`crud-webapp/` is a small Express server with a browser UI.

### Server responsibilities
- serve static files from `public/`
- expose JSON API endpoints
- read and write shared dataset files
- persist changes immediately

### Client responsibilities
- load all datasets on startup
- manage in-memory UI state
- render books, records, and pedigrees
- submit updates back to the server

### Important constraint
Because the CRUD app writes directly to JSON files:
- validate before writing
- avoid accidental schema drift
- back up data before bulk changes

## Shared utilities

The `core/` directory contains reusable helpers used across apps.

Likely concerns:
- currency formatting
- date formatting
- venue naming
- domain-specific display helpers

Rules for `core/`:
- keep functions pure when possible
- avoid DOM and filesystem side effects
- prefer small, reusable utilities

## Data model notes

Observed data domains:
- comic book master records
- provenance and sales events
- pedigree groupings
- timeline and inflation views
- venue and auction metadata

Architecture preference:
- keep storage shape explicit
- keep display formatting separate from storage
- preserve legacy values unless a transformation is intentional and documented

## Build/runtime model

### Visualization apps
- built independently
- TypeScript compiled through webpack
- browser-rendered
- read-only with respect to shared data

### CRUD app
- Express server plus static browser UI
- local file-backed persistence
- immediate save semantics

## Constraints

- JSON files under `data/` are authoritative.
- `crud-webapp/` is the only intended write path.
- Do not assume the presence of a database.
- Do not assume a shared runtime across subprojects.
- Do not change data formats without checking all consumers.
- Treat legacy HTML/JS as historical unless the task is specifically about legacy support.

## Suggested approach for new work

- Start from the closest subproject `README.md`.
- Reuse existing patterns before introducing new ones.
- Prefer shared logic in `core/`.
- Keep visualization apps read-only.
- Keep mutation logic isolated in `crud-webapp/`.

## Summary

This repository is a collection of loosely coupled apps centered on a shared comic book dataset. The visualization apps are optimized for reading and analysis, while the CRUD app is optimized for editing and persistence. The JSON files in `data/` are the source of truth, and shared helpers in `core/` support consistent formatting and domain logic across the project.
