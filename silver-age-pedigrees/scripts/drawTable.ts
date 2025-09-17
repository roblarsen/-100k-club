import { AllCommunityModule, ModuleRegistry, createGrid } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export function drawTable(data) {
  createGrid(document.getElementById("datagrid"), {
    columnDefs: [
      { field: "title", headerName: "Title", maxWidth: 300, pinned: true },
      { field: "ba", headerName: "Big Apple", },
      { field: "bet", headerName: "Bethlehem", },
      { field: "cur", headerName: "Curator", },
      { field: "dmt", headerName: "Don/Maggie Thompson", },
      { field: "jf", headerName: "John Fantucchio", },
      { field: "ma", headerName: "Massachusetts", },
      { field: "mv", headerName: "Mohawk Valley", },
      { field: "nor", headerName: "Northland", },
      { field: "oh", headerName: "Ohio", },
      { field: "pc", headerName: "Pacific Coast", },
      { field: "sav", headerName: "Savannah", },
      { field: "sn", headerName: "Suscha News", },
      { field: "tc", headerName: "Twin Cities", },
      { field: "wp", headerName: "Western Penn", },
      { field: "wm", headerName: "White Mountain", },
      { field: "win", headerName: "Winnipeg", }
    ],
    defaultColDef: {
      sortable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      resizable: true,
      filter: false,
      maxWidth: 125,
    },
    rowData: data,
    autoSizeStrategy: {
      type: 'fitCellContents'
    },
    onGridReady: () => {
      // Set the viewport height to match its rendered height after the grid is drawn
      setTimeout(() => {
        const viewport = document.querySelector('.ag-body-viewport') as HTMLElement;
        if (viewport) {
          const computedHeight = viewport.offsetHeight;
          viewport.style.height = `${computedHeight}px`;
        }
      }, 100);
    }
  });

}
