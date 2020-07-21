import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Appbar from "/components/Appbar";
import Account from "/pages/Account";
import Home from "/pages/Home";
import LogIn from "/pages/LogIn";
import SignUp from "/pages/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Appbar />
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <LogIn />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
