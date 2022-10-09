import { FunctionalComponent, h } from "preact";
import style from "./style.module.css";
import AuthenticationButton from "../authbuttons";

const Navbar: FunctionalComponent= () => {
    return(
        <header className={`navbar ${style.navbar}`}>
            <section className="navbar-section" />
            <section className="navbar-center">
                <a className="btn btn-link text-dark" href="/league"> League </a>
                <a className="btn btn-link text-dark" href="/login"> Login </a>
            </section>
            <section className="navbar-section" />
        </header>
    );
}; 
export default Navbar;