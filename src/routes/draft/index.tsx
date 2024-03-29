import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer, { FormEnum, LeagueFormType } from "../../utils/reducers";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import post, { get } from "../../utils/requests";
import { GridOptions, ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import formValidator from "../../utils/validator";
import {
    Prospect,
    ProspectViewDraft,
    DraftPick,
    DraftPickView,
    columnDefsPicks,
    columnDefsProspect,
} from "../trade";

type Franchise = {
    ID: string;
    Name: string;
};

export type DraftFormType = {
    PickID: string;
    ProspectID: string;
    FranchiseID: string;
    LeagueID: string;
};

const gridOptionsProspects = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "single",
} as GridOptions;

const gridOptionsPicks = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "single",
} as GridOptions;

const initDraftForm = {
    LeagueID: "",
    FranchiseID: "",
    ProspectID: "",
    PickID: "",
};

const defaultErrMsg = "Select a Pick and Prospect";

const Draft: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useReducer(formReducer<DraftFormType>, initDraftForm);
    const [search, setSearch] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [validDraft, setValidDraft] = useState<boolean>(false);
    const [validUndraft, setValidUndraft] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>(defaultErrMsg);

    const [prospectsGridOptions, setProspectsGridOptions] =
        useState<GridOptions>(gridOptionsProspects);
    const [picksGridOptions, setPicksGridOptions] = useState<GridOptions>({
        ...gridOptionsPicks,
        rowSelection: "single",
    });

    const onSelectionChangedPicks = (params: any) => {
        const selectedPick = params.api.getSelectedRows()[0] as DraftPick;
        if (selectedPick !== null && selectedPick !== undefined) {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "PickID", value: selectedPick.ID },
            });
            setFormData({
                type: FormEnum.Set,
                payload: { name: "FranchiseID", value: selectedPick.OwnerID },
            });
        } else {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "PickID", value: "" },
            });
            setFormData({
                type: FormEnum.Set,
                payload: { name: "FranchiseID", value: "" },
            });
        }
    };

    const onSelectionChangedProspects = (params: any) => {
        const selectedProspect = params.api.getSelectedRows()[0] as ProspectViewDraft;
        if (selectedProspect !== null && selectedProspect !== undefined) {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "ProspectID", value: selectedProspect.ID },
            });
            if (
                selectedProspect.PickID !== null &&
                selectedProspect.PickID !== undefined &&
                selectedProspect.PickID !== ""
            ) {
                setFormData({
                    type: FormEnum.Set,
                    payload: { name: "PickID", value: selectedProspect.PickID },
                });
            }
            if (
                selectedProspect.FranchiseID !== null &&
                selectedProspect.FranchiseID !== undefined &&
                selectedProspect.FranchiseID !== ""
            ) {
                setFormData({
                    type: FormEnum.Set,
                    payload: { name: "FranchiseID", value: selectedProspect.FranchiseID },
                });
            }
        } else {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "ProspectID", value: "" },
            });
        }
    };

    // Picks

    const displayPicksGrid = (leagueID: string, year: string) => {
        get(
            `${process.env.BASE_URL_FANTASY_SVC}/league/${leagueID}/picks/${encodeURIComponent(
                year,
            )}`,
        ).then((data) => {
            if (data.picks && data.picks.length >= 0) {
                const picks = data.picks.map((p: DraftPick) => {
                    return {
                        ID: p.ID,
                        Year: p.DraftYear,
                        Round: p.DraftRound,
                        PickInRound: p.DraftPickInRound,
                        PickOverall: p.DraftPickOverall,
                        Owner: p.OwnerName,
                        OwnerID: p.OwnerID,
                        LastOwner: p.LastOwnerName,
                        LastOwnerID: p.LastOwnerID,
                        Origin: p.OriginName,
                        OriginID: p.OriginID,
                    };
                });
                setPicksGridOptions({ ...picksGridOptions, rowData: picks });
            } else {
                setPicksGridOptions({ ...picksGridOptions, rowData: [] });
            }
        });
    };

    const handleDraftPicksOnKeyUp = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        setYear(e.currentTarget.value);
        if (
            e.key == "Enter" &&
            year.length == 4 &&
            parseInt(year) >= 2000 &&
            parseInt(year) <= 2099 &&
            league !== undefined
        ) {
            displayPicksGrid(league.ID, year);
        } else {
            console.log(`If you entered a number between 2000 and 2099, press enter.`);
        }
    };

    const handleDraftPicksOnClick = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
        if (
            year.length == 4 &&
            parseInt(year) >= 2000 &&
            parseInt(year) <= 2099 &&
            league !== undefined
        ) {
            displayPicksGrid(league.ID, year);
        } else {
            console.log(`If you entered a number between 2000 and 2099, press go.`);
        }
    };

    // Prospects

    const displayProspectsGrid = () => {
        get(`${process.env.BASE_URL_FANTASY_SVC}/prospect/${encodeURIComponent(search)}`)
            .then((data) => {
                if (data.status != 200) {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                } else {
                    if (data.prospects && data.prospects.length >= 0) {
                        const prospects = data.prospects.map((p: Prospect) => {
                            return {
                                ID: p.ID,
                                FullName: p.FullName,
                                NhlTeam: p.NhlTeam,
                                Birthdate: p.Birthdate,
                                FranchiseID: p.FranchiseID,
                                LeagueID: p.LeagueID,
                                Pick: p.Pick,
                            };
                        });
                        const prospectsView = prospects.map(async (p: Prospect) => {
                            const pID = p.Pick.ID !== undefined ? p.Pick.ID : "";
                            let tmp: ProspectViewDraft = {
                                FullName: p.FullName,
                                Franchise: "", //franchise !== undefined ? franchise : "",
                                FranchiseID: "", //p.FranchiseID,
                                PickID: pID,
                                DraftYear: p.Pick.DraftYear,
                                Round: p.Pick.DraftRound,
                                PickInRound: p.Pick.DraftPickInRound,
                                PickOverall: p.Pick.DraftPickOverall,
                                Birthdate: p.Birthdate,
                                NhlTeam: p.NhlTeam,
                                ID: p.ID,
                                LeagueID: p.LeagueID,
                            };
                            const fID = p.FranchiseID;
                            if (fID !== undefined && fID !== null && fID !== "") {
                                const response = await get(
                                    `${process.env.BASE_URL_FANTASY_SVC}/franchise/${fID}`,
                                );
                                const franchise: Franchise = response.result;
                                tmp.Franchise = franchise.Name;
                                tmp.FranchiseID = fID;
                            }
                            return tmp;
                        });
                        Promise.all(prospectsView).then((pv) => {
                            setProspectsGridOptions({ ...prospectsGridOptions, rowData: pv });
                        });
                    } else {
                        setProspectsGridOptions({ ...prospectsGridOptions, rowData: [] });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleProspectsOnKeyUp = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key == "Enter" && search.length > 0) {
            displayProspectsGrid();
        } else {
            setSearch(e.currentTarget.value);
        }
    };

    const handleProspectsOnClick = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
        if (search.length > 0) {
            displayProspectsGrid();
        }
    };

    // Draft

    const handleDraft = (event: JSX.TargetedEvent<HTMLFormElement | HTMLButtonElement, Event>) => {
        setValidUndraft(false);
        if (formValidator(formData) && league) {
            console.log("<HandleDraft>");
            post(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/draft`, formData)
                .then((data) => {
                    if (data.status == 200) {
                        console.log("API response:", data);
                        setValidDraft(true);
                        setTimeout(() => {
                            setValidDraft(false);
                        }, 3000);
                        const selectedPick = picksGridOptions.api!.getSelectedRows();
                        picksGridOptions.api!.applyTransaction({ remove: selectedPick });
                        const selectedProspect = prospectsGridOptions.api!.getSelectedRows();
                        prospectsGridOptions.api!.applyTransaction({ remove: selectedProspect });
                        //
                        prospectsGridOptions.api!.deselectAll();
                        picksGridOptions.api!.deselectAll();
                    } else {
                        // TODO: handle error api response
                        console.log("API response:", data);
                        setValidDraft(false);
                        setErrMsg(`Draft was not successful: ${data.error}`);
                        setTimeout(() => {
                            setErrMsg(defaultErrMsg);
                        }, 3000);
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setValidDraft(false);
        }
    };

    const handleUndraft = (
        event: JSX.TargetedEvent<HTMLFormElement | HTMLButtonElement, Event>,
    ) => {
        setValidDraft(false);
        if (formValidator(formData) && league) {
            console.log("<HandleUndraft>");
            post(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/undraft`, formData)
                .then((data) => {
                    if (data.status == 200) {
                        console.log("API response:", data);
                        setValidUndraft(true);
                        setTimeout(() => {
                            setValidUndraft(false);
                        }, 3000);
                        const selectedProspect = prospectsGridOptions.api!.getSelectedRows();
                        prospectsGridOptions.api!.applyTransaction({ remove: selectedProspect });
                        //
                        prospectsGridOptions.api!.deselectAll();
                        picksGridOptions.api!.deselectAll();
                    } else {
                        // TODO: handle error api response
                        console.log("API response:", data);
                        setValidUndraft(false);
                        setErrMsg(`Draft was not successful: ${data.error}`);
                        setTimeout(() => {
                            setErrMsg(defaultErrMsg);
                        }, 3000);
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setValidUndraft(false);
        }
    };

    useEffect(() => {
        console.log("<Prospects>");
        // set handlers for AgGrid
        setPicksGridOptions({
            ...picksGridOptions,
            onSelectionChanged: onSelectionChangedPicks,
        });

        setProspectsGridOptions({
            ...prospectsGridOptions,
            onSelectionChanged: onSelectionChangedProspects,
        });

        if (league !== undefined && league !== null) {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "LeagueID",
                    value: league.ID,
                },
            });
        }
    }, [authenticated]);

    return (
        <div className={`columns`}>
            <div
                className={`column col-6 col-mx-auto col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10 ${style.prospects_picks}`}
            >
                <label className={`form-label ${style.label}`}>Draft Year</label>
                <div className="form-horizontal">
                    <div className="form-group">
                        <input
                            className="column col-10 col-xs-10 form-input"
                            type="text"
                            placeholder="draft year"
                            onKeyUp={handleDraftPicksOnKeyUp}
                        />
                        <button
                            className="column col-2 col-xs-2 btn"
                            onClick={handleDraftPicksOnClick}
                        >
                            go
                        </button>
                    </div>
                </div>

                {picksGridOptions.rowData === null || picksGridOptions.rowData === undefined ? (
                    <div></div>
                ) : (
                    <Grid gridOptions={picksGridOptions} />
                )}
                <div class="divider"></div>

                <div className="form-horizontal">
                    <div className="form-group">
                        <input
                            className="column col-10 col-xs-10 form-input"
                            type="text"
                            placeholder="search prospects"
                            onKeyUp={handleProspectsOnKeyUp}
                        />
                        <button
                            className="column col-2 col-xs-2 btn"
                            onClick={handleProspectsOnClick}
                        >
                            go
                        </button>
                    </div>
                </div>
                {prospectsGridOptions.rowData === null ||
                prospectsGridOptions.rowData === undefined ? (
                    <div></div>
                ) : (
                    <Grid gridOptions={prospectsGridOptions} />
                )}
                <div class="divider"></div>
                <div class="divider"></div>
                {validDraft ? (
                    <div>
                        <b>
                            <div class="text-success">Drafted Prospect</div>
                        </b>
                        <div class="divider"></div>
                    </div>
                ) : (
                    <div></div>
                )}
                {validUndraft ? (
                    <div>
                        <b>
                            <div class="text-success">Undrafted Prospect</div>
                        </b>
                        <div class="divider"></div>
                    </div>
                ) : (
                    <div></div>
                )}
                {!validDraft && !validUndraft ? (
                    <div>
                        <b>
                            <div class="text-error">{errMsg}</div>
                        </b>
                        <div class="divider"></div>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-3 col-mr-auto">
                            <button className="col-12 btn btn-primary" onClick={handleDraft}>
                                Draft
                            </button>
                        </div>
                        <div className="col-3">
                            <button className="col-12 btn btn-error" onClick={handleUndraft}>
                                Undo Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Draft;
