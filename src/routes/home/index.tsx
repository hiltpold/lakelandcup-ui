import { FunctionalComponent, h } from "preact";
import style from "./style.module.css";
const Home: FunctionalComponent = () => {
    return (
        <div className={`${style.home} container grid-md`}>
            <div className="columns">
                <div className=" ">
                    {" "}
                    This is the home of the legendary <b>Lakelandcup</b>, a fantasy hockey league
                    with a proud tradition since its founding in 2012. Our franchise owners are
                    dedicated to excellence and are always looking for new ways to expand the game
                    beyond traditional platforms. As a result, this website was created to track
                    picks and prospects. Join us and become a part of the Lakelandcup legacy!
                </div>
            </div>
        </div>
    );
};
export default Home;
