# Project Title

This project is designed to manage and process comic book data, specifically focusing on books and their pedigrees. It includes functionality to watch for changes in JSON files and minify them for optimized storage and access.

## Project Structure

- **src/data/books.dev.json**: Contains JSON data related to comic books, including titles, publishers, grades, and sales information.
- **src/data/sa-pedigrees.dev.json**: Contains JSON data related to pedigrees, structured similarly to the books file.
- **src/data/watch-and-minify.ts**: A TypeScript script that watches for changes in `books.dev.json` and `sa-pedigrees.dev.json`. Upon detecting changes, it minifies the JSON content and writes the output to `books.json` and `sa-pedigrees.json`.
- **tsconfig.json**: TypeScript configuration file that specifies compiler options and files to include in the compilation.
- **package.json**: npm configuration file that lists dependencies and scripts for the project.

## Installation

To get started with this project, clone the repository and install the necessary dependencies:

```bash
npm install
```

## Usage

To run the watch-and-minify script, use the following command:

```bash
ts-node src/data/watch-and-minify.ts
```

This will start watching for changes in the specified JSON files and automatically minify them when changes are detected.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.