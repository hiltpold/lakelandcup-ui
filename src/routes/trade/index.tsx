import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer from "../../utils/reducers";
import Grid from "../../components/grid";
import { UserType, LeagueType } from "../../components/app";
import post, { get } from "../../utils/requests";
import { GridOptions } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type Franchise = {
    ID: string;
    Name: string;
};

type DraftPick = {
    draftYear: string;
    draftRound: string;
    draftPickInRound: string;
    draftPickOverall: string;
    owner: Franchise;
    lastOwner: Franchise;
    origin: Franchise;
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

type Trade = {
    fromFranchiseID: string;
    picks: DraftPick[];
    prospects: string[];
    toFranchiseID: string;
};

const columnDefsProspect = [
    { field: "FullName" },
    { field: "Franchise" },
    { field: "NhlTeam" },
    { field: "Birthdate" },
];

const columnDefsPicks = [
    { field: "DraftYear" },
    { field: "Round" },
    { field: "Owner" },
    { field: "LastOwner" },
    { field: "Origin" },
    { field: "OwnerID", hide: true },
    { field: "OriginID", hide: true },
    { field: "LastOwnerID", hide: true },
];

const gridOptionsPropspects = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

const gridOptionsPicks = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
} as GridOptions;

const initialTrade = {
    fromFranchiseID: "",
    picks: [],
    prospects: [],
    toFranchiseID: "",
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
        const selectedRows = params.api.getSelectedRows();
        console.log(selectedRows);
    };

    const onSelectionChangedProspects = (params: any) => {
        const selectedRows = params.api.getSelectedRows();
        console.log(selectedRows);
    };

    const handleFromFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        //
        // generate picks
        const fID = currentTarget.value;
        const picks = possibleFuturePicks.get(fID)!.map((p) => {
            return {
                DraftYear: p.draftYear,
                Round: p.draftRound,
                Owner: p.owner.Name,
                OwnerID: p.owner.ID,
                LastOwner: p.lastOwner.Name,
                LastOwnerID: p.lastOwner.ID,
                Origin: p.origin.Name,
                OriginID: p.origin.ID,
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
                        const franchise: Franchise = { ID: f.ID, Name: f.Name };
                        const res: DraftPick = {
                            draftYear: y.toString(),
                            draftRound: r.toString(),
                            draftPickInRound: "",
                            draftPickOverall: "",
                            owner: franchise,
                            origin: franchise,
                            lastOwner: franchise,
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
