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

type Franchise = {
    ID: string;
    Name: string;
};

type DraftPick = {
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

type DraftPickView = {
    ID: string;
    DraftYear: string;
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
    Protected: string;
};

export type ProspectView = {
    FullName: string;
    Franchise: string;
    FranchiseID: string;
    DraftYear: string;
    Round: string;
    PickInRound: string;
    PickOverall: string;
    Protected: string;
    Birthdate: string;
};

const columnDefsProspect = [
    { field: "FullName", minWidth: 175, suppressSizeToFit: true },
    { field: "Franchise", minWidth: 175, suppressSizeToFit: true },
    { field: "DraftYear", minWidth: 105, suppressSizeToFit: true },
    { field: "Round", minWidth: 80, suppressSizeToFit: true },
    { field: "PickInRound", minWidth: 125, suppressSizeToFit: true },
    { field: "PickOverall", minWidth: 125, suppressSizeToFit: true },
    { field: "Protected", minWidth: 125, suppressSizeToFit: true },
    { field: "Birthdate", minWidth: 125, suppressSizeToFit: true },
];

export const columnDefsPicks = [
    { field: "DraftYear", minWidth: 105, suppressSizeToFit: true },
    { field: "Round", minWidth: 80, suppressSizeToFit: true },
    { field: "PickInRound", minWidth: 125, suppressSizeToFit: true },
    { field: "PickOverall", minWidth: 125, suppressSizeToFit: true },
    { field: "Owner", minWidth: 175, suppressSizeToFit: true },
    { field: "LastOwner", minWidth: 175, suppressSizeToFit: true },
    { field: "Origin", minWidth: 175, suppressSizeToFit: true },
];

const gridOptionsProspects = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    onGridReady: (event) => event.columnApi.autoSizeAllColumns(),
} as GridOptions;

const gridOptionsPicks = {
    columnDefs: columnDefsPicks,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    onGridReady: (event) => event.columnApi.autoSizeAllColumns(),
} as GridOptions;

const Franchises: FunctionComponent = () => {
    const [league, setLeague] = useState<LeagueType>();
    const [franchise, setFranchise] = useState<string>("");
    const [picksGridOptions, setPicksGridOptions] = useState<GridOptions>(gridOptionsPicks);
    const [prospectsGridOptions, setProspectsGridOptions] =
        useState<GridOptions>(gridOptionsProspects);

    const handleFranchiseChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        const fID = currentTarget.value;
        setFranchise(fID);
        // get picks
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/picks`)
            .then((data) => {
                if (data.picks !== undefined) {
                    const picks = data.picks.map((p: DraftPick) => {
                        return {
                            ID: p.ID,
                            DraftYear: p.DraftYear,
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
            })
            .catch((error) => console.log(error));
        // get prospects
        get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league!.ID}/franchise/${fID}/prospects`)
            .then((data) => {
                console.log(data);
                if (data.prospects !== undefined) {
                    const prospects = data.prospects.map((p: Prospect) => {
                        const f = league!.Franchises.find((f) => f.ID === fID);
                        const fName = f !== undefined ? f.Name : "";
                        console.log(p.Pick);
                        return {
                            FullName: p.FullName,
                            Franchise: fName,
                            DraftYear: p.Pick.DraftYear,
                            Round: p.Pick.DraftRound,
                            PickInRound: p.Pick.DraftPickInRound,
                            PickOverall: p.Pick.DraftPickOverall,
                            Birthdate: p.Birthdate,
                            Protected: p.Protected,
                        } as ProspectView;
                    });
                    console.log(prospects);
                    setProspectsGridOptions({
                        ...prospectsGridOptions,
                        rowData: prospects,
                    });
                } else {
                    setProspectsGridOptions({ ...prospectsGridOptions, rowData: [] });
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        console.log("<Franchises>");
        // get all leagues (array only contains lakelandcup)
        get(`${process.env.BASE_URL_FANTASY_SVC}/leagues`)
            .then((data) => {
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`GET Leagues: API response code ${data.status}`);
                } else {
                    const l = data.result;
                    // if a league exisits, set state accordingly
                    if (l !== undefined && l !== null) {
                        setLeague(data.result[0]);
                    }
                }
            })
            .catch((err) => console.log(err));
    }, []);

    return league !== undefined ? (
        <div className={`columns`}>
            <div
                className={`column col-6 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.franchises}`}
            >
                <div className="form-group">
                    <label className={`form-label ${style.label}`}>From Franchise</label>
                    <select
                        className={"form-select"}
                        name="fromFranchiseID"
                        type="text"
                        onChange={handleFranchiseChange}
                    >
                        <option value="">{""}</option>
                        {league !== undefined ? (
                            league!.Franchises.map((f) => <option value={f.ID}>{f.Name}</option>)
                        ) : (
                            <option value="">{""}</option>
                        )}
                    </select>
                </div>
                <label className={`form-label ${style.label}`}>Availabe Picks</label>
                {picksGridOptions.rowData === null || picksGridOptions.rowData === undefined ? (
                    // fromPicksGridOptions.rowData.length === 0
                    <div></div>
                ) : (
                    <Grid gridOptions={picksGridOptions} />
                )}
                <label className={`form-label ${style.label}`}>Availabe Prospects</label>
                {prospectsGridOptions.rowData === null ||
                prospectsGridOptions.rowData === undefined ? (
                    //fromProspectsGridOptions.rowData.length === 0
                    <div></div>
                ) : (
                    <div className="form-group">
                        <Grid gridOptions={prospectsGridOptions} />
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div class="loading" style="margin-top:1rem"></div>
    );
};
export default Franchises;
