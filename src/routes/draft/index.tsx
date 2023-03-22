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
    gridOptionsPropspects,
    gridOptionsPicks,
    Prospect,
    ProspectView,
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
    draftPick: string | DraftPick;
    prospectID: string;
    franchiseID: string;
    leagueID: string;
};

const initDraftForm = {
    draftPick: "",
    prospectID: "",
    franchiseID: "",
    leagueID: "",
};

const Draft: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useReducer(formReducer<DraftFormType>, initDraftForm);
    const [search, setSearch] = useState<string>("");
    const [year, setYear] = useState<string>("");

    const [gridOptions, setGridOptions] = useState<GridOptions>(gridOptionsPropspects);
    const [picksGridOptions, setPicksGridOptions] = useState<GridOptions>({
        ...gridOptionsPicks,
        rowSelection: "single",
    });

    const onSelectionChanged = (params: any) => {
        const selectedRow = params.api.getSelectedRows()[0];
        // TODO
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
                                const response = await get(
                                    `${process.env.BASE_URL_FANTASY_SVC}/franchise/${fID}`,
                                );
                                const franchise: Franchise = response.result;
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

    const handleDraft = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        /*
        if (formValidator(formData)) {
            if (typeof formData.draftPick === "string") {
                formData.draftPick = JSON.parse(formData.draftPick);
            }
            // post data
            if (
                currentTarget.submitter !== null &&
                currentTarget.submitter.textContent == "Draft"
            ) {
                post(`${process.env.BASE_URL_FANTASY_SVC}/prospect/draft`, formData).then(
                    (data) => {
                        if (data.status == 201) {
                            console.log(`API response code ${data.status}`);
                        } else {
                            // TODO: handle error api response
                            console.log(`API response ${data}`);
                            console.log(data);
                        }
                    },
                );
            } else if (
                currentTarget.submitter !== null &&
                currentTarget.submitter.textContent == "Undraft"
            ) {
                post(`${process.env.BASE_URL_FANTASY_SVC}/prospect/undraft`, formData).then(
                    (data) => {
                        if (data.status == 201) {
                            console.log(`API response code ${data.status}`);
                        } else {
                            // TODO: handle error api response
                            console.log(`API response ${data}`);
                            console.log(data);
                        }
                    },
                );
            } else {
                console.log(formData);
            }
        }
        */
    };

    useEffect(() => {
        console.log("<Prospects>");
        setGridOptions({ ...gridOptions, onSelectionChanged: onSelectionChanged });
        if (league !== undefined && league !== null) {
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "leagueID",
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
                <form onSubmit={handleDraft}>
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
                    {gridOptions.rowData === null || gridOptions.rowData === undefined ? (
                        <div></div>
                    ) : (
                        <Grid gridOptions={gridOptions} />
                    )}
                    <div class="divider"></div>
                    <button className="btn">Draft</button>
                    <button className="btn">Undraft</button>
                </form>
            </div>
        </div>
    );
};
export default Draft;
