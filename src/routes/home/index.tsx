import { FunctionalComponent, h } from "preact";
import style from "./style.module.css";
const Home: FunctionalComponent = () => {
    return (
        <div className={`${style.home} container grid-md`}>
            <div className="columns">
                <div className=" ">
                    {" "}
                    This website is home to the legendary <b>Lakelandcup</b>, a fantasy hockey
                    league with a rich tradition that was founded 2012. The franchise owners take
                    pride in being the best managers possible and have been expanding the game
                    beyond the limits of traditional platforms. To keep track of picks and
                    prospects, the franchise owners created this website.
                </div>
            </div>
        </div>
    );
};
export default Home;
