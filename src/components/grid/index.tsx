import { h } from "preact";
import { FunctionComponent, useEffect, useRef } from "preact/compat";
import style from "./style.module.css";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent, GridOptions, ColDef, AgGridEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getDefaultFormatCodeSettings } from "typescript";

const Grid: FunctionComponent<{ gridOptions: GridOptions }> = ({ gridOptions }) => {
    const gridApiRef = useRef<any>(null);

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
        gridApiRef.current = params.api;
        params.api.setHeaderHeight(35);
    };

    const onDragStopped = (params: AgGridEvent) => {
        params.api.refreshCells();
    };

    const defaultColDef: ColDef = {
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 10,
    };

    useEffect(() => {
        console.log("<Grid>");
        if (gridApiRef.current !== null) {
            gridApiRef.current.setRowData(gridOptions.rowData);
        }
    }, [gridOptions]);

    return (
        <div className={`ag-theme-alpine ${style.grid}`}>
            <AgGridReact
                gridOptions={gridOptions}
                //rowSelection={gridOptions.rowSelection}
                onDragStopped={gridOptions.onDragStopped}
                onSelectionChanged={gridOptions.onSelectionChanged}
                onRowEditingStopped={gridOptions.onRowEditingStopped}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                //domLayout="autoHeight"
                rowMultiSelectWithClick={true}
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}
            />
        </div>
    );
};
export default Grid;
