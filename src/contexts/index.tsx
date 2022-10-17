
import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import Loading from "../components/loading";

import { createContext } from "preact";

const authContext = createContext({
  authenticated: false,
  setAuthenticated: (auth: boolean) => {}
});

/*
const ProtectedRoute: FunctionalComponent = ({children, ...args }) => (
  <Route
    component={withAuthenticationRequired(children, {
      onRedirecting: () => <Loading />,
    })}
    {...args}
  />
);

export {authContext, ProtectedRoute}
*/

export default authContext;