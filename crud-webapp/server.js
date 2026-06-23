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
const BOOKS_FILE = path.join(__dirname, '../data/books.json');
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

// Helper to build a URN from book metadata
function buildUrn(publisher, title, issue, index) {
    const slug = str => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `urn:altasset:comic:${slug(publisher)}:${slug(title)}:${slug(issue)}:inst-${index}`;
}

// Routes for Books (AltAssetComic format — data/books.json is a plain array)
app.get('/api/books', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read books data' });
    }
});

app.get('/api/books/:index', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book data' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const body = req.body;
        const index = data.length;
        const publisher = body.publisher || 'Unknown';
        const title = body.title || 'Unknown';
        const issue = body.issueNumber || '0';

        const newBook = {
            urn: buildUrn(publisher, title, issue, index),
            schemaVersion: '1.0.0',
            assetClass: 'comic',
            currentAuthentication: {
                grader: body.grader || 'Unknown',
                numericGrade: parseFloat(body.rawGradeString) || 0,
                rawGradeString: body.rawGradeString || '',
                isActive: true,
                qualifiers: body.pedigree ? [body.pedigree] : []
            },
            provenanceLedger: [],
            tags: body.tags ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            generalCommentary: body.generalCommentary || '',
            customMetadata: {
                publisher,
                title,
                issueNumber: issue,
                publicationDate: body.publicationDate || 'Unknown',
                ...(body.cgcId ? { cgcId: body.cgcId } : {})
            }
        };

        data.push(newBook);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json({ _index: index, ...newBook });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

app.put('/api/books/:index', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const existing = data[index];
        const body = req.body;

        data[index] = {
            ...existing,
            currentAuthentication: {
                ...existing.currentAuthentication,
                grader: body.grader !== undefined ? body.grader : existing.currentAuthentication.grader,
                numericGrade: body.rawGradeString !== undefined ? (parseFloat(body.rawGradeString) || 0) : existing.currentAuthentication.numericGrade,
                rawGradeString: body.rawGradeString !== undefined ? body.rawGradeString : existing.currentAuthentication.rawGradeString,
                qualifiers: body.pedigree !== undefined ? (body.pedigree ? [body.pedigree] : []) : existing.currentAuthentication.qualifiers
            },
            tags: body.tags !== undefined ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : existing.tags,
            generalCommentary: body.generalCommentary !== undefined ? body.generalCommentary : existing.generalCommentary,
            customMetadata: {
                ...existing.customMetadata,
                ...(body.publisher !== undefined && { publisher: body.publisher }),
                ...(body.title !== undefined && { title: body.title }),
                ...(body.issueNumber !== undefined && { issueNumber: body.issueNumber }),
                ...(body.publicationDate !== undefined && { publicationDate: body.publicationDate }),
                ...(body.cgcId !== undefined && { cgcId: body.cgcId })
            }
        };

        await writeJSONFile(BOOKS_FILE, data);
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/api/books/:index', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        data.splice(index, 1);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Routes for Book Sales — stored as provenanceLedger events
app.get('/api/books/:index/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const sales = (data[index].provenanceLedger || [])
            .map((event, ledgerIndex) => ({ ...event, _ledgerIndex: ledgerIndex }))
            .filter(e => e.eventType === 'auction_sale' || e.eventType === 'private_sale');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book sales data' });
    }
});

app.post('/api/books/:index/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = data[index];
        if (!book.provenanceLedger) book.provenanceLedger = [];

        const saleCount = book.provenanceLedger.filter(
            e => e.eventType === 'auction_sale' || e.eventType === 'private_sale'
        ).length;
        const urnSlug = book.urn.replace(/^urn:altasset:comic:/, '').replace(/:/g, '_');

        const newEvent = {
            eventId: `evt_${urnSlug}_sale_${saleCount}`,
            eventType: req.body.eventType || 'auction_sale',
            date: req.body.date || '',
            platform: req.body.platform || '',
            sourceLink: req.body.sourceLink || '',
            financials: {
                amount: Number(req.body.amount) || 0,
                currency: 'USD'
            }
        };

        book.provenanceLedger.push(newEvent);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json({ ...newEvent, _ledgerIndex: book.provenanceLedger.length - 1 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add sale to book' });
    }
});

app.put('/api/books/:index/sales/:ledgerIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        const ledgerIndex = parseInt(req.params.ledgerIndex);

        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const ledger = data[index].provenanceLedger || [];
        if (isNaN(ledgerIndex) || ledgerIndex < 0 || ledgerIndex >= ledger.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        ledger[ledgerIndex] = {
            ...ledger[ledgerIndex],
            ...(req.body.eventType !== undefined && { eventType: req.body.eventType }),
            ...(req.body.date !== undefined && { date: req.body.date }),
            ...(req.body.platform !== undefined && { platform: req.body.platform }),
            ...(req.body.sourceLink !== undefined && { sourceLink: req.body.sourceLink }),
            financials: {
                amount: req.body.amount !== undefined ? Number(req.body.amount) : ledger[ledgerIndex].financials.amount,
                currency: 'USD'
            }
        };

        await writeJSONFile(BOOKS_FILE, data);
        res.json(ledger[ledgerIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book sale' });
    }
});

app.delete('/api/books/:index/sales/:ledgerIndex', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        const ledgerIndex = parseInt(req.params.ledgerIndex);

        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const ledger = data[index].provenanceLedger || [];
        if (isNaN(ledgerIndex) || ledgerIndex < 0 || ledgerIndex >= ledger.length) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        ledger.splice(ledgerIndex, 1);
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