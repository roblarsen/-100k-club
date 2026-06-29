const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

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

// Mirrors isAltAsset() from the alt-asset-spec package for server-side validation.
function isAltAsset(obj) {
    if (!obj || typeof obj !== 'object') return false;
    const hasRequiredRootKeys = typeof obj.urn === 'string' &&
        typeof obj.schemaVersion === 'string' &&
        ['comic', 'trading_card', 'video_game', 'coin'].includes(obj.assetClass) &&
        typeof obj.currentAuthentication === 'object' &&
        Array.isArray(obj.provenanceLedger) &&
        typeof obj.customMetadata === 'object';
    if (!hasRequiredRootKeys) return false;
    const auth = obj.currentAuthentication;
    return typeof auth.grader === 'string' &&
        typeof auth.rawGradeString === 'string' &&
        typeof auth.isActive === 'boolean';
}

// Returns the trimmed string value, or undefined if empty/absent (omits the field from stored objects)
function optField(value) {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed || undefined;
}

// Routes for Books (AltAssetComic format — data/books.json is a plain array)

// Raw book creation: accepts a complete AltAssetComic object (validated against spec).
// Must be defined before /api/books/:index to avoid "raw" being parsed as an index.
app.post('/api/books/raw', async (req, res) => {
    try {
        if (!isAltAsset(req.body)) {
            return res.status(400).json({ error: 'Object does not conform to AltAsset spec' });
        }
        const data = await readJSONFile(BOOKS_FILE);
        data.push(req.body);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// Raw book replacement: replaces the full record at :index with the provided AltAssetComic object.
app.put('/api/books/:index/raw', async (req, res) => {
    try {
        if (!isAltAsset(req.body)) {
            return res.status(400).json({ error: 'Object does not conform to AltAsset spec' });
        }
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }
        data[index] = req.body;
        await writeJSONFile(BOOKS_FILE, data);
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

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

// Routes for Book Provenance Ledger Events (all event types)
app.get('/api/books/:index/sales', async (req, res) => {
    try {
        const data = await readJSONFile(BOOKS_FILE);
        const index = parseInt(req.params.index);
        if (isNaN(index) || index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const events = (data[index].provenanceLedger || [])
            .map((event, ledgerIndex) => ({ ...event, _ledgerIndex: ledgerIndex }));
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read book ledger data' });
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

        const eventType = req.body.eventType || 'auction_sale';
        const financialTypes = ['auction_sale', 'private_sale', 'asset_swap'];
        const certTypes = ['regrade', 'reholder'];

        const newEvent = {
            eventId: `evt_${randomUUID()}`,
            eventType,
            date: req.body.date || ''
        };

        if (req.body.platform) newEvent.platform = optField(req.body.platform);
        if (req.body.sourceLink) newEvent.sourceLink = optField(req.body.sourceLink);
        if (req.body.notes) newEvent.notes = optField(req.body.notes);

        if (eventType === 'auction_sale' && req.body.lotNumber) {
            newEvent.lotNumber = optField(req.body.lotNumber);
        }

        if (financialTypes.includes(eventType) && req.body.amount != null && req.body.amount !== '') {
            const rawAmount = String(req.body.amount).replace(/[^0-9.]/g, '');
            const parsedAmount = parseFloat(rawAmount);
            if (!isNaN(parsedAmount)) {
                newEvent.financials = {
                    amount: parsedAmount,
                    currency: req.body.currency || 'USD'
                };
            }
        }

        if (certTypes.includes(eventType)) {
            if (req.body.previousCertNumber) newEvent.previousCertNumber = optField(req.body.previousCertNumber);
            if (req.body.newCertNumber) newEvent.newCertNumber = optField(req.body.newCertNumber);
        }

        if (eventType === 'asset_merge' && req.body.mergedUrn) {
            newEvent.mergedUrn = optField(req.body.mergedUrn);
        }

        book.provenanceLedger.push(newEvent);
        await writeJSONFile(BOOKS_FILE, data);
        res.status(201).json({ ...newEvent, _ledgerIndex: book.provenanceLedger.length - 1 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add ledger event to book' });
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
            return res.status(404).json({ error: 'Ledger event not found' });
        }

        const existing = ledger[ledgerIndex];
        const eventType = req.body.eventType !== undefined ? req.body.eventType : existing.eventType;
        const financialTypes = ['auction_sale', 'private_sale', 'asset_swap'];
        const certTypes = ['regrade', 'reholder'];

        const updated = {
            ...existing,
            eventType,
            ...(req.body.date !== undefined && { date: req.body.date }),
            ...(req.body.platform !== undefined && { platform: optField(req.body.platform) }),
            ...(req.body.sourceLink !== undefined && { sourceLink: optField(req.body.sourceLink) }),
            ...(req.body.notes !== undefined && { notes: optField(req.body.notes) })
        };

        if (eventType === 'auction_sale') {
            if (req.body.lotNumber !== undefined) updated.lotNumber = optField(req.body.lotNumber);
        } else {
            delete updated.lotNumber;
        }

        if (financialTypes.includes(eventType) && req.body.amount != null && req.body.amount !== '') {
            const rawAmount = String(req.body.amount).replace(/[^0-9.]/g, '');
            const parsedAmount = parseFloat(rawAmount);
            if (!isNaN(parsedAmount)) {
                updated.financials = { amount: parsedAmount, currency: req.body.currency || existing.financials?.currency || 'USD' };
            }
        } else if (!financialTypes.includes(eventType)) {
            delete updated.financials;
        }

        if (certTypes.includes(eventType)) {
            if (req.body.previousCertNumber !== undefined) updated.previousCertNumber = optField(req.body.previousCertNumber);
            if (req.body.newCertNumber !== undefined) updated.newCertNumber = optField(req.body.newCertNumber);
        } else {
            delete updated.previousCertNumber;
            delete updated.newCertNumber;
        }

        if (eventType === 'asset_merge') {
            if (req.body.mergedUrn !== undefined) updated.mergedUrn = optField(req.body.mergedUrn);
        } else {
            delete updated.mergedUrn;
        }

        ledger[ledgerIndex] = updated;
        await writeJSONFile(BOOKS_FILE, data);
        res.json(ledger[ledgerIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ledger event' });
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

// Start server (skip when imported for testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CRUD Web App running on http://localhost:${PORT}`);
    });
}

module.exports = app;