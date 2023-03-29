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

export type ProspectView = {
    ID: string;
    FullName: string;
    Franchise: string;
    NhlTeam: string;
    Birthdate: string;
    LeagueID: string;
    FranchiseID: string;
    PickID: string;
};

export type Trade = {
    FromFranchiseID: string;
    Picks: DraftPick[];
    Prospects: string[];
    ToFranchiseID: string;
};

export const columnDefsProspect = [
    { field: "FullName" },
    { field: "Franchise" },
    { field: "FranchiseID", hide: true },
    { field: "PickID", hide: true },
    { field: "NhlTeam" },
    { field: "Birthdate" },
];

export const columnDefsPicks = [
    { field: "ID", hide: true },
    { field: "Year" },
    { field: "Round" },
    { field: "PickInRound" },
    { field: "PickOverall" },
    { field: "Owner" },
    { field: "LastOwner", hide: true },
    { field: "Origin" },
    { field: "OwnerID", hide: true },
    { field: "OriginID", hide: true },
    { field: "LastOwnerID", hide: true },
];

export const gridOptionsPropspects = {
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

const initialTrade = {
    FromFranchiseID: "",
    ToFranchiseID: "",
    Picks: [],
    Prospects: [],
};

const Trade: FunctionComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useReducer(formReducer<Trade>, initialTrade);
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
    const [possibleFuturePicks, setPossibleFuturePicks] = useState(new Map<string, DraftPick[]>());

    const [picksGridOptions, setPicksGridOptions] = useState<GridOptions>(gridOptionsPicks);
    const [prospectsGridOptions, setProspectsGridOptions] =
        useState<GridOptions>(gridOptionsPropspects);

    const onSelectionChangedPicks = (params: any) => {
        const selectedPick = params.api.getSelectedRows()[0] as DraftPick;
        console.log(selectedPick);

        setFormData({
            type: FormEnum.Set,
            payload: { name: "PickID", value: selectedPick.ID },
        });
    };

    const onSelectionChangedProspects = (params: any) => {
        const selectedRows = params.api.getSelectedRows();
        console.log(selectedRows);
    };

    const handleFromFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        // generate picks
        const fID = currentTarget.value;
        const picks = possibleFuturePicks.get(fID)!.map((p) => {
            return {
                DraftYear: p.DraftYear,
                Round: p.DraftRound,
                Owner: p.OwnerName,
                OwnerID: p.OwnerID,
                LastOwner: p.LastOwnerName,
                LastOwnerID: p.LastOwnerID,
                Origin: p.OriginName,
                OriginID: p.OriginID,
            };
        });
        console.log(picks);

        setPicksGridOptions({ ...gridOptionsPicks, rowData: picks });
        console.log(currentTarget.value);
    };
    const handleToFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        console.log(currentTarget);
    };

    const handleTrade = (event: JSX.TargetedEvent<HTMLFormElement | HTMLButtonElement, Event>) => {
        event.preventDefault();
        console.log(event);
    };

    useEffect(() => {
        console.log("<Trade>");

        // set handlers for AgGrid
        setProspectsGridOptions({
            ...prospectsGridOptions,
            onSelectionChanged: onSelectionChangedPicks,
        });

        setPicksGridOptions({
            ...prospectsGridOptions,
            onSelectionChanged: onSelectionChangedProspects,
        });

        // get all franchises
        if (league !== undefined && league !== null) {
            get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/franchises`).then(
                (data) => {
                    if (data.result !== undefined) {
                        console.log(data.result);
                        setFranchises(data.result);
                    }
                },
            );

            // set possible future picks
            const d = new Date();
            let year = d.getFullYear();
            const draftRounds = [1, 2];
            const futureYears = [...Array(11)].map((v, i) => year + i);
            futureYears.forEach((y) => {
                league.Franchises.forEach((f) => {
                    const p: DraftPick[] = draftRounds.map((r) => {
                        const res: DraftPick = {
                            ID: "",
                            DraftYear: y.toString(),
                            DraftRound: r.toString(),
                            DraftPickInRound: "",
                            DraftPickOverall: "",
                            OwnerName: "",
                            OwnerID: "",
                            LastOwnerName: "",
                            LastOwnerID: "",
                            OriginName: "",
                            OriginID: "",
                        };
                        return res;
                    });
                    possibleFuturePicks.has(f.ID)
                        ? possibleFuturePicks.get(f.ID)!.push(...p)
                        : possibleFuturePicks.set(f.ID, p);
                });
            });
            console.log(possibleFuturePicks);
        }
    }, [authenticated, league]);

    return (
        <div className={`columns`}>
            <div
                className={`column col-6 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.trade}`}
            >
                <form onSubmit={handleTrade}>
                    <div className="form-group">
                        <label className={`form-label ${style.label}`}>From Franchise</label>
                        <select
                            className={"form-select"}
                            name="fromFranchiseID"
                            type="text"
                            onChange={handleFromFranchiseChange}
                        >
                            <option value="">{""}</option>
                            {franchises.map((f) => (
                                <option value={f.ID}>{f.Name}</option>
                            ))}
                        </select>
                    </div>
                    <label className={`form-label ${style.label}`}>Availabe Picks</label>
                    {picksGridOptions.rowData === null || picksGridOptions.rowData === undefined ? (
                        // picksGridOptions.rowData.length === 0
                        <div></div>
                    ) : (
                        <Grid gridOptions={picksGridOptions} />
                    )}
                    <label className={`form-label ${style.label}`}>Availabe Prospects</label>
                    {prospectsGridOptions.rowData === null ||
                    prospectsGridOptions.rowData === undefined ? (
                        //prospectsGridOptions.rowData.length === 0
                        <div></div>
                    ) : (
                        <div className="form-group">
                            <Grid gridOptions={prospectsGridOptions} />
                        </div>
                    )}
                    <label className={`form-label ${style.label}`}>To Franchise</label>
                    <select
                        className={"form-select"}
                        name="toFranchiseID"
                        type="text"
                        onChange={handleToFranchiseChange}
                    >
                        <option value="">{""}</option>
                        {franchises.map((f) => (
                            <option value={f.ID}>{f.Name}</option>
                        ))}
                    </select>
                    <div style="padding-bottom:1rem"></div>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <div className="col-3 col-mr-auto">
                                <button className="col-12 btn btn-primary">Trade</button>
                            </div>
                            <div className="col-3">
                                <button className="col-12 btn btn-error">Undo Trade</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Trade;
