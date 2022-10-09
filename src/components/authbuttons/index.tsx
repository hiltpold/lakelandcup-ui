import { FunctionalComponent, h } from 'preact';
import LoginButton from "./loginbutton";
import LogoutButton from "./logoutbutton";
import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton: FunctionalComponent= () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;