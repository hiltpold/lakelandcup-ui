import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { AuthContext } from '../../contexts/auth';
import style from "./style.module.css";

const Prospects: FunctionalComponent = () =>   {
    const {authenticated, setAuthenticated} = useContext(AuthContext);

    return (
        <div className={`${style.prospects} container grid-md`}>
            <h1>
                {`Prospects`}
            </h1>
            <h1>
                {`Authentication: ${authenticated}`}
            </h1>
        </div>
    );
}
export default Prospects;