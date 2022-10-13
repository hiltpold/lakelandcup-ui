import { FunctionalComponent, h } from 'preact';

import style from "./style.module.css";

const LogoutButton: FunctionalComponent = () =>   {
   return (
        <button className={`btn btn-link text-dark ${style.button}`} onClick={()=>{console.log("TODO: Logout")}}>
            Logout
        </button>
   );
}
export default LogoutButton;