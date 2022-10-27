import { h, FunctionalComponent } from 'preact';
import { Route, Router } from 'preact-router';
import {AuthContext} from '../../contexts/auth';
import {useContext} from "preact/hooks";
import Redirect from "../../components/redirect";

const ProtectedRoute: FunctionalComponent = ({ component: Component , ...restOfProps }: any) => {
    const {authenticated, setAuthenticated} = useContext(AuthContext);

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
