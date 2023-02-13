import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { FranchiseContext } from "../../contexts/fantasy";
import style from "./style.module.css";
import formReducer, { FormEnum, FranchiseFormType } from "../../utils/reducers";
import { UserType, LeagueType } from "../../components/app";
import post, { get } from "../../utils/requests";
import formValidator from "../../utils/validator";

const initialFranchise = {
    Name: "",
    OwnerId: "",
    OwnerName: "",
    FoundationYear: "",
    LeagueID: "",
};

const Franchise: FunctionalComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const [formData, setFormData] = useReducer(formReducer<FranchiseFormType>, initialFranchise);
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const { franchiseState, setFranchiseState } = useContext(FranchiseContext);

    useEffect(() => {
        console.log("<Franchise>");
        // get all leagues (array only contains lakelandcup)
        if (league !== undefined) {
            setFormData({
                type: FormEnum.Set,
                payload: { name: "LeagueID", value: league.ID },
            });
        }
    }, [authenticated, league, users]);

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        if (currentTarget.name == "OwnerId") {
            const userName = users.find((u) => u.ID === currentTarget.value);
            setFormData({
                type: FormEnum.Set,
                payload: {
                    name: "OwnerName",
                    value: userName !== undefined ? userName.Name : "",
                },
            });
        }
        setFormData({
            type: FormEnum.Set,
            payload: { name: currentTarget.name, value: currentTarget.value },
        });
    };

    const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        if (formValidator(formData)) {
            post(`${process.env.BASE_URL_FANTASY_SVC}/franchise`, formData).then((data) => {
                if (data.status == 201) {
                    console.log(`API response code ${data.status}`);
                } else {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                }
            });
        } else {
            console.error("One or more franchise form entries are empty!");
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
                                name="Name"
                                type="text"
                                placeholder="franchise name"
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
                        <label className={`form-label ${style.label}`}>Owner</label>
                        <select
                            class="form-select"
                            name="OwnerId"
                            type="text"
                            onChange={handleChange}
                        >
                            <option></option>
                            {users.map((u) => (
                                <option value={u.ID}>{u.Name}</option>
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
