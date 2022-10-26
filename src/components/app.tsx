import { FunctionalComponent, h }from 'preact';
import { Route, Router } from 'preact-router';
import {useContext, useState} from 'preact/hooks';
import Hero from "./hero";
import Navbar from "./navbar";
import League from "../routes/league";
import Prospects from "../routes/prospects";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import SignIn from "../routes/signin";
import SignUp from "../routes/signup";
import authContext from '../contexts';
import Activation from '../routes/activation';
import ProtectedRoute from './protect';

const App: FunctionalComponent = () => {
    const [authenticated, setAuthenticated] = useState(false);

    return (
        <div id="app">
            <authContext.Provider value={{ authenticated, setAuthenticated }}>
                <Hero/>
                <Navbar/>
                <Router>
                    <Home path="/" />
                    <League path="/league" />
                    <Prospects path="/prospects" />
                    <SignIn path="/signin" />
                    <SignUp path="/signup" />
                    <Activation path="/activation" />
                    <NotFound default />
                </Router>
            </authContext.Provider>

        </div>
    );
};
export default App;