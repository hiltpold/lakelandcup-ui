import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../contexts/auth";
import League from "../league";
import Prospects from "../prospects";
import Franchise from "../franchise";
import style from "./style.module.css";

const AdminBoard: FunctionalComponent = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);

    return (
        <div className={`container`}>
            <div className="columns">
                <div className={`column col-2 col-mx-auto col-xs-12 col-lg-6 ${style.league}`}>
                    <ul class="tab tab-block" style={"margin-bottom:0.5rem"}>
                        <li class="tab-item">
                            <a href="/adminboard/league">League</a>
                        </li>
                        <li class="tab-item">
                            <a href="/adminboard/franchise">Franchise</a>
                        </li>
                        <li class="tab-item">
                            <a href="adminboard/prospect">Prospect</a>
                        </li>
                    </ul>
                </div>
            </div>
            <Router>
                <League path="/adminboard/league" users={[]} />
                <Franchise path="/adminboard/franchise" users={[]} />
                <Prospects path="/adminboard/prospects" />
            </Router>
        </div>
    );
};
export default AdminBoard;
