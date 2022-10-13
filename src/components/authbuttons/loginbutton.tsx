import { FunctionalComponent, h } from 'preact';
import {useEffect} from "preact/hooks";

import style from "./style.module.css";

const LoginButton: FunctionalComponent = () =>   {
    return (
        <button className={`btn btn-link text-dark ${style.button}`} onClick={()=>console.log("TODO: Login")}>
            Login
        </button>
    );
}
export default LoginButton;