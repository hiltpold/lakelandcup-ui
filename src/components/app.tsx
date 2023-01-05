import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../contexts/auth";
import post, { get } from "../utils/requests";
import Hero from "./hero";
import Navbar from "./navbar";
import League from "../routes/league";
import Prospects from "../routes/prospects";
import Franchise from "../routes/franchise";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import SignIn from "../routes/signin";
import SignUp from "../routes/signup";
import Auth from "../contexts/auth";
import Activation from "../routes/activation";
import ProtectedRoute from "./protect";
import Fantasy from "../contexts/fantasy";

export type User = {
    id: string;
    name: string;
};

const App: FunctionalComponent = () => {
    const [initAuth, setInitAuth] = useState<boolean>(true);

    useEffect(() => {
        console.log("<App>");

        // get user information
        get(`${process.env.BASE_URL_AUTH_SVC}/user`)
            .then((data) => {
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`No API response code ${data.status}`);
                    console.log(`API response code ${data.status}`);
                } else {
                    setInitAuth(true);
                    console.log(initAuth);
                }
            })
            .catch((err) => console.log(err));
    });

    return (
        <div id="app">
            <Auth initAuth={initAuth}>
                <Hero />
                <Navbar />
                <Fantasy>
                    <Router>
                        <Home path="/" />
                        <SignIn path="/signin" />
                        <SignUp path="/signup" />
                        <Activation path="/activation" />
                        <League path="/league" />
                        <Franchise path="/franchise" />
                        <Prospects path="/prospects" />
                        <NotFound default />
                    </Router>
                </Fantasy>
            </Auth>
        </div>
    );
};
export default App;
