import * as _ from "lodash";
import { RecordSale } from "./RecordSale";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function formatCurrency(number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(number);
}

function dateFormatter(date, locale = 'en-US') {
 const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString(locale, options);
}

export function drawTable(data: Array<RecordSale>) {
 console.log(data)
 createGrid(document.getElementById("datagrid"), {
        columnDefs: [
            { field: "title", headerName: "Title", sortable: true, filter: true },
            { field: "issue", headerName: "Issue #", sortable: true, filter: true },
            { field: "pedigree", headerName: "Pedigree", sortable: true, filter: true },
            { field: "gradeSrc", headerName: "Grade Source", sortable: true, filter: true },
            { field: "grade", headerName: "Grade", sortable: true, filter: true},
            { field: "venue", headerName: "Venue", sortable: true, filter: true },
            { field: "salesDate", headerName: "Sales Date", sortable: true, filter: false, valueFormatter: params => dateFormatter(new Date(params.data.salesDate)) },
            { field: "price", headerName: "Price", sortable: true, filter: false, valueFormatter: params => formatCurrency(params.data.price), }
        ],
        rowData: data,
        autoSizeStrategy: {
        type: 'fitGridWidth',
        defaultMinWidth: 100
    }

      });
}