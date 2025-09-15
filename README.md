
# $100,000 Club

A multi-faceted project for exploring, visualizing, and managing high-value comic book sales data, inspired by the research and lists at [It's All Just Comics](http://itsalljustcomics.com/).

## Overview

This repository contains several related applications and datasets focused on comic book sales, records, and pedigrees. The project has evolved from AngularJS-based interfaces to modern TypeScript, D3, and Node.js web applications.

### Key Features

- **Interactive Data Visualizations**: Modern D3/TypeScript apps for exploring comic sales and pedigrees.
- **CRUD Web App**: Manage books, sales records, and pedigrees with a Node.js/Express backend.
- **Historical Archives**: Legacy AngularJS code and static HTML for reference and preservation.
- **Rich Datasets**: JSON files with sales, book, and pedigree data, licensed for public use.

## Project Structure

- `100k-club/`, `record-sales/`, `silver-age-pedigrees/`, `timeline/`: Modern D3/TypeScript web apps for data visualization.
- `crud-webapp/`: Node.js/Express CRUD app for managing comic book and sales data.
- `core/`: Shared TypeScript modules for data models and utilities.
- `archives/`: Legacy AngularJS code, static HTML, and historical notes.
- `data/`: Centralized JSON datasets for books, sales, and pedigrees.
- `_timeline/`: Standalone D3 timeline demo.

## Getting Started

Most modern apps use Node.js, TypeScript, and D3. To run a visualization app (e.g., `100k-club`):

```bash
cd 100k-club
npm install
npm run start
```

For the CRUD web app:

```bash
cd crud-webapp
npm install
npm start
```
Then visit [http://localhost:3000](http://localhost:3000).

## Data Licensing

- **Code**: MIT License
- **Data**: [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US)

If you use the data, please credit:  
“Comic data courtesy Rob Larsen” with a link to [http://itsalljustcomics.com/100000-club/](http://itsalljustcomics.com/100000-club/)

## Credits

Created and maintained by Rob Larsen.  
For questions, feedback, or contributions, please open an issue or pull request.
