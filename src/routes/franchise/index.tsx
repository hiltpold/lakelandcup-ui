import { FunctionalComponent, h, JSX } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { FranchiseContext } from "../../contexts/fantasy";
import style from "./style.module.css";
import formReducer, { FormEnum, FranchiseType } from "../../utils/reducers";
import { UserType, LeagueType } from "../../components/app";

const initialFranchise = {
    name: "",
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

    const handleChange = ({
        currentTarget,
    }: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement, Event>) => {
        console.log(currentTarget.name);
        console.log(currentTarget.value);
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
        }
        console.log(formData);
    };

    useEffect(() => {
        console.log("<Franchise>");
    }, []);

    return (
        <div className={`container`}>
            <div className="columns">
                <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.franchise}`}>
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
                                    name="franchiseName"
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
                            <label className={`form-label ${style.label}`}>Franchise Owner</label>
                            <select
                                class="form-select"
                                name="franchiseOwner"
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
        </div>
    );
};
export default Franchise;
