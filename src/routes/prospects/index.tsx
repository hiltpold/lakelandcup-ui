import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer, { FormEnum, LeagueTypeForm } from "../../utils/reducers";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import { AgGridReact } from "ag-grid-react";
import { get } from "../../utils/requests";
import { GridOptions, RowSelectedEvent, ColDef, GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { KeyboardEvent } from "react";
import { setServers } from "dns";

const draftYear = ["2017", "2018", "2019", "2020", "2021", "2022", "2023"];
const draftRounds = ["1", "2"];
const pickInRound = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

type Prospect = {
    ID: string;
    FullName: string;
    FirstName: string;
    LastName: string;
    NhlTeam: string;
    DraftYear: string;
    Birthdate: string;
    Height: string;
    Weight: string;
    NhlDraftRound: string;
    NhlDraftPickOverall: string;
    NhlPickInRound: string;
    PositionCode: string;
    LeagueID: string;
    FranchiseID: string;
    PickID: string;
};

const columnDefsProspect = [
    { field: "FullName" },
    { field: "NhlTeam" },
    { field: "NhlDraftRound" },
    { field: "NhlPickInRound" },
    { field: "NhlDraftPickOverall" },
    { field: "Birthdate" },
    { field: "PositionCode" },
    { field: "Weight" },
    { field: "Height" },
    { field: "ID", hide: true },
    { field: "LeagueID", hide: true },
    { field: "FranchiseID", hide: true },
];

const gridOptionsPropspectInit = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 40,
    onSelectionChanged: undefined,
};

type GridOptionsProspects = {
    columnDefs: ColDef;
    rowData: Prospect[];
    rowHeight: number;
};

const Prospects: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [search, setSearch] = useState<string>("");
    const [gridOptions, setGridOptions] = useState<GridOptions>(gridOptionsPropspectInit);

    const onSelectionChanged = (params: any) => {
        console.log(params.api.getSelectedRows());
    };

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        setSearch(currentTarget.value);
    };

    const searchProspects = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.length > 0) {
            setSearch(e.currentTarget.value);
            get(`${process.env.BASE_URL_FANTASY_SVC}/prospects/${encodeURIComponent(search)}`)
                .then((data) => {
                    if (data.status != 200) {
                        // TODO: handle error api response
                        console.log(`API response code ${data.status}`);
                    } else {
                        if (data.prospects.length >= 0) {
                            const rowData = data.prospects.map((p: Prospect) => {
                                return {
                                    FullName: p.FullName,
                                    NhlTeam: p.NhlTeam,
                                    NhlDraftRound: p.NhlDraftRound,
                                    NhlPickInRound: p.NhlPickInRound,
                                    NhlDraftPickOverall: p.NhlDraftPickOverall,
                                    Birthdate: p.Birthdate,
                                    PositionCode: p.PositionCode,
                                    Weight: p.Weight,
                                    Height: p.Height,
                                    ID: p.ID,
                                    FranchiseID: p.FranchiseID,
                                    LeagueID: p.LeagueID,
                                };
                            });
                            setGridOptions({ ...gridOptions, rowData: rowData });
                        } else {
                            setGridOptions({ ...gridOptions, rowData: [] });
                        }
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setSearch(e.currentTarget.value);
        }
    };

    useEffect(() => {
        console.log("<Prospects>");
        setGridOptions({ ...gridOptions, onSelectionChanged: onSelectionChanged });
    }, [authenticated, search]);

    return (
        <div className={`columns`}>
            <div
                className={`column col-8 col-mx-auto col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12`}
            >
                <form>
                    <div
                        className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.prospects_picks}`}
                    >
                        <div className="form-group">
                            <label className={`form-label ${style.label}`}>Draft Year</label>
                            <select
                                class="form-select"
                                name="commissionerID"
                                type="text"
                                onChange={handleChange}
                            >
                                {draftYear.map((dy) => (
                                    <option value={dy}>{dy}</option>
                                ))}
                            </select>
                            <label className={`form-label ${style.label}`}>Draft Round</label>
                            <select
                                class="form-select"
                                name="commissionerID"
                                type="text"
                                onChange={handleChange}
                            >
                                {draftRounds.map((dr) => (
                                    <option value={dr}>{dr}</option>
                                ))}
                            </select>
                            <label className={`form-label ${style.label}`}>Pick in Round</label>
                            <select
                                class="form-select"
                                name="commissionerID"
                                type="text"
                                onChange={handleChange}
                            >
                                {pickInRound.map((pir) => (
                                    <option value={pir}>{pir}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
                <div className="form-horizontal">
                    <div className="form-group">
                        <input
                            className="column col-10 col-xs-10 form-input lakelandcup-input-form"
                            name="name"
                            type="text"
                            placeholder="search prospects"
                            onKeyUp={searchProspects}
                        />
                        <button className="column col-2 col-xs-2 btn btn-primary">GO</button>
                    </div>
                </div>
                {gridOptions.rowData === null || gridOptions.rowData === undefined ? (
                    <div></div>
                ) : (
                    <Grid gridOptions={gridOptions} />
                )}
            </div>
        </div>
    );
};
export default Prospects;
