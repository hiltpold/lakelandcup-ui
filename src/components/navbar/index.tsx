import { FunctionalComponent, h } from "preact";
import style from "./style.module.css";
import AuthenticationButton from "../authbuttons";

const Navbar: FunctionalComponent= () => {
    return(
        <header className={`navbar ${style.navbar}`}>
            <section className="navbar-section" >
            </section>
            <section className="navbar-center">
                <a className="btn btn-link text-dark text-small" href="/league"> League </a>
                <a className="btn btn-link text-dark text-small" href="/franchise"> Franchise </a>
                <a className="btn btn-link text-dark text-small" href="/prospects"> Prospects </a>
            </section>
            <section className="navbar-section" >
                <a className="btn btn-link text-dark text-small" href="/signin"> Sign In </a>
            </section>
        </header>
    );
}; 
export default Navbar;
/*
<header className={`navbar ${style.navbar}`}>
    <section className="navbar-section" >
    </section>
    <section className="navbar-center">
        <a className="btn btn-link text-dark" href="/prospects"> Prospects </a>
        <div class="accordion">
            <input type="checkbox" id="accordion-1" name="accordion-checkbox" hidden />
            <label class="accordion-header" style="display:inline" for="accordion-1">
                <i class="icon icon-arrow-right mr-1" />
                Fantasy
            </label>
            <div class="accordion-body" style="position:absolute" >
            <ul class="menu menu-nav text-tiny" style="padding:0;transform:translateY(0)">
            <div style="display:flex">
            <li class="menu-item" style="margin:0">
                <a href="/league">League</a>
            </li>
            <li class="menu-item" style="margin:0">
                <a href="/franchise">Franchise</a>
            </li>
            </div>
            </ul>  

            </div>
        </div>
    </section>
    <section className="navbar-section" >
        <a className="btn btn-link text-dark" href="/signin"> Sign In </a>
    </section>
</header>
*/