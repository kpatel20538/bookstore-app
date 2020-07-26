import React, {lazy, Suspense} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PageLoader } from "rbx";
import Appbar from "/components/Appbar";

const Account = lazy(() => import("/pages/Account"));
const Home = lazy(() => import("/pages/Home"));
const LogIn = lazy(() => import("/pages/LogIn"));
const SignUp = lazy(() => import("/pages/SignUp"));

const App = () => {
  return (
    <BrowserRouter>
      <Appbar />
      <Suspense fallback={<PageLoader color="primary" />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
