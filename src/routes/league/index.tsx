import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import authContext from '../../contexts';
import style from "./style.module.css";

const League: FunctionalComponent = () =>   {
    const {authenticated, setAuthenticated} = useContext(authContext);

    return (
        <div className={`${style.league} container grid-md`}>
            <h1>
                {`League`}
            </h1>
            <h1>
                {`Authentication: ${authenticated}`}
            </h1>
        </div>
    );
}
export default League;