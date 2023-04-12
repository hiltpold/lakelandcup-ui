import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import post, { get } from "../../utils/requests";
import { GridOptions } from "ag-grid-community";

import formReducer, { FormEnum } from "../../utils/reducers";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
export type Franchise = {
    ID: string;
    Name: string;
};
export type DraftPick = {
    ID: string;
    DraftYear: string;
    DraftRound: string;
    DraftPickInRound: string;
    DraftPickOverall: string;
    OwnerName: string;
    OwnerID: string;
    LastOwnerName: string;
    LastOwnerID: string;
    OriginName: string;
    OriginID: string;
};

export type DraftPickView = {
    ID: string;
    Year: string;
    PickID: string;
    Round: string;
    PickInRound: string;
    PickOverall: string;
    Owner: string;
    OwnerID: string;
    LastOwner: string;
    LastOwnerID: string;
    Origin: string;
    OriginID: string;
};

export type Prospect = {
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

export type ProspectViewDraft = {
    ID: string;
    FullName: string;
    Franchise: string;
    DraftYear: string;
    Round: string;
    PickInRound: string;
    PickOverall: string;
    NhlTeam: string;
    Birthdate: string;
    LeagueID: string;
    FranchiseID: string;
    PickID: string;
};

export type ProspectViewTrade = {
    ID: string;
    FullName: string;
    Franchise: string;
    NhlTeam: string;
    Birthdate: string;
    LeagueID: string;
    FranchiseID: string;
    PickID: string;
    DraftYear: string;
    Round: string;
    PickInRound: string;
    PickOverall: string;
};

export type TradePayload = {
    FranchiseID: string;
    Picks: string[];
    Prospects: string[];
};

export type Trade = {
    First: TradePayload;
    Second: TradePayload;
};

export const columnDefsProspect = [
    { field: "ProspectID", hide: true },
    { field: "FullName", minWidth: 175, suppressSizeToFit: true },
    { field: "Franchise", minWidth: 175, suppressSizeToFit: true },
    { field: "FranchiseID", hide: true },
    { field: "PickID", hide: true },
    { field: "DraftYear", minWidth: 125, suppressSizeToFit: true },
    { field: "Round", minWidth: 80, suppressSizeToFit: true },
    { field: "PickInRound", minWidth: 125, suppressSizeToFit: true },
    { field: "PickOverall", minWidth: 125, suppressSizeToFit: true },
    { field: "NhlTeam", minWidth: 175, suppressSizeToFit: true },
    { field: "Birthdate", minWidth: 125, suppressSizeToFit: true },
];

export const columnDefsPicks = [
    { field: "ID", hide: true },
    { field: "Year", minWidth: 80, suppressSizeToFit: true },
    { field: "PickID", hide: true },
    { field: "Round", minWidth: 80, suppressSizeToFit: true },
    { field: "PickInRound", minWidth: 125, suppressSizeToFit: true },
    { field: "PickOverall", minWidth: 125, suppressSizeToFit: true },
    { field: "Owner", minWidth: 175, suppressSizeToFit: true },
    { field: "LastOwner", hide: true },
    { field: "Origin", minWidth: 175, suppressSizeToFit: true },
    { field: "OwnerID", hide: true },
    { field: "OriginID", hide: true },
    { field: "LastOwnerID", hide: true },
];
export const gridOptionsProspects = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

export const gridOptionsPicks = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

export const gridOptionsProspectsFrom = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

export const gridOptionsPicksFrom = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

export const gridOptionsProspectsTo = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

export const gridOptionsPicksTo = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

const defaultErrMsg = "Select Picks|Prospects to Trade";

const Trade: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [validTrade, setValidTrade] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>(defaultErrMsg);

    const [fromFranchise, setFromFranchise] = useState<string>("");
    const [toFranchise, setToFranchise] = useState<string>("");
    const [fromPicksGridOptions, setFromPicksGridOptions] =
        useState<GridOptions>(gridOptionsPicksFrom);
    const [fromProspectsGridOptions, setFromProspectsGridOptions] =
        useState<GridOptions>(gridOptionsProspectsFrom);
    const [toPicksGridOptions, setToPicksGridOptions] = useState<GridOptions>(gridOptionsPicksTo);
    const [toProspectsGridOptions, setToProspectsGridOptions] =
        useState<GridOptions>(gridOptionsProspectsTo);

    const handleFromFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        const fID = currentTarget.value;
        setFromFranchise(fID);
        // get picks
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/picks`)
            .then((data) => {
                if (data.picks !== undefined) {
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
                    setFromPicksGridOptions({ ...fromPicksGridOptions, rowData: picks });
                } else {
                    setFromPicksGridOptions({ ...fromPicksGridOptions, rowData: [] });
                }
            })
            .catch((error) => console.log(error));
        // get prospects
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/prospects`)
            .then((data) => {
                if (data.prospects !== undefined) {
                    const prospects = data.prospects.map((p: Prospect) => {
                        const f = league!.Franchises.find((f) => f.ID === fID);
                        const fName = f !== undefined ? f.Name : "";
                        return {
                            ID: p.ID,
                            FullName: p.FullName,
                            Franchise: fName,
                            DraftYear: p.Pick.DraftYear,
                            Round: p.Pick.DraftRound,
                            PickInRound: p.Pick.DraftPickInRound,
                            PickOverall: p.Pick.DraftPickOverall,
                            NhlTeam: p.NhlTeam,
                            Birthdate: p.Birthdate,
                        };
                    });
                    setFromProspectsGridOptions({
                        ...fromProspectsGridOptions,
                        rowData: prospects,
                    });
                } else {
                    setFromProspectsGridOptions({ ...fromProspectsGridOptions, rowData: [] });
                }
            })
            .catch((error) => console.log(error));
    };

    const handleToFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        const fID = currentTarget.value;
        setToFranchise(fID);
        // get picks
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/picks`)
            .then((data) => {
                if (data.picks !== undefined) {
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
                    setToPicksGridOptions({ ...toPicksGridOptions, rowData: picks });
                } else {
                    setToPicksGridOptions({ ...toPicksGridOptions, rowData: [] });
                }
            })
            .catch((error) => console.log(error));
        // get prospects
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/prospects`)
            .then((data) => {
                if (data.prospects !== undefined) {
                    const prospects = data.prospects.map((p: Prospect) => {
                        const f = league!.Franchises.find((f) => f.ID === fID);
                        const fName = f !== undefined ? f.Name : "";
                        return {
                            ID: p.ID,
                            FullName: p.FullName,
                            Franchise: fName,
                            DraftYear: p.Pick.DraftYear,
                            Round: p.Pick.DraftRound,
                            PickInRound: p.Pick.DraftPickInRound,
                            PickOverall: p.Pick.DraftPickOverall,
                            NhlTeam: p.NhlTeam,
                            Birthdate: p.Birthdate,
                        } as ProspectViewTrade;
                    });
                    setToProspectsGridOptions({
                        ...toProspectsGridOptions,
                        rowData: prospects,
                    });
                } else {
                    setToProspectsGridOptions({ ...toProspectsGridOptions, rowData: [] });
                }
            })
            .catch((error) => console.log(error));
    };

    const handleTrade = (event: JSX.TargetedEvent<HTMLFormElement | HTMLButtonElement, Event>) => {
        event.preventDefault();
        // FROM
        const fromPicksSelected = fromPicksGridOptions.api!.getSelectedRows() as DraftPick[];
        const fromProspectsSelected = fromProspectsGridOptions.api!.getSelectedRows() as Prospect[];

        let fromPicks = [] as string[];
        let fromProspects = [] as string[];
        if (fromPicksSelected.length > 0) {
            fromPicks = fromPicksSelected.map((p) => p.ID);
        }

        if (fromProspectsSelected.length > 0) {
            fromProspects = fromProspectsSelected.map((p) => p.ID);
        }
        const toPicksSelected = toPicksGridOptions.api!.getSelectedRows() as DraftPick[];
        const toProspectsSelected = toProspectsGridOptions.api!.getSelectedRows() as Prospect[];

        // to
        let toPicks = [] as string[];
        let toProspects = [] as string[];
        if (toPicksSelected.length > 0) {
            toPicks = toPicksSelected.map((p) => p.ID);
        }

        if (toProspectsSelected.length > 0) {
            toProspects = toProspectsSelected.map((p) => p.ID);
        }

        const trade = {
            First: {
                FranchiseID: fromFranchise,
                Picks: fromPicks,
                Prospects: fromProspects,
            },
            Second: {
                FranchiseID: toFranchise,
                Picks: toPicks,
                Prospects: toProspects,
            },
        } as Trade;
        if (fromFranchise !== "" && toFranchise !== "" && fromFranchise !== toFranchise) {
            // handle trade
            if (league !== undefined) {
                post(
                    `${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/franchise/trade`,
                    trade,
                )
                    .then((data) => {
                        if (data.status == 200) {
                            console.log("API response:", data);
                            setValidTrade(true);
                            setTimeout(() => {
                                setValidTrade(false);
                            }, 3000);
                        } else {
                            // TODO: handle error api response
                            console.log("API response:", data);
                            setValidTrade(false);
                            setErrMsg("Could not Trade Picks|Prospects");
                            setTimeout(() => {
                                setErrMsg(defaultErrMsg);
                            }, 3000);
                        }
                    })
                    .catch((error) => console.log(error))
                    .finally(() => {
                        //remove from grid
                        const selectedFromProspects =
                            fromProspectsGridOptions.api!.getSelectedRows();
                        const selectedToProspects = toProspectsGridOptions.api!.getSelectedRows();
                        fromProspectsGridOptions.api!.applyTransaction({
                            remove: selectedFromProspects,
                        });
                        toProspectsGridOptions.api!.applyTransaction({
                            remove: selectedToProspects,
                        });

                        const selectedFromPicks = fromPicksGridOptions.api!.getSelectedRows();
                        const selectedToPicks = toPicksGridOptions.api!.getSelectedRows();
                        fromPicksGridOptions.api!.applyTransaction({ remove: selectedFromPicks });
                        toPicksGridOptions.api!.applyTransaction({ remove: selectedToPicks });
                    });
            } else {
                setValidTrade(false);
            }
        }
    };

    useEffect(() => {
        console.log("<Trade>");
    }, [authenticated]);

    return league !== undefined ? (
        <div className={`columns`}>
            <div
                className={`column col-6 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.trade}`}
            >
                <form onSubmit={handleTrade}>
                    <div className="form-group">
                        <label className={`form-label ${style.label}`}>First Franchise</label>
                        <select
                            className={"form-select"}
                            name="fromFranchiseID"
                            type="text"
                            onChange={handleFromFranchiseChange}
                        >
                            <option value="">{""}</option>
                            {league !== undefined ? (
                                league!.Franchises.map((f) => (
                                    <option value={f.ID}>{f.Name}</option>
                                ))
                            ) : (
                                <option value="">{""}</option>
                            )}
                        </select>
                    </div>
                    <label className={`form-label ${style.label}`}>Availabe Picks</label>
                    {fromPicksGridOptions.rowData === null ||
                    fromPicksGridOptions.rowData === undefined ? (
                        // fromPicksGridOptions.rowData.length === 0
                        <div></div>
                    ) : (
                        <Grid gridOptions={fromPicksGridOptions} />
                    )}
                    <label className={`form-label ${style.label}`}>Availabe Prospects</label>
                    {fromProspectsGridOptions.rowData === null ||
                    fromProspectsGridOptions.rowData === undefined ? (
                        //fromProspectsGridOptions.rowData.length === 0
                        <div></div>
                    ) : (
                        <div className="form-group">
                            <Grid gridOptions={fromProspectsGridOptions} />
                        </div>
                    )}
                    <div style="padding-bottom:1rem"></div>
                    <div className="form-group">
                        <label className={`form-label ${style.label}`}>Second Franchise</label>
                        <select
                            className={"form-select"}
                            name="toFranchiseID"
                            type="text"
                            onChange={handleToFranchiseChange}
                        >
                            <option value="">{""}</option>
                            {league !== undefined ? (
                                league!.Franchises.map((f) => (
                                    <option value={f.ID}>{f.Name}</option>
                                ))
                            ) : (
                                <option value="">{""}</option>
                            )}
                        </select>
                    </div>
                    <label className={`to-label ${style.label}`}>Availabe Picks</label>
                    {toPicksGridOptions.rowData === null ||
                    toPicksGridOptions.rowData === undefined ? (
                        <div></div>
                    ) : (
                        <Grid gridOptions={toPicksGridOptions} />
                    )}
                    <label className={`to-label ${style.label}`}>Availabe Prospects</label>
                    {toProspectsGridOptions.rowData === null ||
                    toProspectsGridOptions.rowData === undefined ? (
                        <div></div>
                    ) : (
                        <div className="to-group">
                            <Grid gridOptions={toProspectsGridOptions} />
                        </div>
                    )}
                    <div style="padding-bottom:1rem"></div>
                    {!validTrade ? (
                        <div>
                            <b>
                                <div class="text-error">{errMsg}</div>
                            </b>
                            <div class="divider"></div>
                        </div>
                    ) : (
                        <div>
                            <b>
                                <div class="text-success">Traded Picks|Prospects</div>
                            </b>
                            <div class="divider"></div>
                        </div>
                    )}
                    <div className="form-horizontal">
                        <div className="form-group">
                            <div className="col-3 col-mr-auto">
                                <button className="col-12 btn btn-primary">Trade</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div class="loading"></div>
    );
};
export default Trade;
