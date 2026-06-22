import { drawTable } from "./drawTable";
import { isAltAsset, AltAssetComic } from "alt-asset-spec";
import booksSpec from "../../data/data/books.spec.json";

const books: Array<AltAssetComic> = (booksSpec as unknown[]).filter(
    (item: unknown): item is AltAssetComic => {
        if (!isAltAsset(item)) {
            console.warn(`Skipping invalid record: ${String((item as Record<string, unknown>)?.urn ?? JSON.stringify(item).substring(0, 60))}`);
            return false;
        }
        return item.assetClass === 'comic';
    }
);

drawTable(books);
