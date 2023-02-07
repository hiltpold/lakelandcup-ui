import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer, { FormEnum, LeagueTypeForm } from "../../utils/reducers";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import { AgGridReact } from "ag-grid-react";
import post, { get } from "../../utils/requests";
import { GridOptions, RowSelectedEvent, ColDef, GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { KeyboardEvent } from "react";
import { setServers } from "dns";
import test from "node:test";
import { stringify } from "querystring";

const draftYear = ["2017", "2018", "2019", "2020", "2021", "2022", "2023"];
const draftRounds = ["1", "2"];
const pickInRound = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

type DraftPick = {
    DraftYear: string;
    DraftRound: string;
    DraftPickInRound: string;
    DraftPickOverall: string;
};
type Prospect = {
    ID: string;
    FullName: string;
    NhlTeam: string;
    Birthdate: string;
    LeagueID: string;
    FranchiseID: string;
    Pick: {
        ID: string;
        DraftYear: string;
        DraftRound: string;
        DraftPickInRound: string;
        DraftPickOverall: string;
        ProspectID: string;
    };
};

type ProspectView = {
    ID: string;
    FullName: string;
    Franchise: string;
    NhlTeam: string;
    Birthdate: string;
    LeagueID: string;
    FranchiseID: string;
};

const columnDefsProspect = [
    { field: "FullName" },
    { field: "Franchise" },
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
    draftPick: string | DraftPick;
    prospectID: string;
    franchiseID: string;
    leagueID: string;
};

const initDraftPick = {
    draftPick: "",
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
    const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);

    const [gridOptions, setGridOptions] = useState<GridOptions>(gridOptionsPropspectInit);

    const onSelectionChanged = (params: any) => {
        const selectedRow = params.api.getSelectedRows()[0];
        if (selectedRow) {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "prospectID",
                    value: selectedRow.ID,
                },
            });
        } else {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "prospectID",
                    value: "",
                },
            });
        }
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
        } else if (currentTarget.name == "draftYear") {
            const draftPicksPerRound = draftRounds.flatMap((dr) => {
                const picks: DraftPick[] = pickInRound.map((pid) => {
                    return {
                        DraftYear: currentTarget.value,
                        DraftRound: dr,
                        DraftPickInRound: pid,
                        DraftPickOverall: (
                            (parseInt(dr) - 1) * pickInRound.length +
                            parseInt(pid)
                        ).toString(),
                    };
                });
                return picks;
            });
            setDraftPicks(draftPicksPerRound);
        } else {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: currentTarget.name,
                    value: currentTarget.value,
                },
            });
        }
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
            formData.draftPick !== undefined &&
            formData.draftPick !== null &&
            formData.draftPick !== ""
        ) {
            if (typeof formData.draftPick === "string") {
                formData.draftPick = JSON.parse(formData.draftPick);
            }
            // post data
            post(`${process.env.BASE_URL_FANTASY_SVC}/prospect/draft`, formData).then((data) => {
                if (data.status == 201) {
                    console.log(`API response code ${data.status}`);
                } else {
                    // TODO: handle error api response
                    console.log(`API response ${data}`);
                    console.log(data);
                }
            });
            console.log(formData);
        }
    };

    const searchProspects = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.length > 0) {
            setSearch(e.currentTarget.value);
            get(`${process.env.BASE_URL_FANTASY_SVC}/prospect/${encodeURIComponent(search)}`)
                .then((data) => {
                    if (data.status != 200) {
                        // TODO: handle error api response
                        console.log(`API response code ${data.status}`);
                    } else {
                        if (data.prospects && data.prospects.length >= 0) {
                            console.log(data.prospects);
                            const prospects = data.prospects.map((p: Prospect) => {
                                return {
                                    ID: p.ID,
                                    FullName: p.FullName,
                                    NhlTeam: p.NhlTeam,
                                    Birthdate: p.Birthdate,
                                    FranchiseID: p.FranchiseID,
                                    LeagueID: p.LeagueID,
                                    Pick: {
                                        ID: p.Pick.ID,
                                        DraftYear: p.Pick.DraftYear,
                                        DraftRound: p.Pick.DraftRound,
                                        DraftPickInRound: p.Pick.DraftPickInRound,
                                        DraftPickOverall: p.Pick.DraftPickOverall,
                                        ProspectID: p.Pick.ProspectID,
                                    },
                                };
                            });
                            const prospectsView = prospects.map(async (p: Prospect) => {
                                let tmp: ProspectView = {
                                    FullName: p.FullName,
                                    Franchise: "",
                                    Birthdate: p.Birthdate,
                                    NhlTeam: p.NhlTeam,
                                    ID: p.ID,
                                    LeagueID: p.LeagueID,
                                    FranchiseID: p.FranchiseID,
                                };
                                const fID = p.FranchiseID;
                                if (fID !== undefined && fID !== null && fID !== "") {
                                    const franchise: Franchise = await get(
                                        `${process.env.BASE_URL_FANTASY_SVC}/franchise/${fID}}`,
                                    );
                                    tmp.Franchise = franchise.Name;
                                }
                                return tmp;
                            });
                            Promise.all(prospectsView).then((pv) => {
                                setGridOptions({ ...gridOptions, rowData: pv });
                            });
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
                        <label className={`form-label ${style.label}`}>Draft Pick</label>
                        <select
                            class="form-select"
                            name="draftPick"
                            type="text"
                            onChange={handleChange}
                            disabled={false}
                        >
                            <option value="">{""}</option>
                            {draftPicks.map((dr) => (
                                <option
                                    value={JSON.stringify(dr)}
                                >{`Round: ${dr.DraftRound}  |  Pick ${dr.DraftPickInRound}  |  Pick Overall: ${dr.DraftPickOverall}`}</option>
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
