import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
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
    // { field: "NhlDraftRound" },
    // { field: "NhlPickInRound" },
    // { field: "NhlDraftPickOverall" },
    { field: "Birthdate" },
    // { field: "PositionCode" },
    // { field: "Weight" },
    // { field: "Height" },
    { field: "ID", hide: true },
    { field: "LeagueID", hide: true },
    { field: "FranchiseID", hide: true },
];

const gridOptionsPropspectInit = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
};

type GridOptionsProspects = {
    columnDefs: ColDef;
    rowData: Prospect[];
    rowHeight: number;
};

type Franchise = {
    ID: string;
    Name: string;
};

type Draft = {
    draftYear: string;
    draftRound: string;
    draftPickInRound: string;
    draftPickOverall: string;
    prospectID: string;
    franchiseID: string;
    leagueID: string;
};

const initDraftPick = {
    draftYear: "",
    draftRound: "",
    draftPickInRound: "",
    draftPickOverall: "",
    prospectID: "",
    franchiseID: "",
    leagueID: "",
};

const Prospects: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useReducer(formReducer<Draft>, initDraftPick);
    const [search, setSearch] = useState<string>("");
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [prospectId, setProspectId] = useState<string>("");
    const [gridOptions, setGridOptions] = useState<GridOptions>(gridOptionsPropspectInit);

    const onSelectionChanged = (params: any) => {
        const selectedRow = params.api.getSelectedRows()[0];
        console.log(selectedRow);
        setFormData({
            type: FormEnum.Set,
            payload: {
                name: "prospectID",
                value: selectedRow.ID,
            },
        });
        setProspectId(selectedRow.ID);
    };

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        if (currentTarget.name == "franchiseID") {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "franchiseID",
                    value: currentTarget.value,
                },
            });
        }
        setFormData({
            type: FormEnum.Set,
            payload: {
                name: currentTarget.name,
                value: currentTarget.value,
            },
        });
    };

    const handleDraft = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        if (
            formData.prospectID !== undefined &&
            formData.prospectID !== null &&
            formData.prospectID !== "" &&
            formData.franchiseID !== undefined &&
            formData.franchiseID !== null &&
            formData.franchiseID !== "" &&
            formData.prospectID !== undefined &&
            formData.prospectID !== null &&
            formData.prospectID !== "" &&
            formData.draftYear !== undefined &&
            formData.draftYear !== null &&
            formData.draftYear !== "" &&
            formData.draftRound !== undefined &&
            formData.draftRound !== null &&
            formData.draftRound !== "" &&
            formData.draftPickInRound !== undefined &&
            formData.draftPickInRound !== null &&
            formData.draftPickInRound !== ""
        ) {
            formData.draftPickOverall =
                formData.draftRound === "1"
                    ? formData.draftPickInRound
                    : (
                          (parseInt(formData.draftRound) - 1) * pickInRound.length +
                          parseInt(formData.draftPickInRound)
                      ).toString();
            /*
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "draftPickOverall",
                    value:
                        formData.draftRound === "1"
                            ? formData.draftPickInRound
                            : (
                                  (parseInt(formData.draftRound) - 1) * pickInRound.length +
                                  parseInt(formData.draftPickInRound)
                              ).toString(),
                },
            });
            */
            console.log(formData);
        }
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
                        if (data.prospects && data.prospects.length >= 0) {
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
        if (league !== undefined && league !== null) {
            get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/franchises`).then(
                (data) => {
                    if (data.result !== undefined) {
                        setFranchises(
                            data.result.map((f: Franchise) => {
                                return {
                                    ID: f.ID,
                                    Name: f.Name,
                                };
                            }),
                        );
                    }
                },
            );
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "leagueID",
                    value: league.ID,
                },
            });
        }
    }, [authenticated, search]);

    return (
        <div className={`columns`}>
            <div
                className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.prospects_picks}`}
            >
                <form onSubmit={handleDraft}>
                    <div className="form-group">
                        <label className={`form-label ${style.label}`}>Draft Year</label>
                        <select
                            class="form-select"
                            name="draftYear"
                            type="text"
                            onChange={handleChange}
                        >
                            <option value="">{""}</option>
                            {draftYear.map((dy) => (
                                <option value={dy}>{dy}</option>
                            ))}
                        </select>
                        <label className={`form-label ${style.label}`}>Franchise</label>
                        <select
                            class="form-select"
                            name="franchiseID"
                            type="text"
                            onChange={handleChange}
                        >
                            <option value="">{""}</option>
                            {franchises.map((f) => (
                                <option value={f.ID}>{f.Name}</option>
                            ))}
                        </select>
                        <label className={`form-label ${style.label}`}>Draft Round</label>
                        <select
                            class="form-select"
                            name="draftRound"
                            type="text"
                            onChange={handleChange}
                        >
                            <option value="">{""}</option>
                            {draftRounds.map((dr) => (
                                <option value={dr}>{dr}</option>
                            ))}
                        </select>
                        <label className={`form-label ${style.label}`}>Pick in Round</label>
                        <select
                            class="form-select"
                            name="draftPickInRound"
                            type="text"
                            onChange={handleChange}
                        >
                            <option value="">{""}</option>
                            {pickInRound.map((pir) => (
                                <option value={pir}>{pir}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <input
                                className="column col-10 col-xs-10 form-input lakelandcup-input-form"
                                name="name"
                                type="text"
                                placeholder="search prospects"
                                onKeyUp={searchProspects}
                            />
                            <button className="column col-2 col-xs-2 btn">go</button>
                        </div>
                    </div>
                    {gridOptions.rowData === null || gridOptions.rowData === undefined ? (
                        <div></div>
                    ) : (
                        <Grid gridOptions={gridOptions} />
                    )}
                    <label className="form-label">
                        <button className="btn">Draft</button>
                    </label>
                </form>
            </div>
        </div>
    );
};
export default Prospects;
