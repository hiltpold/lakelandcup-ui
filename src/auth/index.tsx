
import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading";

const ProtectedRoute: FunctionalComponent = ({children, ...args }) => (
  <Route
    component={withAuthenticationRequired(children, {
      onRedirecting: () => <Loading />,
    })}
    {...args}
  />
);
export default ProtectedRoute;