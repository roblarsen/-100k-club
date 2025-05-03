import * as d3 from "d3";
import { drawTable } from "./drawTable";
import { drawChart } from "./drawChart";
import { Comic } from "./Comic";
import { Sale } from "./Sale";
import { recordSale } from "./recordSale";

let data: Comic[] = [];
let recordSales: Array<recordSale> = []; 

function salesList(data){
  data.forEach((d:Comic) => {
    
    if (d.sales.length > 0){
      d.sales.forEach((s:Sale) => {
        let ped: string,
        src: string,
        grade: string;
        if (d.pedigree === undefined){
          ped = "";
        } else {
          ped = d.pedigree;
        } 
        if (d.gradeSrc === undefined){
          src = "";
        } else {
          src = d.gradeSrc;
        }
        if (d.grade === undefined){
          grade = "";
        } else {
          grade = d.grade;
        }

        recordSales.push(
          new recordSale(d.title,d.issue,ped,src,grade,s.price,s.salesDate,s.venue)
      });
      console.log(recordSales);
    }
  });
}
d3.json("data/books.json")
  .then((d) => {
    data = d.books;

    salesList(data);
    drawChart(data);
    drawTable(data);
  })
  .catch((err) => {
  console.error("Error loading data:", err)});
