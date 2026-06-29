import { drawTable } from "./drawTable";
import { drawChart } from "./drawChart";
import { RecordSale } from "../../core/RecordSale";
import { isAltAsset, AltAssetComic } from "alt-asset-spec";
import booksSpec from "../../data/books.json";
import { saleList } from "./saleList";

const validatedBooks: Array<AltAssetComic> = (booksSpec as unknown[]).filter(
    (item: unknown): item is AltAssetComic => {
        if (!isAltAsset(item)) {
            console.warn('Skipping record that failed isAltAsset() validation');
            return false;
        }
        return item.assetClass === 'comic';
    }
);

const data: Array<RecordSale> = saleList(validatedBooks);
drawChart(data);
drawTable(data);
