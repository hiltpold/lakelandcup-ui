import { FunctionalComponent, h }from 'preact';
import { Route, Router } from 'preact-router';
import {useContext, useEffect, useState} from 'preact/hooks';
import Hero from "./hero";
import Navbar from "./navbar";
import League from "../routes/league";
import Prospects from "../routes/prospects";
import Franchise from "../routes/franchise";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import SignIn from "../routes/signin";
import SignUp from "../routes/signup";
import Auth from '../contexts/auth';
import Activation from '../routes/activation';
import ProtectedRoute from './protect';
import Fantasy from '../contexts/fantasy';

const App: FunctionalComponent = () => {
    
    useEffect(() => {
        console.log("<App>");
        // TODO: Check if token stored as cookie is still valid and set context accordingly
    }, []);

    return (
        <div id="app">
            <Auth>
                <Hero/>
                <Navbar/>
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