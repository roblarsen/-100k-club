import { drawTable } from "./drawTable";
import { isAltAsset, AltAssetComic } from "alt-asset-spec";
import booksSpec from "../../data/books.json";

const books: Array<AltAssetComic> = (booksSpec as unknown[]).filter(
    (item: unknown): item is AltAssetComic => {
        if (!isAltAsset(item)) {
            console.warn('Skipping record that failed isAltAsset() validation');
            return false;
        }
        return item.assetClass === 'comic';
    }
);

drawTable(books);
