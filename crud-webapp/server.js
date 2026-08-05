const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file paths
const BOOKS_FILE = path.join(__dirname, '../data/books.dev.json');
const RECORDS_FILE = path.join(__dirname, '../data/data/records.json');
const SA_PEDIGREES_FILE = path.join(__dirname, '../data/data/sa-pedigrees.dev.json');

// Helper function to read JSON file
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        throw error;
    }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        throw error;
    }
}

/**
 * Returns the trimmed string value, or undefined if empty/absent.
 * Omits dead payload attributes from stored objects.
 */
function optField(value) {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed || undefined;
}

/**
 * Generates the next string id by finding the current maximum numeric id
 * across all books and incrementing by one, zero-padded to 4 digits.
 * @param {Array<{id: string}>} books - Existing books array.
 * @returns {string} Next zero-padded 4-digit id string.
 */
function nextBookId(books) {
    const max = books.reduce((acc, book) => {
        const n = parseInt(book.id, 10);
        return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return String(max + 1).padStart(4, '0');
}

/**
 * Finds a book in the books array by its string id.
 * @param {Array} books
 * @param {string} id
 * @returns {{ book: object, index: number } | null}
 */
function findBookById(books, id) {
    const index = books.findIndex(b => String(b.id) === String(id));
    if (index === -1) return null;
    return { book: books[index], index };
}

/**
 * Sorts a provenanceLedger (or sales) array in strictly ascending chronological
 * order by ISO-8601 date string. Entries without a date sort to the front.
 * @param {Array} ledger - Array of event objects with optional `date` property.
 * @returns {Array} New sorted array (does not mutate the original).
 */
function sortLedgerChronologically(ledger) {
    return [...ledger].sort((a, b) => {
        const aDate = a.date ? a.date : '';
        const bDate = b.date ? b.date : '';
        if (!aDate && !bDate) return 0;
        if (!aDate) return -1;
        if (!bDate) return 1;
        return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
    });
}

// Routes for Books

app.get('/api/books', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read books data' });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(found.book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book data' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const body = req.body;
        const id = nextBookId(data.books);

        const newBook = {
            id,
            title: body.title || '',
            issue: body.issue || '',
            sales: [],
            ...body,
            id,
        };

        data.books.push(newBook);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }

        data.books[found.index] = { ...found.book, ...req.body, id: found.book.id };
        await writeJSONFile(BOOKS_FILE, data);
        res.json(data.books[found.index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }

        data.books.splice(found.index, 1);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Routes for Book Sales

app.get('/api/books/:id/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(found.book.sales || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book sales data' });
    }
});

app.post('/api/books/:id/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = data.books[found.index];
        if (!Array.isArray(book.sales)) book.sales = [];

        const newSale = { ...req.body };

        // Strip empty optional string fields before persisting (Rule 3)
        ['sourceLink', 'notes'].forEach(field => {
            if (newSale[field] === '') delete newSale[field];
        });

        book.sales.push(newSale);

        // Sort provenanceLedger chronologically after each mutation (Rule 1)
        book.sales = sortLedgerChronologically(book.sales);

        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add sale to book' });
    }
});

app.put('/api/books/:id/sales/:saleIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = data.books[found.index];
        const sales = book.sales || [];
        const saleIndex = parseInt(req.params.saleIndex, 10);

        if (isNaN(saleIndex) || saleIndex < 0 || saleIndex >= sales.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        const updated = { ...sales[saleIndex], ...req.body };

        // Strip empty optional string fields before persisting (Rule 3)
        ['sourceLink', 'notes'].forEach(field => {
            if (updated[field] === '') delete updated[field];
        });

        sales[saleIndex] = updated;
        book.sales = sortLedgerChronologically(sales);
        await writeJSONFile(BOOKS_FILE, data);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update sale' });
    }
});

app.delete('/api/books/:id/sales/:saleIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const found = findBookById(data.books, req.params.id);
        if (!found) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = data.books[found.index];
        const sales = book.sales || [];
        const saleIndex = parseInt(req.params.saleIndex, 10);

        if (isNaN(saleIndex) || saleIndex < 0 || saleIndex >= sales.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        sales.splice(saleIndex, 1);
        book.sales = sortLedgerChronologically(sales);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sale' });
    }
});

// Routes for Records
app.get('/api/records', async (req, res) => {
    try {
        const data = await readJSONFile(RECORDS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read records data' });
    }
});

app.post('/api/records', async (req, res) => {
    try {
        const data = await readJSONFile(RECORDS_FILE);
        const newRecord = req.body;
        data.sales.push(newRecord);
        await writeJSONFile(RECORDS_FILE, data);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create record' });
    }
});

app.put('/api/records/:index', async (req, res) => {
    try {
        const data = await readJSONFile(RECORDS_FILE);
        const recordIndex = parseInt(req.params.index);
        
        if (recordIndex < 0 || recordIndex >= data.sales.length) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        data.sales[recordIndex] = { ...data.sales[recordIndex], ...req.body };
        await writeJSONFile(RECORDS_FILE, data);
        res.json(data.sales[recordIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update record' });
    }
});

app.delete('/api/records/:index', async (req, res) => {
    try {
        const data = await readJSONFile(RECORDS_FILE);
        const recordIndex = parseInt(req.params.index);
        
        if (recordIndex < 0 || recordIndex >= data.sales.length) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        data.sales.splice(recordIndex, 1);
        await writeJSONFile(RECORDS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// Routes for SA Pedigrees
app.get('/api/sa-pedigrees', async (req, res) => {
    try {
        const data = await readJSONFile(SA_PEDIGREES_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read SA pedigrees data' });
    }
});

app.post('/api/sa-pedigrees/books', async (req, res) => {
    try {
        const data = await readJSONFile(SA_PEDIGREES_FILE);
        const newBook = req.body;
        data.books.push(newBook);
        await writeJSONFile(SA_PEDIGREES_FILE, data);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create SA pedigree book' });
    }
});

app.put('/api/sa-pedigrees/books/:index', async (req, res) => {
    try {
        const data = await readJSONFile(SA_PEDIGREES_FILE);
        const bookIndex = parseInt(req.params.index);
        
        if (bookIndex < 0 || bookIndex >= data.books.length) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        data.books[bookIndex] = { ...data.books[bookIndex], ...req.body };
        await writeJSONFile(SA_PEDIGREES_FILE, data);
        res.json(data.books[bookIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update SA pedigree book' });
    }
});

app.delete('/api/sa-pedigrees/books/:index', async (req, res) => {
    try {
        const data = await readJSONFile(SA_PEDIGREES_FILE);
        const bookIndex = parseInt(req.params.index);
        
        if (bookIndex < 0 || bookIndex >= data.books.length) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        data.books.splice(bookIndex, 1);
        await writeJSONFile(SA_PEDIGREES_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete SA pedigree book' });
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (skip when imported for testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CRUD Web App running on http://localhost:${PORT}`);
    });
}

module.exports = app;