import { AltAssetComic, ProvenanceEvent } from "alt-asset-spec";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 
import { formatCurrency } from "../../core/formatCurrency";
import {getVenueName} from "../../core/getVenueName";
import { dateFormatter} from "../../core/dateFormatter";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


function salesLink(event: ProvenanceEvent): string {
  const price = event.financials?.amount ?? 0;
  if (event.sourceLink) {
    return `<a href="${event.sourceLink}">${formatCurrency(price)}</a>`;
  } else {
    return `${formatCurrency(price)}`;
  }
}

function salesRender(provenanceLedger: ProvenanceEvent[]): string {
  let formattedSales = "";
  const saleEvents = provenanceLedger.filter(
    (e) => e.eventType === 'auction_sale' || e.eventType === 'private_sale'
  );
  saleEvents.forEach((event) => {
    formattedSales += `
      <p class="small">Sold for 
      
      ${salesLink(event)} 
      
      at ${getVenueName(event.platform ?? 'unknown')} 
      on ${dateFormatter(new Date(event.date))}</p> 

    `
  })
  return formattedSales;
}

export function drawTable(data: Array<AltAssetComic>) {
 createGrid(document.getElementById("datagrid"), {
        columnDefs: [
            { headerName: "Title", sortable: true, filter: true, valueGetter: params => params.data.customMetadata.title },
            { headerName: "Issue #", sortable: true, filter: true, valueGetter: params => params.data.customMetadata.issueNumber },
            // First qualifier conventionally holds the pedigree name; additional qualifiers are grading modifiers.
            { headerName: "Pedigree", sortable: true, filter: true, valueGetter: params => params.data.currentAuthentication.qualifiers?.[0] ?? '' },
            { headerName: "Grade Source", sortable: true, filter: true, valueGetter: params => params.data.currentAuthentication.grader },
            { headerName: "Grade", sortable: true, filter: true, valueGetter: params => params.data.currentAuthentication.rawGradeString },
            { field: "generalCommentary", headerName:"Commentary", sortable:false, filter: false, wrapText: true,
autoHeight: true, },
            { headerName: "Sales", wrapText: true,
autoHeight: true, cellRenderer : params => salesRender(params.data.provenanceLedger) }
           
        ],
        rowData: data,
        autoSizeStrategy: {
        type: 'fitGridWidth',
        defaultMinWidth: 100
    }

      });
}