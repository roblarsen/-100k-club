import { Comic } from "../../core/Comic";
import { Sale } from "../../core/Sale";
import { RecordSale } from "../../core/RecordSale";
import * as _ from "lodash";


export function saleList( data: Array<any> ): Array<RecordSale> {
    let recordSales: Array<RecordSale> = [];
    data.forEach((d: Comic) => {
        if (d.sales.length > 0) {
            d.sales.forEach((s: Sale) => {
                if (s.price >= 100000){
                    let ped: string,
                    src: string,
                    grade: string;
                    
                if (d.pedigree === undefined) {
                    ped = "";
                } else {
                    ped = d.pedigree;
                }
                if (d.gradeSrc === undefined) {
                    src = "";
                } else {
                    src = d.gradeSrc.toUpperCase();
                }
                if (d.grade === undefined) {
                    grade = "";
                } else {
                    grade = d.grade;
                }

                recordSales.push(
                    new RecordSale(d.title, d.issue, ped, src, grade, Number(s.price), s.salesDate, s.venue)
                );
                }
            });
            
        } 
    });

return _.sortBy(recordSales,["price"]).reverse();
  
}
