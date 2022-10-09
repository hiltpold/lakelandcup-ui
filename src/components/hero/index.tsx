import { FunctionalComponent, h } from 'preact';
import lakelandCupLogo from "../../assets/logo.png";
import style from "./style.module.css";

const Hero: FunctionalComponent = () =>   {
    return (
        <div class="container" className={style.hero}>
            <a href="/" >
                <img src={lakelandCupLogo} className={style.img} width="250" height="250"/>
            </a>
        </div>
    );
}
export default Hero;