import { FunctionalComponent, h } from 'preact';
import style from "./style.module.css";
const Home: FunctionalComponent = () =>   {
    return (
        <div className={`${style.home} container grid-xl grid-md grid-xs`}>
            <div className="columns">
            <div className=" "> This is the home of the legendary <b>Lakelandcup</b>. Founded over 10 years ago the Lakelandcup has a rich tradition and franchise owners take pride in being the best managers possible. Many moons ago the franchise owner decided to extend the game of fantasy hockey over the limits provided by Yahoo. Consequently, the the bookkeeping of picks and prospects had to be managed externally. This was the starting point of this website.</div>
            </div>
        </div>
    );
}
export default Home;