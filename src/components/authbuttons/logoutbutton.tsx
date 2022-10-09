import { FunctionalComponent, h } from 'preact';
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.module.css";

const LogoutButton: FunctionalComponent = () =>   {
   const { logout } = useAuth0();
   return (
        <button className={`btn btn-link text-dark ${style.button}`} onClick={()=>logout({ returnTo: window.location.origin })}>
            Logout
        </button>
   );
}
export default LogoutButton;