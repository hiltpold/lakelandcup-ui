import { h, JSX } from "preact";
import { FunctionComponent } from "preact/compat";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
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

type Prospect = {
    ID: string;
    FullName: string;
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

type ProspectView = {
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

const gridOptionsProspects = {
    columnDefs: columnDefsProspect,
    rowData: [],
    rowHeight: 35,
} as GridOptions;

const Prospects: FunctionComponent = () => {
    const [prospectsGridOptions, setProspectsGridOptions] =
        useState<GridOptions>(gridOptionsProspects);
    const [search, setSearch] = useState<string>("");

    const displayProspectsGrid = () => {
        get(`${process.env.BASE_URL_FANTASY_SVC}/prospect/${encodeURIComponent(search)}`)
            .then((data) => {
                console.log(">>", data);
                if (data.status != 200) {
                    // TODO: handle error api response
                    console.log("API response", data);
                } else {
                    if (data.prospects && data.prospects.length >= 0) {
                        const prospects = data.prospects.map((p: Prospect) => {
                            return {
                                ID: p.ID,
                                FullName: p.FullName,
                                Birthdate: p.Birthdate,
                                FranchiseID: p.FranchiseID,
                                LeagueID: p.LeagueID,
                                Pick: p.Pick,
                                Protected: p.Protected,
                            };
                        });
                        const prospectsView = prospects.map(async (p: Prospect) => {
                            const year = p.Pick.DraftYear !== undefined ? p.Pick.DraftYear : "";
                            const round = p.Pick.DraftRound !== undefined ? p.Pick.DraftRound : "";
                            const inRound =
                                p.Pick.DraftPickInRound !== undefined
                                    ? p.Pick.DraftPickInRound
                                    : "";
                            const overoall =
                                p.Pick.DraftPickOverall !== undefined
                                    ? p.Pick.DraftPickOverall
                                    : "";
                            let tmp: ProspectView = {
                                FullName: p.FullName,
                                Franchise: "",
                                FranchiseID: "",
                                DraftYear: year,
                                Round: round,
                                PickInRound: inRound,
                                PickOverall: overoall,
                                Protected: p.Protected,
                                Birthdate: p.Birthdate,
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
                            setProspectsGridOptions({
                                ...prospectsGridOptions,
                                rowData: pv,
                            });
                        });
                    } else {
                        setProspectsGridOptions({
                            ...prospectsGridOptions,
                            rowData: [],
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleProspectsOnKeyUp = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        //e.preventDefault();
        if (e.key == "Enter" && search.length > 0) {
            displayProspectsGrid();
        } else if (e.key == "Enter" && search.length == 0) {
            setProspectsGridOptions({ ...prospectsGridOptions, rowData: [] });
            displayProspectsGrid();
        } else {
            setSearch(e.currentTarget.value);
        }
    };

    const handleProspectsOnClick = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
        if (search.length > 0) {
            displayProspectsGrid();
        } else {
            setProspectsGridOptions({ ...prospectsGridOptions, rowData: [] });
            displayProspectsGrid();
        }
    };
    useEffect(() => {
        console.log("<Prospects>");
    }, []);

    return (
        <div className={`columns`}>
            <div
                className={`column col-6 col-mx-auto col-xs-12 col-sm-12 col-md-8 col-lg-12 col-xl-6 ${style.prospects}`}
            >
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
            </div>
        </div>
    );
};
export default Prospects;
