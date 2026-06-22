import fs from 'fs';
import path from 'path';

const booksDevPath = path.join(__dirname, 'books.dev.json');
const booksOutputPath = path.join(__dirname, 'books.json');

const minifyBooks = () => {
    const data = fs.readFileSync(booksDevPath, 'utf8');
    const json = JSON.parse(data);
    fs.writeFileSync(booksOutputPath, JSON.stringify(json), 'utf8');
    console.log(`Minified ${booksDevPath} to ${booksOutputPath}`);
};

minifyBooks();