import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import Loading from "../../components/loading";
import authContext from '../../contexts';

const League: FunctionalComponent = () =>   {
    const {authenticated, setAuthenticated} = useContext(authContext);

    return (
        <div>
            <h1>
                {`Authentication is ${authenticated}`}
            </h1>
        </div>
    );
}
export default League;