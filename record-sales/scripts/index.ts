import { drawTable } from "./drawTable";
import { drawChart } from "./drawChart";
import { RecordSale } from "../../core/RecordSale";
import  { books } from "../../data/data//books.dev.json";
import { saleList } from "./saleList";

let data: Array<RecordSale> = saleList(books);
drawChart(data);
drawTable(data);
