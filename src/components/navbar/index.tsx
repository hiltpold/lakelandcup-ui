import { FunctionalComponent, h } from "preact";
import style from "./style.module.css";
import AuthenticationButton from "../authbuttons";

const Navbar: FunctionalComponent= () => {
    return(
        <header className={`navbar ${style.navbar}`}>
            <section className="navbar-section" />
            <section className="navbar-center">
                <a className="btn btn-link text-dark" href="/prospects"> Prospects </a>
                <a className="btn btn-link text-dark" href="/league"> League </a>
            </section>
            <section className="navbar-section" >
                <a className="btn btn-link text-dark" href="/signin"> Sign In </a>
            </section>
        </header>
    );
}; 
export default Navbar;