import * as _ from "lodash";
import { RecordSale } from "../../core/RecordSale";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 
import { formatCurrency } from "../../core/formatCurrency";
import { dateFormatter } from "../../core/dateFormatter";
import { getVenueName } from "../../core/getVenueName";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

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