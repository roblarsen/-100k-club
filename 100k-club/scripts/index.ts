import * as d3 from "d3";
import { drawTable } from "./drawTable";
import { Comic } from "./Comic";
import { Sale } from "./Sale";
import { RecordSale } from "./RecordSale";
import  { books } from "../../data/data//books.dev.json";
import { saleList } from "./saleList";

drawTable(books);
