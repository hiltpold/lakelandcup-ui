import { h } from "preact";
import { FunctionComponent } from "preact/compat";
import style from "./style.module.css";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export const defaultColDef = {
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
};

const Grid: FunctionComponent<{ rowData: any[]; columnDefs: any[] }> = ({
    rowData,
    columnDefs,
}) => {
    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
    };

    /*
    const [rowData] = useState([
        { make: "Toyota", model: "Celica", price: 35000, details: "Hallo" },
        { make: "Ford", model: "Mondeo", price: 32000, details: "Hallo" },
        { make: "Porsche", model: "Boxster", price: 72000, details: "Hallo" },
    ]);

    const [columnDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "details" },
    ]);
*/
    /*
    useEffect(() => {
        console.log("<Prospects>");
    }, [authenticated]);
    */

    return (
        <div className={`columns`}>
            <div className={`column col-6 col-mx-auto col-xs-12`}>
                <div className={`ag-theme-alpine`}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        domLayout="autoHeight"
                        alwaysShowHorizontalScroll={true}
                        onGridReady={onGridReady}
                    />
                </div>
            </div>
        </div>
    );
};
export default Grid;
