import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import post, { get } from "../../utils/requests";
import League from "../league";
import Draft from "../draft";
import Trade from "../trade";
import Franchise from "../franchise";
import style from "./style.module.css";
import { UserType, LeagueType } from "../../components/app";
import { FranchiseFormType } from "../../utils/reducers";
import SignIn from "../../routes/signin";

const AdminBoard: FunctionalComponent = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [league, setLeague] = useState<LeagueType>();
    const [franchises, setFranchises] = useState<FranchiseFormType[]>([]);
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

        // get all franchises in this league, if league was already created
        if (league !== undefined) {
            get(`${process.env.BASE_URL_FANTASY_SVC}/league/${league.ID}/franchises`)
                .then((data) => {
                    if (data.status == 401 || data.result.length == 0) {
                        // TODO: handle error api response
                        console.log(`GET Franchises: API response code ${data.status}`);
                    } else {
                        setFranchises(data.result);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [authenticated]);

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

    return authenticated ? ( //  &&league && (league.AdminID === authenticated.id || league.CommissionerID === authenticated.id)
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
                            <a className="text-error text-tiny" href="/" onClick={handleSignout}>
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
    ) : (
        <SignIn path="/signin" />
    );
};
export default AdminBoard;
