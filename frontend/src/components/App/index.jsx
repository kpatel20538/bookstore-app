import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PageLoader } from "rbx";

import Appbar from "../Appbar";

import AuthApiProvider from "../AuthApiProvider";

const Account = lazy(() => import("../../pages/Account"));
const BestSellers = lazy(() => import("../../pages/BestSellers"));
const Book = lazy(() => import("../../pages/Book"));
const Cart = lazy(() => import("../../pages/Cart"));
const Category = lazy(() => import("../../pages/Category"));
const Checkout = lazy(() => import("../../pages/Checkout"));
const Home = lazy(() => import("../../pages/Home"));
const NotFound = lazy(() => import("../../pages/NotFound"));
const Orders = lazy(() => import("../../pages/Orders"));
const Search = lazy(() => import("../../pages/Search"));
const SignIn = lazy(() => import("../../pages/SignIn"));

const App = () => {
  return (
    <AuthApiProvider>
      <BrowserRouter>
        <Appbar />
        <Suspense fallback={<PageLoader color="primary" />}>
          <Switch>
            <Route path="/account" component={Account} />
            <Route path="/best-sellers" component={BestSellers} />
            <Route path="/book/:id" component={Book} />
            <Route path="/cart" component={Cart} />
            <Route path="/category/:name" component={Category} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/search" component={Search} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/" exact component={Home} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </AuthApiProvider>
  );
};

export default App;
