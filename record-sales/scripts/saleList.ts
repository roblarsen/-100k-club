import * as _ from "lodash";
import { Comic } from "./Comic";
import { Sale } from "./Sale";
import { recordSale } from "./RecordSale";


export function saleList( data: Array<any> ): Array<recordSale> {
    let recordSales: Array<recordSale> = [];
    data.forEach((d: Comic) => {
        if (d.sales.length > 0) {
            d.sales.forEach((s: Sale) => {
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
                console.log( new recordSale(d.title, d.issue, ped, src, grade, s.price, s.salesDate, s.venue))
                recordSales.push(
                    new recordSale(d.title, d.issue, ped, src, grade, s.price, s.salesDate, s.venue)
            );
            });
        } 
    });

   
    return recordSales;
}
