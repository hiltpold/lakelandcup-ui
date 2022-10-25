import { h, FunctionalComponent } from 'preact';
import { Route, Router } from 'preact-router';
import authContext from '../../contexts';
import {useContext} from "preact/hooks";
import Redirect from "../../components/redirect";

const ProtectedRoute: FunctionalComponent = ({ component: Component , ...restOfProps }: any) => {
    const {authenticated, setAuthenticated} = useContext(authContext);

    return (
        <Route
        {...restOfProps}
        render={(props: any) =>
            authenticated ? <Component {...props} /> : <Redirect to="/signin" />
        }
        />
    );
}

export default ProtectedRoute;
