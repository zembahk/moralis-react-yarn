import React, { useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import { useMoralis } from "react-moralis";

function App() {

  const { authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis();

  useEffect(() => {
    const loginButton = document.getElementById('login_btn') as HTMLButtonElement | null;
    if (isAuthenticated) {
      if (loginButton != null) {
        loginButton.disabled = true;
      }
    }
    else {
      loginButton!.disabled = false;
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

    const login = async () => {
      if (!isAuthenticated) {

        await authenticate({signingMessage: "Log in using Moralis" })
          .then(function (user) {
            console.log("Logged in user:\n\t", user!.get("ethAddress"));
            console.log(user);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const logOut = async () => {
      if (user){
        console.log("Logged in as: \n\t",user.get("ethAddress"));
      }
      else{
        console.log("User already logged out")
      }
      await logout();
      console.log("Logging out DONE");
    }

  return (
    <div>
      <h1>Moralis Hello World!</h1>
      <button id="login_btn" onClick={login}>Moralis Metamask Login</button>
      <button id="logout_btn" onClick={logOut} disabled={isAuthenticating}>Logout</button>
    </div>
  );
}

export default App;
