import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useEffect, useState, useReducer, useImperativeHandle } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { LeagueContext } from "../../contexts/fantasy";
import post, { get } from "../../utils/requests";
import style from "./style.module.css";
import { User } from "../../components/app";
import formReducer, { FormEnum, LeagueType } from "../../utils/reducers";

export const initialLeague = {
    name: "",
    foundationYear: "",
    maxFranchises: null,
    maxProspects: null,
    maxYearsSkater: null,
    maxYearsGoalie: null,
    adminID: "",
    commissionerID: "",
};
const League: FunctionalComponent = () => {
    const [formData, setFormData] = useReducer(formReducer<LeagueType>, initialLeague);
    const [leagueExists, setLeagueExists] = useState<boolean>(false);
    const [users, setUsers] = useState<Array<User>>();
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    //const [submitting, setSubmitting] = useState<boolean>(false);
    //const { leagueState, setLeagueState } = useContext(LeagueContext);

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        setFormData({
            type: FormEnum.Set,
            payload: { name: currentTarget.name, value: currentTarget.value },
        });
    };

    const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        console.log(formData);
    };

    useEffect(() => {
        // check if league was already created

        // get signed up users
        get(`${process.env.BASE_URL_AUTH_SVC}/user`).then((data) => {
            if (data.status == 200) {
                console.log(data);
            } else {
                // TODO: handle error api response
                console.log(`API response code ${data.status}`);
            }
        });

        // set creator of league as admin
        setFormData({
            type: FormEnum.Set,
            payload: { name: "admin", value: "" },
        });

        console.log("<League>");
        console.log(process.env.BASE_URL_FANTASY_SVC);
    }, []);

    if (leagueExists) {
        return (
            <div className={`container`}>
                <div className="columns">
                    <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.league}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className={`form-label ${style.label}`}>Commissioner</label>
                                <select
                                    class="form-select"
                                    name="commissioner"
                                    type="text"
                                    onChange={handleChange}
                                >
                                    <option></option>
                                </select>
                                <label className="form-label">
                                    <button className="btn">Update</button>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`container`}>
                <div className="columns">
                    <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.league}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className={`form-label ${style.label}`}>League Name</label>
                                <label className="form-label">
                                    <input
                                        className="form-input lakelandcup-input-form"
                                        name="leagueName"
                                        type="text"
                                        placeholder="league name"
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className={`form-label ${style.label}`}>
                                    Foundation Year
                                </label>
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
                                <label className={`form-label ${style.label}`}>Commissioner</label>
                                <select
                                    class="form-select"
                                    name="commissioner"
                                    type="text"
                                    onChange={handleChange}
                                >
                                    <option></option>
                                </select>
                                <label className="form-label">
                                    <button className="btn">Create</button>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
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
