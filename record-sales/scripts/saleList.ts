import { Comic } from "./Comic";
import { Sale } from "./Sale";
import { RecordSale } from "./RecordSale";


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
                    src = d.gradeSrc;
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
return recordSales;
  
}
