import * as _ from "lodash";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 
import { formatCurrency } from "../../core/formatCurrency";
import {getVenueName} from "../../core/getVenueName";
import { dateFormatter} from "../../core/dateFormatter";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


function salesLink(sale){
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
      on ${dateFormatter(new Date(d.salesDate))}</p> 

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