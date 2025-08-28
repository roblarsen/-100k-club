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
    let booksLastModified = 0;
    let saPedigreesLastModified = 0;

    fs.watch(booksDevPath, (eventType) => {
        if (eventType === 'change') {
            const stats = fs.statSync(booksDevPath);
            const modifiedTime = stats.mtimeMs;

            if (modifiedTime > booksLastModified) {
                booksLastModified = modifiedTime;
                console.log(`Detected save in: ${booksDevPath}`);
                const booksData = JSON.parse(fs.readFileSync(booksDevPath, 'utf8'));
                writeMinifiedFile(booksOutputPath, booksData);
                console.log(`Minified and saved: ${booksOutputPath}`);
            }
        }
    });

    fs.watch(saPedigreesDevPath, (eventType) => {
        if (eventType === 'change') {
            const stats = fs.statSync(saPedigreesDevPath);
            const modifiedTime = stats.mtimeMs;

            if (modifiedTime > saPedigreesLastModified) {
                saPedigreesLastModified = modifiedTime;
                console.log(`Detected save in: ${saPedigreesDevPath}`);
                const saPedigreesData = JSON.parse(fs.readFileSync(saPedigreesDevPath, 'utf8'));
                writeMinifiedFile(saPedigreesOutputPath, saPedigreesData);
                console.log(`Minified and saved: ${saPedigreesOutputPath}`);
            }
        }
    });
};

watchFiles();