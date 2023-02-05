import { h } from "preact";
import { FunctionComponent, useEffect, useRef } from "preact/compat";
import style from "./style.module.css";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent, GridOptions, ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getDefaultFormatCodeSettings } from "typescript";

const Grid: FunctionComponent<{ gridOptions: GridOptions }> = ({ gridOptions }) => {
    const gridApiRef = useRef<any>(null);

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
        gridApiRef.current = params.api; // <= assigned gridApi value on Grid ready
        params.api.setHeaderHeight(35);
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
            ///gridApiRef.current.onSelectionChanged(gridOptions.onSelectionChanged);
        }

        //gridOptions.api.setRowData([]);
        //gridOptions.api?.setRowData(gridOptions.rowData);
        /*
        if (
            gridOptions.api === null ||
            gridOptions.api === undefined ||
            gridOptions.rowData === undefined ||
            gridOptions.rowData === null
        ) {
            console.log(gridOptions);
        } else {
            gridOptions.api.setRowData(gridOptions.rowData);
        }
        */
    }, [gridOptions]);
    return (
        <div className={`ag-theme-alpine ${style.grid}`}>
            <AgGridReact
                gridOptions={gridOptions}
                rowSelection="single"
                onSelectionChanged={gridOptions.onSelectionChanged}
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
