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
const DATA_DIR = '../data/data';
const BOOKS_FILE = path.join(__dirname, DATA_DIR, 'books.dev.json');
const RECORDS_FILE = path.join(__dirname, DATA_DIR, 'records.json');
const SA_PEDIGREES_FILE = path.join(__dirname, DATA_DIR, 'sa-pedigrees.dev.json');

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
        const book = data.books.find(b => b.id === req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book data' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const newBook = req.body;
        
        // Generate new ID
        const maxId = Math.max(...data.books.map(b => parseInt(b.id) || 0));
        newBook.id = String(maxId + 1).padStart(4, '0');
        
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
        const bookIndex = data.books.findIndex(b => b.id === req.params.id);
        
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        data.books[bookIndex] = { ...data.books[bookIndex], ...req.body };
        await writeJSONFile(BOOKS_FILE, data);
        res.json(data.books[bookIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const bookIndex = data.books.findIndex(b => b.id === req.params.id);
        
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        data.books.splice(bookIndex, 1);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Routes for Book Sales Management
app.get('/api/books/:id/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const book = data.books.find(b => b.id === req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book.sales || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book sales data' });
    }
});

app.post('/api/books/:id/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const bookIndex = data.books.findIndex(b => b.id === req.params.id);
        
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        if (!data.books[bookIndex].sales) {
            data.books[bookIndex].sales = [];
        }
        
        const newSale = req.body;
        data.books[bookIndex].sales.push(newSale);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add sale to book' });
    }
});

app.put('/api/books/:id/sales/:saleIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const bookIndex = data.books.findIndex(b => b.id === req.params.id);
        const saleIndex = parseInt(req.params.saleIndex);
        
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        if (!data.books[bookIndex].sales || saleIndex < 0 || saleIndex >= data.books[bookIndex].sales.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        data.books[bookIndex].sales[saleIndex] = { ...data.books[bookIndex].sales[saleIndex], ...req.body };
        await writeJSONFile(BOOKS_FILE, data);
        res.json(data.books[bookIndex].sales[saleIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book sale' });
    }
});

app.delete('/api/books/:id/sales/:saleIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const bookIndex = data.books.findIndex(b => b.id === req.params.id);
        const saleIndex = parseInt(req.params.saleIndex);
        
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        if (!data.books[bookIndex].sales || saleIndex < 0 || saleIndex >= data.books[bookIndex].sales.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        data.books[bookIndex].sales.splice(saleIndex, 1);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book sale' });
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

// Start server
app.listen(PORT, () => {
    console.log(`CRUD Web App running on http://localhost:${PORT}`);
});