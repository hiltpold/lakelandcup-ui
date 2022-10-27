import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { AuthContext } from '../../contexts/auth';
import { FranchiseContext } from '../../contexts/fantasy';
import style from "./style.module.css";

const Franchise: FunctionalComponent = () =>   {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const {franchiseState, setFranchiseState} = useContext(FranchiseContext);

    return (
        <div className={`${style.franchise} container grid-md`}>
            <h1>
                {`Franchise`}
            </h1>
            <h1>
                {`Authentication: ${authenticated}`}
            </h1>
            <h1>
                {`Fantasy State: ${JSON.stringify(franchiseState)}`}
            </h1>
        </div>
    );
}
export default Franchise;