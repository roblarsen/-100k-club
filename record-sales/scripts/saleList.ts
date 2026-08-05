import { RecordSale } from "../../core/RecordSale";
import * as _ from "lodash";

/**
 * A flat sale entry as stored in the `sales` array on each book record.
 */
interface FlatSale {
    readonly price: number;
    readonly salesDate: string;
    readonly venue: string;
    [key: string]: unknown;
}

/**
 * A flat book record as stored in the CRUD data store.
 * Pedigree, gradeSrc, and grade are optional string annotations.
 */
interface FlatBook {
    readonly title: string;
    readonly issue: string;
    readonly pedigree?: string;
    readonly gradeSrc?: string;
    readonly grade?: string;
    readonly sales: FlatSale[];
    [key: string]: unknown;
}

/**
 * Flattens a list of flat book records into a sorted array of RecordSale
 * objects, keeping only individual sales with price >= $100,000.
 *
 * @param data - Array of flat book objects, each containing a `sales` array.
 * @returns A list of RecordSale instances sorted by price descending.
 */
export function saleList(data: Array<FlatBook>): Array<RecordSale> {
    const recordSales: Array<RecordSale> = [];

    data.forEach((d: FlatBook) => {
        const sales = Array.isArray(d.sales) ? d.sales : [];
        sales.forEach((sale: FlatSale) => {
            if (typeof sale.price === 'number' && sale.price >= 100000) {
                const pedigree = d.pedigree ?? '';
                // Normalise gradeSrc to uppercase for canonical display.
                const gradeSrc = d.gradeSrc ? String(d.gradeSrc).toUpperCase() : '';
                const grade = d.grade ?? '';

                recordSales.push(
                    new RecordSale(
                        d.title,
                        d.issue,
                        pedigree,
                        gradeSrc,
                        grade,
                        sale.price,
                        sale.salesDate,
                        sale.venue
                    )
                );
            }
        });
    });

    return _.sortBy(recordSales, ['price']).reverse();
}

