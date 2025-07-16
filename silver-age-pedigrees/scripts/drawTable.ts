import * as _ from "lodash";
import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);



export function drawTable(data) {
 createGrid(document.getElementById("datagrid"), {
        columnDefs: [
                    { field: "title", headerName: "Title", sortable: true},
          { field: "ba", headerName: "Big Apple", sortable: true},

    { field: "bet", headerName: "Bethlehem", sortable: true},
    { field: "cur", headerName: "Curator", sortable: true},
    { field: "dmt", headerName: "Don/Maggie Thompson", sortable: true},
    { field: "jf", headerName: "John Fantucchio", sortable: true},
    { field: "ma", headerName: "Massachusetts", sortable: true},
    { field: "mv", headerName: "Mohawk Valley", sortable: true},
    { field: "nor", headerName: "Northland", sortable: true},
    { field: "oh", headerName: "Ohio", sortable: true},
    { field: "pc", headerName: "Pacific Coast", sortable: true},
    { field: "sav", headerName: "Savannah", sortable: true},
    { field: "sn", headerName: "Suscha News", sortable: true},
    { field: "tc", headerName: "Twin Cities", sortable: true},
    { field: "wp", headerName: "Western Penn", sortable: true},
    { field: "wm", headerName: "White Mountain", sortable: true},
    { field: "win", headerName: "Winnipeg", sortable: true}

         
        ],
        rowData: data,
        domLayout:"autoHeight",
        autoSizeStrategy: {
        type: 'fitCellContents'
    }

      });
}