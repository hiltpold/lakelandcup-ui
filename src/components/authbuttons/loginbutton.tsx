import { FunctionalComponent, h } from 'preact';
import {useEffect} from "preact/hooks";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.module.css";

const LoginButton: FunctionalComponent = () =>   {
    const { loginWithRedirect } = useAuth0();
    return (
        <button className={`btn btn-link text-dark ${style.button}`} onClick={()=>loginWithRedirect()}>
            Login
        </button>
    );
}
export default LoginButton;