import { FunctionalComponent, h } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import style from "./style.module.css";
import formReducer, { FormEnum, LeagueTypeForm } from "../../utils/reducers";
import { UserType, LeagueType } from "../../components/app";

const Prospects: FunctionalComponent<{ users: UserType[]; league: LeagueType | undefined }> = ({
    users,
    league,
}) => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        console.log("<Prospect>");
    }, [authenticated]);
    return (
        <div className={`${style.prospects} container grid-md`}>
            <h1>{`Prospects`}</h1>
            <h1>{`Authentication: ${authenticated}`}</h1>
        </div>
    );
};
export default Prospects;
