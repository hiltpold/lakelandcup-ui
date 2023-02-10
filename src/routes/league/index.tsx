import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useEffect, useState, useReducer } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import post, { get } from "../../utils/requests";
import style from "./style.module.css";
import { UserType, LeagueType } from "../../components/app";
import formReducer, { FormEnum, LeagueFormType } from "../../utils/reducers";
import Grid from "../../components/grid";
import { GridOptions, AgGridEvent } from "ag-grid-community";

const isInteger = (num: string | number) => /^-?[0-9]+$/.test(num + "");

type DraftLottery = {
    Franchise: string;
    FranchiseID: string;
    Owner: string;
    Year: string;
    LotteryPosition: bigint | string | null;
};

const initialLeague = {
    Name: "",
    AdminID: "",
    Admin: "",
    CommissionerID: "",
    Commissioner: "",
    FoundationYear: "",
    MaxFranchises: null,
    MaxProspects: null,
    DraftRightsSkater: null,
    DraftRightsGoalie: null,
    DraftRounds: null,
};

const columnDefsLottery = [
    { field: "Franchise", rowDrag: true },
    { field: "OwnerName" },
    { field: "Year" },
    {
        headerName: "Lottery Position",
        valueGetter: "node.rowIndex + 1",
    },
    { field: "FranchiseID", hide: true },
];

const gridOptionsLotteryInit = {
    columnDefs: columnDefsLottery,
    rowData: [],
    rowHeight: 35,
    onSelectionChanged: undefined,
    rowSelection: "multiple",
    animateRows: true,
    rowDragManaged: true,
} as GridOptions;

export const initialLeagueUpdate = {
    field: "",
    value: "",
};

const initialDraftLottery = {
    FranchiseID: "",
    LotteryPosition: null,
};

const League: FunctionalComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const [formData, setFormData] = useReducer(formReducer<LeagueFormType>, initialLeague);
    const [formDataLottery, setFormDataLottery] = useState<DraftLottery[]>([]);

    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [gridOptionsLottery, setGridOptionsLottery] =
        useState<GridOptions>(gridOptionsLotteryInit);

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        console.log(currentTarget.value);
        let name = currentTarget.name;
        let value = currentTarget.value;

        if (currentTarget.name == "commissionerID") {
            const userName = users.find((u) => u.id === currentTarget.value);
            name = "commissioner";
            value = userName !== undefined ? userName.name : "";
        }

        setFormData({
            type: FormEnum.Set,
            payload: {
                name: name,
                value: isInteger(value) ? parseInt(value) : value,
            },
        });
    };

    const handleCreateLeague = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        // set signed in user as admin of league as admin
        const adminUser = users.find((u) => u.id === authenticated.id);
        if (!submitting) {
            setSubmitting(true);
            if (adminUser === undefined || adminUser.id === undefined) {
                console.error("Signed In User is not stored in db. Should not happen.");
            } else {
                setFormData({
                    type: FormEnum.Set,
                    payload: { name: "admin", value: adminUser.name },
                });
                setFormData({
                    type: FormEnum.Set,
                    payload: { name: "adminID", value: adminUser.id },
                });
            }

            // send league creation data to backend
            post(`${process.env.BASE_URL_FANTASY_SVC}/league`, formData).then((data) => {
                if (data.status == 201) {
                    console.log(`API response code ${data.status}`);
                } else {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                }
            });
        }

        setTimeout(() => {
            setSubmitting(false);
        }, 3000);
    };

    const handleUpdateLeague = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        if (league !== undefined) {
            // create update from current league and form update
            const updates = Object.entries(formData).map((entry) => {
                const field = entry[0];
                const value = entry[1];
                if (value !== null && value !== undefined && value !== "") {
                    return { [field]: value };
                } else {
                    return { [field]: league[field as keyof LeagueType] };
                }
            });

            // reduce updates to single update form
            const update = updates.reduce((acc, curr) => {
                for (let key in curr) {
                    acc[key] = curr[key as keyof LeagueFormType];
                }
                return acc;
            }, {});
            console.log(update);
            // send update to fantasy backend
            post(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}`, update).then((data) => {
                if (data.status == 201) {
                    console.log(data);
                    console.log(`API response code ${data.status}`);
                } else {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                }
            });
        }
    };

    const handleUpdateLottery = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        console.log(formDataLottery);
    };

    const handleChangeDraftYear = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        if (gridOptionsLottery.rowData !== null && gridOptionsLottery.rowData !== undefined) {
            const tmp = gridOptionsLottery.rowData.map((r) => {
                return {
                    ...r,
                    Year: currentTarget.value,
                } as DraftLottery;
            });
            setGridOptionsLottery({ ...gridOptionsLottery, rowData: tmp });
        }
    };

    const onLotteryDataChanged = (params: AgGridEvent) => {
        params.api.refreshCells();
        const rowData: DraftLottery[] = [];
        params.api.forEachNode((node, idx) =>
            rowData.push({ ...node.data, LotteryPosition: idx + 1 }),
        );
        setFormDataLottery(rowData);
    };

    useEffect(() => {
        console.log("<League>");
        console.log(league);
        if (league !== undefined && league.Franchises !== undefined) {
            const rowData = league.Franchises.map((f) => {
                return {
                    Franchise: f.Name,
                    OwnerName: f.OwnerName,
                    Year: null,
                    FranchiseID: f.ID,
                };
            });
            setGridOptionsLottery({
                ...gridOptionsLottery,
                rowData: rowData,
                onDragStopped: onLotteryDataChanged,
                onRowDataUpdated: onLotteryDataChanged,
            });
        }
    }, [authenticated, users]);

    return (
        <div className={"container"}>
            <div className="columns">
                <div
                    className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.league}`}
                >
                    <form onSubmit={league === undefined ? handleCreateLeague : handleUpdateLeague}>
                        <div className="form-group">
                            <label className={`form-label ${style.label}`}>League Name</label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="Name"
                                    type="text"
                                    placeholder="league name"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>Foundation Year</label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="FoundationYear"
                                    type="text"
                                    placeholder="foundation year"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Number of Franchises
                            </label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="MaxFranchises"
                                    type="number"
                                    placeholder="max franchises"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Number of Prospects per Franchise
                            </label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="MaxProspects"
                                    type="number"
                                    placeholder="max prospects"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Draft Rights for Goalies in Years
                            </label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="DraftRightsGoalie"
                                    type="number"
                                    placeholder="draft rights goalies"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Draft Rights for Skaters in Years
                            </label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="DraftRightsSkater"
                                    type="number"
                                    placeholder="draft rights skaters"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>Draft Rounds</label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="DraftRounds"
                                    type="number"
                                    placeholder="draft rounds"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>Commissioner</label>
                            <select
                                class="form-select"
                                name="CommissionerID"
                                type="text"
                                onChange={handleChange}
                            >
                                <option></option>
                                {users.map((u: UserType) => (
                                    <option value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            {league !== undefined ? (
                                <label className="form-label">
                                    <button className="btn">Update</button>
                                </label>
                            ) : (
                                <label className="form-label">
                                    <button className="btn">Create</button>
                                </label>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            {gridOptionsLottery.rowData !== null &&
            gridOptionsLottery.rowData !== undefined &&
            gridOptionsLottery.rowData.length > 0 ? (
                <div
                    className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.league}`}
                    style={"margin-top:2rem;"}
                >
                    <label className={`form-label ${style.label}`}>Draft Year</label>
                    <label className="form-label">
                        <input
                            className="form-input lakelandcup-input-form"
                            type="text"
                            placeholder="foundation year"
                            onChange={handleChangeDraftYear}
                        />
                    </label>
                    <label className={`form-label ${style.label}`}>Fix Draft Lottery</label>
                    <form onSubmit={handleUpdateLottery}>
                        <Grid gridOptions={gridOptionsLottery} />
                        <label className="form-label">
                            <button className="btn">Update</button>
                        </label>
                    </form>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};
export default League;
