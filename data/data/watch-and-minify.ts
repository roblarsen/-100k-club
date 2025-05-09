import fs from 'fs';
import path from 'path';

const booksDevPath = path.join(__dirname, 'books.dev.json');
const saPedigreesDevPath = path.join(__dirname, 'sa-pedigrees.dev.json');
const booksOutputPath = path.join(__dirname, 'books.json');
const saPedigreesOutputPath = path.join(__dirname, 'sa-pedigrees.json');

const minifyJSON = (data: any) => JSON.stringify(data);

const writeMinifiedFile = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, minifyJSON(data), 'utf8');
};

const watchFiles = () => {
    console.log(booksDevPath);
    fs.watchFile(booksDevPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            const booksData = JSON.parse(fs.readFileSync(booksDevPath, 'utf8'));
            writeMinifiedFile(booksOutputPath, booksData);
        }
    });

    fs.watchFile(saPedigreesDevPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            const saPedigreesData = JSON.parse(fs.readFileSync(saPedigreesDevPath, 'utf8'));
            writeMinifiedFile(saPedigreesOutputPath, saPedigreesData);
        }
    });
};

watchFiles();