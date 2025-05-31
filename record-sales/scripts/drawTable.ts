import * as _ from "lodash";
import { RecordSale } from "./RecordSale";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 
import { venues } from "./venues";

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
    timeZone: 'UTC'
  };
  if (date == "Invalid Date") {
    return "Unknown Date";
  } else {
    return date.toLocaleDateString(locale, options);
  }
  
}

function getVenueName(venue) {
  if (venue in venues) {
    return venues[venue];
  } else {
    return "Unknown Venue";
  }
}

export function drawTable(data: Array<RecordSale>) {
 createGrid(document.getElementById("datagrid"), {
        columnDefs: [
            { field: "title", headerName: "Title", sortable: true, filter: true },
            { field: "issue", headerName: "Issue #", sortable: true, filter: true },
            { field: "pedigree", headerName: "Pedigree", sortable: true, filter: true },
            { field: "gradeSrc", headerName: "Grade Source", sortable: true, filter: true },
            { field: "grade", headerName: "Grade", sortable: true, filter: true},
            { field: "venue", headerName: "Venue", sortable: true, filter: true,  valueFormatter: params => getVenueName(params.data.venue) },
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