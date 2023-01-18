import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import post, { get } from "../../utils/requests";
import League from "../league";
import Prospects from "../prospects";
import Franchise from "../franchise";
import style from "./style.module.css";
import { UserType, LeagueType } from "../../components/app";

const AdminBoard: FunctionalComponent = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [league, setLeague] = useState<LeagueType>();
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        console.log("<AdminBoard>");
        // get all users
        get(`${process.env.BASE_URL_AUTH_SVC}/user/all`)
            .then((data) => {
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                } else {
                    setUsers(data.users);
                }
            })
            .catch((err) => console.log(err));

        // get all leagues (array only contains lakelandcup)
        get(`${process.env.BASE_URL_FANTASY_SVC}/leagues`)
            .then((data) => {
                if (data.status == 401 || data.result.length == 0) {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                } else {
                    setLeague(data.result[0]);
                }
            })
            .catch((err) => console.log(err));
    }, [authenticated]);

    return (
        <div className={`container`}>
            <div className="columns">
                <div className={`column col-2 col-mx-auto col-xs-12 col-lg-6 ${style.league}`}>
                    <ul class="tab tab-block" style={"margin-bottom:0.5rem"}>
                        <li class="tab-item">
                            <a className="text-tiny" href="/adminboard/league">
                                League
                            </a>
                        </li>
                        <li class="tab-item">
                            <a className="text-tiny" href="/adminboard/franchise">
                                Franchise
                            </a>
                        </li>
                        <li class="tab-item">
                            <a className="text-tiny" href="adminboard/prospect">
                                Prospects
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <Router>
                <League path="/adminboard/league" users={users} />
                <Franchise path="/adminboard/franchise" users={users} league={league} />
                <Prospects path="/adminboard/prospects" />
            </Router>
            <div class="text-center">
                <pre>{`League State: \n${JSON.stringify(league, null, 2)}`}</pre>
            </div>
        </div>
    );
};
export default AdminBoard;
