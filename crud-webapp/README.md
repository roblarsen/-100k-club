# $100k Club CRUD Web Application

A user-friendly web application for managing comic book data including books, sales records, and silver age pedigrees.

## Features

- **Books Management**: Create, read, update, and delete comic book entries
- **Sales Records Management**: Manage high-value comic sales records  
- **Silver Age Pedigrees Management**: Manage pedigree collection data
- **Search & Filter**: Search across all data types
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Changes are immediately reflected in the interface

## Data Files Managed

- `books.json` - Comprehensive comic book database with sales history
- `records.json` - High-value comic sales records
- `sa-pedigrees.dev.json` - Silver age pedigree collection data

## Installation

1. Navigate to the crud-webapp directory:
   ```bash
   cd crud-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## Development

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Records
- `GET /api/records` - Get all sales records
- `POST /api/records` - Create new record
- `PUT /api/records/:index` - Update record
- `DELETE /api/records/:index` - Delete record

### SA Pedigrees
- `GET /api/sa-pedigrees` - Get all pedigree data
- `POST /api/sa-pedigrees/books` - Create new pedigree book
- `PUT /api/sa-pedigrees/books/:index` - Update pedigree book
- `DELETE /api/sa-pedigrees/books/:index` - Delete pedigree book

## Usage

### Managing Books
1. Click the "Books" tab to view all comic books
2. Use "Add New Book" to create entries
3. Click "Edit" to modify existing books
4. Use the search box to filter books
5. Each book can have multiple sales records

### Managing Records
1. Click the "Records" tab to view sales records
2. Add new sales records with date, price, seller, etc.
3. Edit or delete existing records
4. Search records by any field

### Managing Pedigrees
1. Click the "SA Pedigrees" tab
2. Add books with grades for different pedigree collections
3. Edit grades for existing books
4. The interface dynamically shows all available pedigree collections

## File Structure

```
crud-webapp/
├── package.json          # Node.js dependencies
├── server.js             # Express.js server
├── public/               # Frontend files
│   ├── index.html        # Main HTML interface
│   ├── styles.css        # CSS styles
│   └── app.js           # Frontend JavaScript
└── README.md            # This file
```

## Notes

- The application directly modifies the JSON files in `../data/data/`
- Always backup your data before making bulk changes
- The interface provides confirmation dialogs for delete operations
- All changes are saved immediately to the JSON files