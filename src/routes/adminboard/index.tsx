import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import { get } from "../../utils/requests";
import League from "../league";
import Draft from "../draft";
import Trade from "../trade";
import Franchise from "../franchise";
import style from "./style.module.css";
import { UserType, LeagueType } from "../../components/app";
import SignIn from "../../routes/signin";
import Redirect from "../../components/redirect";

const AdminBoard: FunctionalComponent = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [league, setLeague] = useState<LeagueType>();
    const [users, setUsers] = useState<UserType[]>([]);

    // TODO: correct type
    const handleSignout = ({ currentTarget }: any) => {
        // sign out
        get(`${process.env.BASE_URL_AUTH_SVC}/signout`).then((data) => {
            if (data.status == 200) {
                setAuthenticated({ ID: "", State: false, Role: "" });
            } else {
                // TODO: handle error api response
                console.log(`API response code ${data.status}`);
            }
        });
    };

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
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`GET Leagues: API response code ${data.status}`);
                } else {
                    const l = data.result;
                    // if a league exisits, set state accordingly
                    if (l !== undefined && l !== null) {
                        setLeague(data.result[0]);
                    }
                }
            })
            .catch((err) => console.log(err));
    }, [authenticated]);

    if (authenticated.ID !== "" && authenticated.Role == "admin") {
        return (
            <div className={`container`}>
                <div className="columns">
                    <div
                        className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.adminboard}`}
                    >
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
                                <a className="text-tiny" href="/adminboard/draft">
                                    Draft
                                </a>
                            </li>
                            <li class="tab-item">
                                <a className="text-tiny" href="/adminboard/trade">
                                    Trade
                                </a>
                            </li>
                            <li class="tab-item">
                                <a
                                    className="text-error text-tiny"
                                    href="/"
                                    onClick={handleSignout}
                                >
                                    Sign Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <Router>
                    <League path="/adminboard/league" users={users} league={league} />
                    <Franchise path="/adminboard/franchise" users={users} league={league} />
                    <Draft path="/adminboard/draft" users={users} league={league} />
                    <Trade path="/adminboard/trade" users={users} league={league} />
                </Router>
            </div>
        );
    } else if (authenticated.ID !== "" && authenticated.Role != "admin") {
        return (
            <div className={`container`}>
                <div className="columns">
                    <div
                        className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.adminboard}`}
                    >
                        <div class="toast text-center" style="margin-top:1rem">
                            You are signed in, but you have no admin rights.
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Redirect to="/signin"></Redirect>;
    }
};
export default AdminBoard;
