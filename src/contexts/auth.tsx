
import { FunctionalComponent, ComponentChildren, h } from 'preact';
import { Route, Router } from 'preact-router';
import Loading from "../components/loading";
import {StateUpdater, useContext, useEffect, useState} from 'preact/hooks';
import { createContext } from "preact";

export interface IAuthContext {
    authenticated: boolean;
    setAuthenticated: StateUpdater<boolean> 
}

export const AuthContext = createContext({} as IAuthContext);

const Auth: FunctionalComponent = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    return(
        <AuthContext.Provider value={{ authenticated, setAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );

}; 
export default Auth;