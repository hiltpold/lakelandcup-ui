import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { AuthContext } from '../../contexts/auth';
import { LeagueContext, FranchiseContext } from '../../contexts/fantasy';
import style from "./style.module.css";

const League: FunctionalComponent = () =>   {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const {leagueState, setLeagueState} = useContext(LeagueContext);

    return (
        <div className={`${style.league} container grid-md`}>
            <h1>
                {`League`}
            </h1>
            <h1>
                {`Authentication: ${authenticated}`}
            </h1>
            <h1>
                {`Fantasy State: ${JSON.stringify(leagueState)}`}
            </h1>
        </div>
    );
}
export default League;