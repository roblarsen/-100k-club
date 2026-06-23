import { AltAssetComic } from "alt-asset-spec";
import { RecordSale } from "../../core/RecordSale";
import * as _ from "lodash";


export function saleList( data: Array<AltAssetComic> ): Array<RecordSale> {
    const recordSales: Array<RecordSale> = [];

    data.forEach((d: AltAssetComic) => {
        d.provenanceLedger.forEach((event) => {
            if (
                (event.eventType === 'auction_sale' || event.eventType === 'private_sale') &&
                event.financials &&
                event.financials.amount >= 100000
            ) {
                // First qualifier conventionally holds the pedigree name (e.g. "Edgar Church").
                // Additional qualifiers (e.g. "Restored", "Signature Series") are grading modifiers.
                const pedigree = d.currentAuthentication.qualifiers?.[0] ?? '';
                const gradeSrc = d.currentAuthentication.grader.toUpperCase();
                const grade = d.currentAuthentication.rawGradeString;

                recordSales.push(
                    new RecordSale(
                        d.customMetadata.title,
                        d.customMetadata.issueNumber,
                        pedigree,
                        gradeSrc,
                        grade,
                        event.financials.amount,
                        event.date,
                        event.platform ?? 'unknown'
                    )
                );
            }
        });
    });

    return _.sortBy(recordSales, ["price"]).reverse();
  
}

