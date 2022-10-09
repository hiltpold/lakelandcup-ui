import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Hero from "./hero";
import Navbar from "./navbar";
import League from "../routes/league";
import Prospects from "../routes/prospects";
import Home from "../routes/home";
import NotFound from "../routes/notfound";
import Login from "../routes/login";
import Signup from "../routes/signup";

const App: FunctionalComponent = () => {
    return (
        <div id="app">
            <Hero/>
            <Navbar/>
            <Router>
                <Home path="/" />
                <League path="/league" />
                <Login path="/login" />
                <Signup path="/signup" />
                <NotFound default />
            </Router>
        </div>
    );
};
export default App;