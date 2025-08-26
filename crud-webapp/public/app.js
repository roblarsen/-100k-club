// Global state
let booksData = null;
let recordsData = null;
let pedigreesData = null;
let currentEditingBook = null;
let currentEditingRecord = null;
let currentEditingPedigree = null;
let currentSalesBookId = null;
let currentEditingSale = null;
let currentSaleIndex = null;

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
        
        booksData = books;
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
    if (!booksData || !booksData.books) return;
    
    const tbody = document.getElementById('books-tbody');
    tbody.innerHTML = '';
    
    booksData.books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title || ''}</td>
            <td>${book.issue || ''}</td>
            <td>${book.publisher || ''}</td>
            <td>${book.grade || ''}</td>
            <td>${book.pedigree || ''}</td>
            <td>${book.sales ? book.sales.length : 0}</td>
            <td>
                <button class="btn btn-edit" onclick="editBook('${book.id}')">Edit</button>
                <button class="btn btn-primary" onclick="manageSales('${book.id}')">View Sales</button>
                <button class="btn btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBookForm() {
    currentEditingBook = null;
    document.getElementById('book-form-title').textContent = 'Add New Book';
    document.getElementById('book-form').reset();
    document.getElementById('book-form-container').style.display = 'block';
}

function editBook(bookId) {
    const book = booksData.books.find(b => b.id === bookId);
    if (!book) return;
    
    currentEditingBook = book;
    document.getElementById('book-form-title').textContent = 'Edit Book';
    
    // Populate form
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-issue').value = book.issue || '';
    document.getElementById('book-publisher').value = book.publisher || '';
    document.getElementById('book-grade').value = book.grade || '';
    document.getElementById('book-gradeSource').value = book.gradeSrc || '';
    document.getElementById('book-pedigree').value = book.pedigree || '';
    document.getElementById('book-tags').value = book.tags || '';
    document.getElementById('book-commentary').value = book.generalCommentary || '';
    
    document.getElementById('book-form-container').style.display = 'block';
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        await apiCall(`/api/books/${bookId}`, 'DELETE');
        await loadAllData();
        showSuccess('Book deleted successfully');
    } catch (error) {
        showError('Failed to delete book');
    }
}

function cancelBookForm() {
    document.getElementById('book-form-container').style.display = 'none';
    currentEditingBook = null;
}

// Book form submission
document.getElementById('book-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('book-title').value,
        issue: document.getElementById('book-issue').value,
        publisher: document.getElementById('book-publisher').value,
        grade: document.getElementById('book-grade').value,
        gradeSrc: document.getElementById('book-gradeSource').value,
        pedigree: document.getElementById('book-pedigree').value,
        tags: document.getElementById('book-tags').value,
        generalCommentary: document.getElementById('book-commentary').value,
        sales: []
    };
    
    try {
        if (currentEditingBook) {
            await apiCall(`/api/books/${currentEditingBook.id}`, 'PUT', formData);
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

// Sales management
async function manageSales(bookId) {
    currentSalesBookId = bookId;
    const book = booksData.books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('sales-modal-title').textContent = `Manage Sales - ${book.title} #${book.issue}`;
    document.getElementById('sales-modal').style.display = 'flex';
    await renderSales();
}

function closeSalesModal() {
    document.getElementById('sales-modal').style.display = 'none';
    currentSalesBookId = null;
    currentEditingSale = null;
    currentSaleIndex = null;
    cancelSaleForm();
}

async function renderSales() {
    if (!currentSalesBookId) return;
    
    try {
        const sales = await apiCall(`/api/books/${currentSalesBookId}/sales`);
        const tbody = document.getElementById('sales-tbody');
        tbody.innerHTML = '';
        
        sales.forEach((sale, index) => {
            const row = document.createElement('tr');
            const price = sale.price ? Number(sale.price).toLocaleString() : '0';
            const link = sale.link ? `<a href="${sale.link}" target="_blank">View</a>` : 'N/A';
            
            row.innerHTML = `
                <td>$${price}</td>
                <td>${sale.salesDate || ''}</td>
                <td>${sale.venue || ''}</td>
                <td>${link}</td>
                <td>
                    <button class="btn btn-edit" onclick="editSale(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteSale(${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showError('Failed to load sales data');
    }
}

function showAddSaleForm() {
    currentEditingSale = null;
    currentSaleIndex = null;
    document.getElementById('sale-form-title').textContent = 'Add New Sale';
    document.getElementById('sale-form').reset();
    document.getElementById('sale-form-container').style.display = 'block';
}

function editSale(saleIndex) {
    currentSaleIndex = saleIndex;
    currentEditingSale = true;
    
    // Get the sale data
    apiCall(`/api/books/${currentSalesBookId}/sales`).then(sales => {
        const sale = sales[saleIndex];
        if (!sale) return;
        
        document.getElementById('sale-form-title').textContent = 'Edit Sale';
        document.getElementById('sale-price').value = sale.price || '';
        document.getElementById('sale-date').value = sale.salesDate || '';
        document.getElementById('sale-venue').value = sale.venue || '';
        document.getElementById('sale-link').value = sale.link || '';
        
        document.getElementById('sale-form-container').style.display = 'block';
    });
}

async function deleteSale(saleIndex) {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    
    try {
        await apiCall(`/api/books/${currentSalesBookId}/sales/${saleIndex}`, 'DELETE');
        await renderSales();
        await loadAllData(); // Refresh the books table to update sales count
        showSuccess('Sale deleted successfully');
    } catch (error) {
        showError('Failed to delete sale');
    }
}

function cancelSaleForm() {
    document.getElementById('sale-form-container').style.display = 'none';
    currentEditingSale = null;
    currentSaleIndex = null;
}

// Sale form submission
document.getElementById('sale-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        price: document.getElementById('sale-price').value,
        salesDate: document.getElementById('sale-date').value,
        venue: document.getElementById('sale-venue').value,
        link: document.getElementById('sale-link').value
    };
    
    try {
        if (currentEditingSale && currentSaleIndex !== null) {
            await apiCall(`/api/books/${currentSalesBookId}/sales/${currentSaleIndex}`, 'PUT', formData);
            showSuccess('Sale updated successfully');
        } else {
            await apiCall(`/api/books/${currentSalesBookId}/sales`, 'POST', formData);
            showSuccess('Sale added successfully');
        }
        
        cancelSaleForm();
        await renderSales();
        await loadAllData(); // Refresh the books table to update sales count
    } catch (error) {
        showError('Failed to save sale');
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