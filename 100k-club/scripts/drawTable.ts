import * as _ from "lodash";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 
import { venues } from "./venues";
import { Comic  } from "./Comic";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

//todo: extract this into a project level script
function formatCurrency(number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(number);
}

//todo: extract this into a project level script
function getVenueName(venue) {
  if (venue in venues) {
    return venues[venue];
  } else {
    return "Unknown Venue";
  }
}


//todo: extract this into a project level script
function dateFormatter(date, locale = 'en-US') {
  date = new Date(date);
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

function salesLink(sale){
  console.log(sale);
  if (sale.link) {
    return `<a href="${sale.link}">${formatCurrency(sale.price)}</a>`;
  } else {
    
    return `${formatCurrency(sale.price)}`;
  }

}
function salesRender(data) {
  let formattedSales = "";
  data.forEach((d)=>{
    formattedSales += `
      <p class="small">Sold for 
      
      ${salesLink(d)} 
      
      at ${getVenueName(d.venue)} 
      on ${dateFormatter(d.salesDate)}</p> 

    `
  })
  return formattedSales;
}

export function drawTable(data) {
 createGrid(document.getElementById("datagrid"), {
        columnDefs: [
            { field: "title", headerName: "Title", sortable: true, filter: true },
            { field: "issue", headerName: "Issue #", sortable: true, filter: true },
            { field: "pedigree", headerName: "Pedigree", sortable: true, filter: true },
            { field: "gradeSrc", headerName: "Grade Source", sortable: true, filter: true },
            { field: "grade", headerName: "Grade", sortable: true, filter: true},
            { field: "generalCommentary", headerName:"Commentary", sortable:false, filter: false, wrapText: true,
autoHeight: true, },
            { field: "sales",  headerName: "Sales", wrapText: true,
autoHeight: true, cellRenderer : params => salesRender(params.data.sales) }
           
        ],
        rowData: data,
        autoSizeStrategy: {
        type: 'fitGridWidth',
        defaultMinWidth: 100
    }

      });
}