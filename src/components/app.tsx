import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext, AuthType } from "../contexts/auth";
import post, { get } from "../utils/requests";
import Hero from "./hero";
import Navbar from "./navbar";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import SignIn from "../routes/signin";
import SignUp from "../routes/signup";
import Auth from "../contexts/auth";
import Activation from "../routes/activation";
import AdminBoard from "../routes/adminboard";
import ProtectedRoute from "./protect";
import Fantasy from "../contexts/fantasy";
import internal from "stream";

export type UserType = {
    id: string;
    name: string;
};
export type FranchiseType = {
    ID: string;
};
export type LeagueType = {
    ID: string;
    Name: string;
    Admin: string;
    AdminID: string;
    Commissioner: string;
    CommissionerID: string;
    DraftRightsGoalie: number;
    DraftRightsSkater: number;
    FoundationYear: string;
    MaxFranchises: number;
    MaxProspects: number;
    Franchises: FranchiseType[];
};

const App: FunctionalComponent = () => {
    useEffect(() => {
        console.log("<App>");
        // get user information, check if signed in already
        /*
        get(`${process.env.BASE_URL_AUTH_SVC}/user/info`)
            .then((data) => {
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                } else {
                    setInitAuth({ id: data.userId, state: true });
                }
            })
            .catch((err) => console.log(err));
            */
    }, []);

    return (
        <div id="app">
            <Auth>
                <Hero />
                <Navbar />
                <Fantasy>
                    <Router>
                        <Home path="/" />
                        <SignIn path="/signin" />
                        <SignUp path="/signup" />
                        <Activation path="/activation" />
                        <AdminBoard path="/adminboard/:rest*" />
                        <NotFound default />
                    </Router>
                </Fantasy>
            </Auth>
        </div>
    );
};
export default App;
