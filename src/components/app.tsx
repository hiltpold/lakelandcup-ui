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
import Fantasy from "../routes/fantasy";
import internal from "stream";

export type UserType = {
    ID: string;
    Name: string;
    Role: string;
};
export type FranchiseType = {
    ID: string;
    Name: string;
    OwnerName: string;
};
export type LeagueType = {
    ID: string;
    Name: string;
    FoundationYear: string;
    Admin: string;
    AdminID: string;
    Commissioner: string;
    CommissionerID: string;
    DraftRightsGoalie: bigint;
    DraftRightsSkater: bigint;
    MaxFranchises: bigint;
    MaxProspects: bigint;
    Franchises: FranchiseType[];
};

const App: FunctionalComponent = () => {
    useEffect(() => {
        console.log("<App>");
    }, []);

    return (
        <div id="app">
            <Auth>
                <Hero />
                <Navbar />
                <Router>
                    <Home path="/" />
                    <SignIn path="/signin" />
                    <SignUp path="/signup" />
                    <Activation path="/activation" />
                    <AdminBoard path="/adminboard/:rest*" />
                    <Fantasy path="/fantasy/:rest*" />
                    <NotFound default />
                </Router>
            </Auth>
        </div>
    );
};
export default App;
