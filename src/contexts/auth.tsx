import { FunctionalComponent, ComponentChildren, h } from "preact";
import { Route, Router } from "preact-router";
import Loading from "../components/loading";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { createContext } from "preact";
import { get } from "../utils/requests";

export type AuthType = {
    state: boolean;
    id: string;
};

export interface IAuthContext {
    authenticated: AuthType;
    setAuthenticated: StateUpdater<AuthType>;
}

export const AuthContext = createContext({} as IAuthContext);

const Auth: FunctionalComponent = ({ children }) => {
    const [authenticated, setAuthenticated] = useState({ id: "", state: false });

    useEffect(() => {
        console.log("<AuthContext>");
        get(`${process.env.BASE_URL_AUTH_SVC}/user/info`)
            .then((data) => {
                if (data.status == 401) {
                    // TODO: handle error api response
                    console.log(`API response code ${data.status}`);
                } else {
                    setAuthenticated({ id: data.userId, state: true });
                }
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
export default Auth;
