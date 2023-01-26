import { h } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer, { FormEnum, LeagueTypeForm } from "../../utils/reducers";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import { AgGridReact } from "ag-grid-react";
import { GridOptions, RowSelectedEvent, ColDef, GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Prospects: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
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

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
    };
    /*
    useEffect(() => {
        console.log("<Prospects>");
    }, [authenticated]);
    */

    return (
        <div className={`columns`}>
            <div className={`column col-8 col-mx-auto col-xs-12`}>
                <div className={`ag-theme-alpine`}>
                    <Grid rowData={rowData} columnDefs={columnDefs} />
                </div>
            </div>
        </div>
    );
};
export default Prospects;
