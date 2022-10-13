import { FunctionalComponent, h } from 'preact';
import LoginButton from "./loginbutton";
import LogoutButton from "./logoutbutton";

const AuthenticationButton: FunctionalComponent= () => {
  const isAuthenticated : Boolean = false;

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;