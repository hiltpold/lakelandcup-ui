import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useEffect, useState, useReducer, useImperativeHandle } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { LeagueContext } from "../../contexts/fantasy";
import post, { get } from "../../utils/requests";
import style from "./style.module.css";
import { UserType, LeagueType } from "../../components/app";
import formReducer, { FormEnum, LeagueTypeForm } from "../../utils/reducers";

export const initialLeague = {
    name: "",
    adminID: "",
    admin: "",
    commissionerID: "",
    commissioner: "",
    foundationYear: "",
    maxFranchises: null,
    maxProspects: null,
    draftRightsSkater: null,
    draftRightsGoalie: null,
};

export const initialLeagueUpdate = {
    field: "",
    value: "",
};

export type LeagueUpdateType = {
    field: string;
    value: string | bigint;
};

const League: FunctionalComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const [formData, setFormData] = useReducer(formReducer<LeagueTypeForm>, initialLeague);
    const [updateData, setUpdateData] = useReducer(
        formReducer<LeagueUpdateType>,
        initialLeagueUpdate,
    );
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        if (currentTarget.name == "commissionerID") {
            const userName = users.find((u) => u.id === currentTarget.value);
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "commissioner",
                    value: userName !== undefined ? userName.name : "",
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

    const handleCreate = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
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

    const handleUpdate = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        const filteredUpdates = Object.entries(formData).filter((entry) => {
            const field = entry[0];
            const value = entry[1];
            return value !== null && value !== undefined && value !== "";
        });

        const updates = filteredUpdates.map((entry) => {
            const field = entry[0];
            const value = entry[1];
            return { field: field, value: value } as LeagueUpdateType;
        });

        console.log(updates);
    };

    useEffect(() => {
        console.log("<League>");
    }, []);
    return (
        <div className={`container`}>
            <div className="columns">
                <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.league}`}>
                    <form onSubmit={league === undefined ? handleCreate : handleUpdate}>
                        <div className="form-group">
                            <label className={`form-label ${style.label}`}>League Name</label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="name"
                                    type="text"
                                    placeholder="league name"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>Foundation Year</label>
                            <label className="form-label">
                                <input
                                    className="form-input lakelandcup-input-form"
                                    name="foundationYear"
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
                                    name="maxFranchises"
                                    type="text"
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
                                    name="maxProspects"
                                    type="text"
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
                                    name="draftRightsGoalie"
                                    type="text"
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
                                    name="draftRightsSkater"
                                    type="text"
                                    placeholder="draft rights skaters"
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={`form-label ${style.label}`}>Commissioner</label>
                            <select
                                class="form-select"
                                name="commissionerID"
                                type="text"
                                onChange={handleChange}
                            >
                                <option></option>
                                {users.map((u) => (
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
        </div>
    );
};
export default League;
/*
        <div className={`${style.league} container grid-md`}>
            <h1>
                {`League`}
            </h1>
            <h1>
                {`Authentication: ${authenticated}`}
            </h1>
            <h1>
                <pre>
                    {`League State: ${JSON.stringify(leagueState, null, 2)}`}
                </pre>
            </h1>
        </div>
        */
