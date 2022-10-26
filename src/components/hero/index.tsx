import { FunctionalComponent, h } from 'preact';
import lakelandCupLogo from "../../assets/logo.png";
import style from "./style.module.css";

// <img src={lakelandCupLogo} className={style.img} width="250" height="250"/>
const Hero: FunctionalComponent = () =>   {
    return (
        <div class="container" className={style.hero}>
            <div className={style.imgcontainer}>
            <a href="/" style="outline:none;box-shadow:none">
                <img src={lakelandCupLogo} className={style.img}/>
            </a>
            </div>
        </div>
    );
}
export default Hero;