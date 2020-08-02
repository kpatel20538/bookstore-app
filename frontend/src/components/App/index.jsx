import React, {lazy, Suspense} from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PageLoader } from "rbx";

import Appbar from "../Appbar";

import constants from "./constants.yaml";

const Account = lazy(() => import("/pages/Account"));
const Home = lazy(() => import("/pages/Home"));
const LogIn = lazy(() => import("/pages/LogIn"));
const SignUp = lazy(() => import("/pages/SignUp"));
const Book = lazy(() => import("/pages/Book"));
const BookList = lazy(() => import("/pages/BookList"));

const client = new ApolloClient({
  uri: constants.apollo.uri,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
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
            <Route path="/book/:id">
              <Book />
            </Route>
            <Route path="/books/:category">
              <BookList />
            </Route>
            <Route path="/books">
              <BookList />
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
    </ApolloProvider>
  );
};

export default App;
