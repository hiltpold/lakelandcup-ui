import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { FranchiseContext } from "../../contexts/fantasy";
import style from "./style.module.css";
import formReducer, { FormEnum, FranchiseType } from "../../utils/reducers";
import { UserType, LeagueType } from "../../components/app";
import post, { get } from "../../utils/requests";

const initialFranchise = {
    name: "",
    ownerId: "",
    ownerName: "",
    foundationYear: "",
    leagueID: "",
};

const Franchise: FunctionalComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const [formData, setFormData] = useReducer(formReducer<FranchiseType>, initialFranchise);
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const { franchiseState, setFranchiseState } = useContext(FranchiseContext);

    useEffect(() => {
        console.log("<Franchise>");
        // get all leagues (array only contains lakelandcup)
        console.log(league);
    }, [authenticated]);

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        if (currentTarget.name == "ownerId") {
            const userName = users.find((u) => u.id === currentTarget.value);
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "ownerName",
                    value: userName !== undefined ? userName.name : "",
                },
            });
        }
        setFormData({
            type: FormEnum.Set,
            payload: { name: currentTarget.name, value: currentTarget.value },
        });
        console.log(formData);
    };

    const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        if (league !== undefined) {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "leagueID", value: league.ID },
            });

            if (
                formData.leagueID === "" ||
                formData.name === "" ||
                formData.foundationYear === "" ||
                formData.ownerName === "" ||
                formData.ownerId === ""
            ) {
                console.error("One Form field is empty");
            } else {
                post(`${process.env.BASE_URL_FANTASY_SVC}/franchise`, formData).then((data) => {
                    if (data.status == 201) {
                        console.log(data);
                        console.log(`API response code ${data.status}`);
                    } else {
                        // TODO: handle error api response
                        console.log(`API response code ${data.status}`);
                    }
                });
            }
        } else {
            console.error("League is undefined.");
        }
    };

    return (
        <div className="columns">
            <div
                className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.franchise}`}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className={`form-label ${style.label}`}>League</label>
                        <label className="form-label">
                            <input
                                className="form-input lakelandcup-input-form"
                                type="text"
                                value={league?.Name}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <label className={`form-label ${style.label}`}>Franchise Name</label>
                        <label className="form-label">
                            <input
                                className="form-input lakelandcup-input-form"
                                name="name"
                                type="text"
                                placeholder="franchise name"
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
                        <label className={`form-label ${style.label}`}>Owner</label>
                        <select
                            class="form-select"
                            name="ownerId"
                            type="text"
                            onChange={handleChange}
                        >
                            <option></option>
                            {users.map((u) => (
                                <option value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <label className="form-label">
                            {league !== undefined ? (
                                <button className="btn">Create</button>
                            ) : (
                                <button className="btn" disabled>
                                    Create
                                </button>
                            )}
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Franchise;
