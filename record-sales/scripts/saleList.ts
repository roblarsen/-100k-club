import { AltAssetComic, getRecordHighSale } from "alt-asset-spec";
import { RecordSale } from "../../core/RecordSale";
import * as _ from "lodash";


export function saleList( data: Array<AltAssetComic> ): Array<RecordSale> {
    const recordSales: Array<RecordSale> = [];

    data.forEach((d: AltAssetComic) => {
        const highSale = getRecordHighSale(d);
        if (!highSale || highSale.amount < 100000) {
            return;
        }

        d.provenanceLedger.forEach((event) => {
            if (
                (event.eventType === 'auction_sale' || event.eventType === 'private_sale') &&
                event.financials &&
                event.financials.amount >= 100000
            ) {
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

