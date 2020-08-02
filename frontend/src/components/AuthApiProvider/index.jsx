import React, { useRef, useState, createContext } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import constants from "./constants.yaml";

const createApolloClient = (tokenRef) => {
  const httpLink = createHttpLink({ uri: constants.services.api });
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: tokenRef.current ? `Bearer ${tokenRef.current}` : "",
    },
  }));
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export const AuthApiContext = createContext();

const AuthApiProvider = ({ children }) => {
  const tokenRef = useRef();
  const [token, setToken] = useState(null)
  const [client] = useState(() => createApolloClient(tokenRef));
  const putToken = (token) => {
    tokenRef.current = token;
    setToken(token);
  };
  const hasToken = Boolean(token);

  return (
    <AuthApiContext.Provider value={{ putToken, hasToken }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthApiContext.Provider>
  );
};

export default AuthApiProvider;
