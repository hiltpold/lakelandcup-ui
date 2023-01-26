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
    adminId: "",
    admin: "",
    commissionerId: "",
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
        console.log(league);
        const filteredUpdates = Object.entries(formData).filter((entry) => {
            const field = entry[0];
            const value = entry[1];
            //console.log(field, value);
            return;
        });

        if (league !== undefined) {
            const updates = Object.entries(formData).map((entry) => {
                const field = entry[0];
                const value = entry[1];
                if (value !== null && value !== undefined && value !== "") {
                    return { [field]: value };
                } else {
                    // TODO find better solution
                    switch (field) {
                        case "admin": {
                            return { [field]: league.Admin };
                        }
                        case "adminId": {
                            return { [field]: league.AdminID };
                        }
                        case "commissioner": {
                            return { [field]: league.Commissioner };
                        }
                        case "commissionerId": {
                            return { [field]: league.CommissionerID };
                        }
                        case "name": {
                            return { [field]: league.Name };
                        }
                        case "foundationYear": {
                            return { [field]: league.FoundationYear };
                        }
                        case "maxFranchises": {
                            return { [field]: league.MaxFranchises };
                        }
                        case "maxProspects": {
                            return { [field]: league.MaxProspects };
                        }
                        case "draftRightsGoalie": {
                            return { [field]: league.DraftRightsGoalie };
                        }
                        case "draftRightsSkater": {
                            return { [field]: league.DraftRightsSkater };
                        }
                    }
                }
            });

            // TODO: Make it TS compatible
            const update = updates.reduce((acc, curr) => {
                for (let key in curr) acc[key] = curr[key];
                return acc;
            }, {} as LeagueTypeForm);

            post(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}`, update).then((data) => {
                if (data.status == 201) {
                    console.log(data);
                    console.log(`API response code ${data.status}`);
                } else {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                }
            });
            console.log(update);
        }
    };

    useEffect(() => {
        console.log("<League>");
    }, [authenticated]);

    return (
        <div className="columns">
            <div
                className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.league}`}
            >
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
                        <label className={`form-label ${style.label}`}>Number of Franchises</label>
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
