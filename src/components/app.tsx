import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Hero from "./hero";
import Navbar from "./navbar";
import League from "../routes/league";
import Prospects from "../routes/prospects";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import SignIn from "../routes/signin";
import SignUp from "../routes/signup";

const App: FunctionalComponent = () => {
    return (
        <div id="app">
            <Hero/>
            <Navbar/>
            <Router>
                <Home path="/" />
                <League path="/league" />
                <SignIn path="/signin" />
                <SignUp path="/signup" />
                <NotFound default />
            </Router>
        </div>
    );
};
export default App;