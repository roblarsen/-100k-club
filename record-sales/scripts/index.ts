import * as d3 from "d3";
import { drawTable } from "./drawTable";
import { drawChart } from "./drawChart";
import { Comic } from "./Comic";
import { Sale } from "./Sale";
import { recordSale } from "./RecordSale";
import  { books } from "../data/books.json";
import { saleList } from "./saleList";

let data: Array<recordSale> = saleList(books);
    //drawChart(data);
    //drawTable(data);
