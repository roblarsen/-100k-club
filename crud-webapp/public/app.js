// Global state
let booksData = null;
let recordsData = null;
let pedigreesData = null;
let currentEditingBook = null;
let currentEditingRecord = null;
let currentEditingPedigree = null;
let rawJsonViewActive = false;

// Mirrors isAltAsset() from the alt-asset-spec package for client-side validation.
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

// Returns the trimmed string value, or undefined if empty (omits optional fields from payloads)
function trimOrUndefined(value) {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed || undefined;
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    await loadAllData();
    showSection('books');
});

// API functions
async function apiCall(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return method === 'DELETE' ? null : await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showError('Operation failed: ' + error.message);
        throw error;
    }
}

// Load all data
async function loadAllData() {
    try {
        showLoading('Loading data...');
        const [books, records, pedigrees] = await Promise.all([
            apiCall('/api/books'),
            apiCall('/api/records'),
            apiCall('/api/sa-pedigrees')
        ]);
        
        booksData = Array.isArray(books) ? books : [];
        recordsData = records;
        pedigreesData = pedigrees;
        
        renderBooks();
        renderRecords();
        renderPedigrees();
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to load data');
    }
}

// Section management
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.data-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    document.getElementById(sectionName + '-nav').classList.add('active');
    
    // Hide any open forms
    hideAllForms();
}

function hideAllForms() {
    document.getElementById('book-form-container').style.display = 'none';
    document.getElementById('record-form-container').style.display = 'none';
    document.getElementById('pedigree-form-container').style.display = 'none';
}

// Books management
function renderBooks() {
    if (!booksData || !booksData.length) return;
    
    const tbody = document.getElementById('books-tbody');
    tbody.innerHTML = '';
    
    booksData.forEach((book, index) => {
        const title = book.customMetadata?.title || '';
        const issue = book.customMetadata?.issueNumber || '';
        const publisher = book.customMetadata?.publisher || '';
        const grade = book.currentAuthentication?.rawGradeString || '';
        const cgcId = book.customMetadata?.cgcId || '';
        const pedigree = book.currentAuthentication?.qualifiers?.[0] || '';
        const saleCount = (book.provenanceLedger || []).length;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${title}</td>
            <td>${issue}</td>
            <td>${publisher}</td>
            <td>${grade}</td>
            <td>${cgcId}</td>
            <td>${pedigree}</td>
            <td>${saleCount}</td>
            <td>
                <button class="btn btn-edit" onclick="editBook(${index})">Edit</button>
                <button class="btn btn-primary" onclick="manageSales(${index})">Ledger</button>
                <button class="btn btn-danger" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBookForm() {
    currentEditingBook = null;
    document.getElementById('book-form-title').textContent = 'Add New Book';
    document.getElementById('book-form').reset();
    resetRawJsonView();
    document.getElementById('book-form-container').style.display = 'block';
}

function editBook(bookIndex) {
    const book = booksData[bookIndex];
    if (!book) return;
    
    currentEditingBook = { index: bookIndex, book };
    document.getElementById('book-form-title').textContent = 'Edit Book';
    
    // Populate form from AltAssetComic fields
    populateFormFromBook(book);
    resetRawJsonView();
    
    document.getElementById('book-form-container').style.display = 'block';
}

async function deleteBook(bookIndex) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        await apiCall(`/api/books/${bookIndex}`, 'DELETE');
        await loadAllData();
        showSuccess('Book deleted successfully');
    } catch (error) {
        showError('Failed to delete book');
    }
}

function cancelBookForm() {
    document.getElementById('book-form-container').style.display = 'none';
    currentEditingBook = null;
    resetRawJsonView();
}

// ── Raw JSON view helpers ────────────────────────────────────────────────────

/**
 * Resets raw-JSON-view state to off and restores the default form appearance.
 * Call whenever the form is opened or closed.
 */
function resetRawJsonView() {
    rawJsonViewActive = false;
    document.getElementById('book-raw-json-pane').style.display = 'none';
    document.getElementById('book-edit-split').classList.remove('split-view');
    document.getElementById('book-raw-toggle').textContent = 'Show Raw JSON';
    document.getElementById('book-json-error').style.display = 'none';
    document.getElementById('book-spec-error').style.display = 'none';
    document.getElementById('book-save-btn').disabled = false;
    document.getElementById('book-raw-json').value = '';
}

/**
 * Builds a complete AltAssetComic object from the current form field values,
 * merged on top of the base object being edited (preserving fields like
 * provenanceLedger that the form does not expose).
 */
function buildCurrentBookObject() {
    const base = currentEditingBook
        ? JSON.parse(JSON.stringify(currentEditingBook.book))
        : {
            urn: '',
            schemaVersion: '1.0.0',
            assetClass: 'comic',
            currentAuthentication: {
                grader: '',
                numericGrade: 0,
                rawGradeString: '',
                isActive: true,
                qualifiers: []
            },
            provenanceLedger: [],
            tags: [],
            generalCommentary: '',
            customMetadata: {
                publisher: '',
                title: '',
                issueNumber: '',
                publicationDate: 'Unknown'
            }
        };

    const cgcId = document.getElementById('book-cgcid').value.trim();
    const metadata = {
        ...(base.customMetadata || {}),
        title: document.getElementById('book-title').value,
        issueNumber: document.getElementById('book-issue').value,
        publisher: document.getElementById('book-publisher').value
    };
    if (cgcId) {
        metadata.cgcId = cgcId;
    } else {
        delete metadata.cgcId;
    }
    base.customMetadata = metadata;

    const pedigree = document.getElementById('book-pedigree').value.trim();
    base.currentAuthentication = {
        ...(base.currentAuthentication || {}),
        rawGradeString: document.getElementById('book-grade').value,
        grader: document.getElementById('book-gradeSource').value,
        isActive: base.currentAuthentication?.isActive ?? true,
        qualifiers: pedigree ? [pedigree] : []
    };

    const tagsRaw = document.getElementById('book-tags').value;
    base.tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
    base.generalCommentary = document.getElementById('book-commentary').value;

    return base;
}

/**
 * Populates the visual form fields from an AltAssetComic object.
 */
function populateFormFromBook(book) {
    document.getElementById('book-title').value = book.customMetadata?.title || '';
    document.getElementById('book-issue').value = book.customMetadata?.issueNumber || '';
    document.getElementById('book-publisher').value = book.customMetadata?.publisher || '';
    document.getElementById('book-grade').value = book.currentAuthentication?.rawGradeString || '';
    document.getElementById('book-gradeSource').value = book.currentAuthentication?.grader || '';
    document.getElementById('book-cgcid').value = book.customMetadata?.cgcId || '';
    document.getElementById('book-pedigree').value = book.currentAuthentication?.qualifiers?.[0] || '';
    document.getElementById('book-tags').value = (book.tags || []).join(',');
    document.getElementById('book-commentary').value = book.generalCommentary || '';
}

/**
 * Toggles the raw-JSON split view on/off.
 * Opening: serialises the current form state to the textarea.
 * Closing:  parses the textarea back into the form fields (if valid).
 */
function toggleRawJsonView() {
    rawJsonViewActive = !rawJsonViewActive;
    const jsonPane = document.getElementById('book-raw-json-pane');
    const toggleBtn = document.getElementById('book-raw-toggle');
    const splitContainer = document.getElementById('book-edit-split');

    if (rawJsonViewActive) {
        document.getElementById('book-raw-json').value = JSON.stringify(buildCurrentBookObject(), null, 2);
        jsonPane.style.display = 'flex';
        splitContainer.classList.add('split-view');
        toggleBtn.textContent = 'Hide Raw JSON';
        validateRawJson();
    } else {
        // Sync valid JSON back into the form before hiding the pane
        try {
            populateFormFromBook(JSON.parse(document.getElementById('book-raw-json').value));
        } catch (_parseError) { /* keep existing form values if JSON is malformed */ }
        jsonPane.style.display = 'none';
        splitContainer.classList.remove('split-view');
        toggleBtn.textContent = 'Show Raw JSON';
        document.getElementById('book-json-error').style.display = 'none';
        document.getElementById('book-spec-error').style.display = 'none';
        document.getElementById('book-save-btn').disabled = false;
    }
}

/**
 * Handles input on the raw JSON textarea:
 * validates syntax + spec, and syncs valid JSON into the visual form fields.
 */
function onRawJsonInput() {
    if (!rawJsonViewActive) return;
    validateRawJson();
    try {
        populateFormFromBook(JSON.parse(document.getElementById('book-raw-json').value));
    } catch (_parseError) { /* don't update form while JSON is invalid */ }
}

/**
 * Validates the raw JSON textarea for syntax correctness and AltAsset spec
 * compliance.  Updates the error labels and enables/disables the save button.
 * Returns true when the object is valid and ready to save.
 */
function validateRawJson() {
    const textarea = document.getElementById('book-raw-json');
    const jsonErrorEl = document.getElementById('book-json-error');
    const specErrorEl = document.getElementById('book-spec-error');
    const saveBtn = document.getElementById('book-save-btn');

    let parsed;
    try {
        parsed = JSON.parse(textarea.value);
        jsonErrorEl.style.display = 'none';
    } catch (_parseError) {
        jsonErrorEl.style.display = 'inline';
        specErrorEl.style.display = 'none';
        saveBtn.disabled = true;
        return false;
    }

    if (!isAltAsset(parsed)) {
        specErrorEl.textContent = '\u26a0 Object does not conform to AltAsset spec — check: urn (string), assetClass (comic|trading_card|video_game|coin), currentAuthentication.grader / rawGradeString / isActive, provenanceLedger (array), customMetadata (object)';
        specErrorEl.style.display = 'block';
        saveBtn.disabled = true;
        return false;
    }

    specErrorEl.style.display = 'none';
    saveBtn.disabled = false;
    return true;
}

// ── End raw JSON view helpers ────────────────────────────────────────────────

// Book form submission
document.getElementById('book-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Raw JSON mode: validate and save the full AltAssetComic object directly
    if (rawJsonViewActive) {
        if (!validateRawJson()) return;
        let parsedBook;
        try {
            parsedBook = JSON.parse(document.getElementById('book-raw-json').value);
        } catch (_parseError) {
            showError('Invalid JSON: cannot save');
            return;
        }
        if (!isAltAsset(parsedBook)) {
            showError('Object does not conform to AltAsset spec');
            return;
        }
        try {
            if (currentEditingBook) {
                await apiCall(`/api/books/${currentEditingBook.index}/raw`, 'PUT', parsedBook);
                showSuccess('Book updated successfully');
            } else {
                await apiCall('/api/books/raw', 'POST', parsedBook);
                showSuccess('Book added successfully');
            }
            cancelBookForm();
            await loadAllData();
        } catch (error) {
            showError('Failed to save book');
        }
        return;
    }

    const formData = {
        title: document.getElementById('book-title').value,
        issueNumber: document.getElementById('book-issue').value,
        publisher: document.getElementById('book-publisher').value,
        rawGradeString: document.getElementById('book-grade').value,
        grader: document.getElementById('book-gradeSource').value,
        cgcId: document.getElementById('book-cgcid').value,
        pedigree: document.getElementById('book-pedigree').value,
        tags: document.getElementById('book-tags').value,
        generalCommentary: document.getElementById('book-commentary').value
    };
    
    try {
        if (currentEditingBook) {
            await apiCall(`/api/books/${currentEditingBook.index}`, 'PUT', formData);
            showSuccess('Book updated successfully');
        } else {
            await apiCall('/api/books', 'POST', formData);
            showSuccess('Book added successfully');
        }
        
        cancelBookForm();
        await loadAllData();
    } catch (error) {
        showError('Failed to save book');
    }
});

// Sync visual form fields → JSON textarea whenever an input changes while raw view is active
document.getElementById('book-form').addEventListener('input', function() {
    if (!rawJsonViewActive) return;
    document.getElementById('book-raw-json').value = JSON.stringify(buildCurrentBookObject(), null, 2);
});

// Sales management for individual books
let currentBookSales = null;
let currentEditingSale = null;

function manageSales(bookIndex) {
    const book = booksData[bookIndex];
    if (!book) return;
    
    currentBookSales = { bookIndex, book };
    document.getElementById('sales-modal-title').textContent = `Provenance Ledger — ${book.customMetadata?.title || ''} #${book.customMetadata?.issueNumber || ''}`;
    document.getElementById('sales-modal').style.display = 'flex';
    
    renderSales();
}

function closeSalesModal() {
    document.getElementById('sales-modal').style.display = 'none';
    currentBookSales = null;
    currentEditingSale = null;
    cancelSaleForm();
}

function renderSales() {
    if (!currentBookSales) return;
    
    const ledger = (currentBookSales.book.provenanceLedger || [])
        .map((event, ledgerIndex) => ({ ...event, _ledgerIndex: ledgerIndex }));

    const tbody = document.getElementById('sales-tbody');
    tbody.innerHTML = '';
    
    ledger.forEach((event) => {
        const row = document.createElement('tr');
        const amount = event.financials?.amount != null
            ? `$${Number(event.financials.amount).toLocaleString()} ${event.financials.currency || 'USD'}`
            : '—';
        
        let details = '';
        if (event.lotNumber) details += `Lot: ${event.lotNumber} `;
        if (event.previousCertNumber) details += `Prev cert: ${event.previousCertNumber} `;
        if (event.newCertNumber) details += `New cert: ${event.newCertNumber} `;
        if (event.mergedUrn) details += `Merged: ${event.mergedUrn} `;
        if (event.notes) details += event.notes;
        if (event.sourceLink) details += ` <a href="${event.sourceLink}" target="_blank">View</a>`;

        row.innerHTML = `
            <td><span class="event-type-badge event-type-${event.eventType}">${event.eventType}</span></td>
            <td>${event.date || ''}</td>
            <td>${event.platform || ''}</td>
            <td>${amount}</td>
            <td>${details}</td>
            <td>
                <button class="btn btn-edit" onclick="editSale(${event._ledgerIndex})">Edit</button>
                <button class="btn btn-danger" onclick="deleteSale(${event._ledgerIndex})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddSaleForm() {
    currentEditingSale = null;
    document.getElementById('sale-form-title').textContent = 'Add New Provenance Event';
    document.getElementById('sale-form').reset();
    document.getElementById('sale-eventType').value = 'auction_sale';
    onEventTypeChange();
    document.getElementById('sale-form-container').style.display = 'block';
}

function onEventTypeChange() {
    const type = document.getElementById('sale-eventType').value;
    const financialTypes = ['auction_sale', 'private_sale', 'asset_swap'];
    const certTypes = ['regrade', 'reholder'];

    document.getElementById('fields-financial').style.display = financialTypes.includes(type) ? 'flex' : 'none';
    document.getElementById('fields-cert').style.display = certTypes.includes(type) ? 'flex' : 'none';
    document.getElementById('fields-merge').style.display = type === 'asset_merge' ? 'flex' : 'none';
    document.getElementById('field-lotNumber').style.display = type === 'auction_sale' ? 'flex' : 'none';
}

function editSale(ledgerIndex) {
    if (!currentBookSales) return;
    
    const event = (currentBookSales.book.provenanceLedger || [])[ledgerIndex];
    if (!event) return;
    
    currentEditingSale = { ledgerIndex };
    document.getElementById('sale-form-title').textContent = 'Edit Provenance Event';
    
    document.getElementById('sale-eventType').value = event.eventType || 'auction_sale';
    document.getElementById('sale-date').value = event.date || '';
    document.getElementById('sale-venue').value = event.platform || '';
    document.getElementById('sale-lotNumber').value = event.lotNumber || '';
    document.getElementById('sale-link').value = event.sourceLink || '';
    document.getElementById('sale-notes').value = event.notes || '';
    document.getElementById('sale-price').value = event.financials?.amount != null ? event.financials.amount : '';
    document.getElementById('sale-currency').value = event.financials?.currency || 'USD';
    document.getElementById('sale-previousCertNumber').value = event.previousCertNumber || '';
    document.getElementById('sale-newCertNumber').value = event.newCertNumber || '';
    document.getElementById('sale-mergedUrn').value = event.mergedUrn || '';
    
    onEventTypeChange();
    document.getElementById('sale-form-container').style.display = 'block';
}

async function deleteSale(ledgerIndex) {
    if (!currentBookSales || !confirm('Are you sure you want to delete this sale?')) return;
    
    try {
        await apiCall(`/api/books/${currentBookSales.bookIndex}/sales/${ledgerIndex}`, 'DELETE');
        await loadAllData();
        // Update the current book reference
        currentBookSales.book = booksData[currentBookSales.bookIndex];
        renderSales();
        showSuccess('Sale deleted successfully');
    } catch (error) {
        showError('Failed to delete sale');
    }
}

function cancelSaleForm() {
    document.getElementById('sale-form-container').style.display = 'none';
    currentEditingSale = null;
}

// Sale form submission
document.getElementById('sale-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentBookSales) return;
    
    const eventType = document.getElementById('sale-eventType').value;
    const financialTypes = ['auction_sale', 'private_sale', 'asset_swap'];
    const certTypes = ['regrade', 'reholder'];

    // Sanitize amount: strip commas and currency symbols, then parse as float
    const rawAmount = document.getElementById('sale-price').value.replace(/[^0-9.]/g, '');
    const parsedAmount = rawAmount ? parseFloat(rawAmount) : null;

    // Sanitize date: if missing day component, format as YYYY-MM; otherwise keep as-is
    const rawDate = document.getElementById('sale-date').value.trim();
    let date = rawDate;
    if (rawDate) {
        const parts = rawDate.split('-');
        if (parts.length === 2) {
            date = `${parts[0].padStart(4, '0')}-${parts[1].padStart(2, '0')}`;
        } else if (parts.length >= 3) {
            date = `${parts[0].padStart(4, '0')}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        }
    }

    const formData = {
        eventType,
        date,
        platform: trimOrUndefined(document.getElementById('sale-venue').value),
        sourceLink: trimOrUndefined(document.getElementById('sale-link').value),
        notes: trimOrUndefined(document.getElementById('sale-notes').value),
        ...(eventType === 'auction_sale' && {
            lotNumber: trimOrUndefined(document.getElementById('sale-lotNumber').value)
        }),
        ...(financialTypes.includes(eventType) && parsedAmount != null && {
            amount: parsedAmount,
            currency: document.getElementById('sale-currency').value || 'USD'
        }),
        ...(certTypes.includes(eventType) && {
            previousCertNumber: trimOrUndefined(document.getElementById('sale-previousCertNumber').value),
            newCertNumber: trimOrUndefined(document.getElementById('sale-newCertNumber').value)
        }),
        ...(eventType === 'asset_merge' && {
            mergedUrn: trimOrUndefined(document.getElementById('sale-mergedUrn').value)
        })
    };
    
    try {
        if (currentEditingSale) {
            await apiCall(`/api/books/${currentBookSales.bookIndex}/sales/${currentEditingSale.ledgerIndex}`, 'PUT', formData);
            showSuccess('Event updated successfully');
        } else {
            await apiCall(`/api/books/${currentBookSales.bookIndex}/sales`, 'POST', formData);
            showSuccess('Event added successfully');
        }
        
        cancelSaleForm();
        await loadAllData();
        // Update the current book reference
        currentBookSales.book = booksData[currentBookSales.bookIndex];
        renderSales();
    } catch (error) {
        showError('Failed to save event');
    }
});

// Records management
function renderRecords() {
    if (!recordsData || !recordsData.sales) return;
    
    const tbody = document.getElementById('records-tbody');
    tbody.innerHTML = '';
    
    recordsData.sales.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.title || ''}</td>
            <td>${record.issue || ''}</td>
            <td>${record.grade || ''}</td>
            <td>$${record.price ? Number(record.price).toLocaleString() : '0'}</td>
            <td>${record.date || ''}</td>
            <td>${record.seller || ''}</td>
            <td>
                <button class="btn btn-edit" onclick="editRecord(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddRecordForm() {
    currentEditingRecord = null;
    document.getElementById('record-form-title').textContent = 'Add New Record';
    document.getElementById('record-form').reset();
    document.getElementById('record-form-container').style.display = 'block';
}

function editRecord(recordIndex) {
    const record = recordsData.sales[recordIndex];
    if (!record) return;
    
    currentEditingRecord = recordIndex;
    document.getElementById('record-form-title').textContent = 'Edit Record';
    
    // Populate form
    document.getElementById('record-title').value = record.title || '';
    document.getElementById('record-issue').value = record.issue || '';
    document.getElementById('record-grade').value = record.grade || '';
    document.getElementById('record-price').value = record.price || '';
    document.getElementById('record-date').value = record.date || '';
    document.getElementById('record-seller').value = record.seller || '';
    document.getElementById('record-buyer').value = record.buyer || '';
    document.getElementById('record-note').value = record.note || '';
    
    document.getElementById('record-form-container').style.display = 'block';
}

async function deleteRecord(recordIndex) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
        await apiCall(`/api/records/${recordIndex}`, 'DELETE');
        await loadAllData();
        showSuccess('Record deleted successfully');
    } catch (error) {
        showError('Failed to delete record');
    }
}

function cancelRecordForm() {
    document.getElementById('record-form-container').style.display = 'none';
    currentEditingRecord = null;
}

// Record form submission
document.getElementById('record-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('record-title').value,
        issue: document.getElementById('record-issue').value,
        grade: document.getElementById('record-grade').value,
        price: Number(document.getElementById('record-price').value),
        date: document.getElementById('record-date').value,
        seller: document.getElementById('record-seller').value,
        buyer: document.getElementById('record-buyer').value,
        note: document.getElementById('record-note').value,
        goodDate: true,
        inflationAdjustedPrice: ""
    };
    
    try {
        if (currentEditingRecord !== null) {
            await apiCall(`/api/records/${currentEditingRecord}`, 'PUT', formData);
            showSuccess('Record updated successfully');
        } else {
            await apiCall('/api/records', 'POST', formData);
            showSuccess('Record added successfully');
        }
        
        cancelRecordForm();
        await loadAllData();
    } catch (error) {
        showError('Failed to save record');
    }
});

// Pedigrees management
function renderPedigrees() {
    if (!pedigreesData || !pedigreesData.keys || !pedigreesData.books) return;
    
    // Render table header
    const thead = document.getElementById('pedigrees-thead');
    thead.innerHTML = `
        <tr>
            <th>Title</th>
            ${pedigreesData.keys.map(key => `<th title="${key.full}">${key.short}</th>`).join('')}
            <th>Publisher</th>
            <th>Actions</th>
        </tr>
    `;
    
    // Render table body
    const tbody = document.getElementById('pedigrees-tbody');
    tbody.innerHTML = '';
    
    pedigreesData.books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title || ''}</td>
            ${pedigreesData.keys.map(key => `<td>${book[key.short] || ''}</td>`).join('')}
            <td>${book.pub || ''}</td>
            <td>
                <button class="btn btn-edit" onclick="editPedigree(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deletePedigree(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddPedigreeForm() {
    currentEditingPedigree = null;
    document.getElementById('pedigree-form-title').textContent = 'Add New Pedigree Book';
    document.getElementById('pedigree-form').reset();
    generatePedigreedGradeInputs();
    document.getElementById('pedigree-form-container').style.display = 'block';
}

function generatePedigreedGradeInputs() {
    if (!pedigreesData || !pedigreesData.keys) return;
    
    const container = document.getElementById('pedigree-grades');
    container.innerHTML = '';
    
    pedigreesData.keys.forEach(key => {
        const div = document.createElement('div');
        div.className = 'pedigree-grade-input';
        div.innerHTML = `
            <label for="pedigree-${key.short}" title="${key.full}">${key.short} (${key.full}):</label>
            <input type="text" id="pedigree-${key.short}" name="${key.short}">
        `;
        container.appendChild(div);
    });
}

function editPedigree(pedigreeIndex) {
    const book = pedigreesData.books[pedigreeIndex];
    if (!book) return;
    
    currentEditingPedigree = pedigreeIndex;
    document.getElementById('pedigree-form-title').textContent = 'Edit Pedigree Book';
    
    // Populate basic fields
    document.getElementById('pedigree-title').value = book.title || '';
    document.getElementById('pedigree-pub').value = book.pub || '';
    
    // Populate pedigree grade fields
    generatePedigreedGradeInputs();
    pedigreesData.keys.forEach(key => {
        const input = document.getElementById(`pedigree-${key.short}`);
        if (input) {
            input.value = book[key.short] || '';
        }
    });
    
    document.getElementById('pedigree-form-container').style.display = 'block';
}

async function deletePedigree(pedigreeIndex) {
    if (!confirm('Are you sure you want to delete this pedigree book?')) return;
    
    try {
        await apiCall(`/api/sa-pedigrees/books/${pedigreeIndex}`, 'DELETE');
        await loadAllData();
        showSuccess('Pedigree book deleted successfully');
    } catch (error) {
        showError('Failed to delete pedigree book');
    }
}

function cancelPedigreeForm() {
    document.getElementById('pedigree-form-container').style.display = 'none';
    currentEditingPedigree = null;
}

// Pedigree form submission
document.getElementById('pedigree-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('pedigree-title').value,
        pub: document.getElementById('pedigree-pub').value
    };
    
    // Add pedigree grades
    pedigreesData.keys.forEach(key => {
        const input = document.getElementById(`pedigree-${key.short}`);
        if (input && input.value) {
            formData[key.short] = input.value;
        }
    });
    
    try {
        if (currentEditingPedigree !== null) {
            await apiCall(`/api/sa-pedigrees/books/${currentEditingPedigree}`, 'PUT', formData);
            showSuccess('Pedigree book updated successfully');
        } else {
            await apiCall('/api/sa-pedigrees/books', 'POST', formData);
            showSuccess('Pedigree book added successfully');
        }
        
        cancelPedigreeForm();
        await loadAllData();
    } catch (error) {
        showError('Failed to save pedigree book');
    }
});

// Search/filter functions
function filterBooks() {
    const searchTerm = document.getElementById('books-search').value.toLowerCase();
    const rows = document.querySelectorAll('#books-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterRecords() {
    const searchTerm = document.getElementById('records-search').value.toLowerCase();
    const rows = document.querySelectorAll('#records-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterPedigrees() {
    const searchTerm = document.getElementById('pedigrees-search').value.toLowerCase();
    const rows = document.querySelectorAll('#pedigrees-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.querySelector('main'));
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.body.insertBefore(successDiv, document.querySelector('main'));
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showLoading(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loading';
    loadingDiv.textContent = message;
    document.body.insertBefore(loadingDiv, document.querySelector('main'));
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}