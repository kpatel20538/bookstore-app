import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import App from './App';
import {
  Box,
  Input,
  Field,
  Label,
  Button,
  Title,
  Message,
  Section,
  Container,
  Column,
} from "rbx";
import "rbx/index.css";

const useAsyncFn = (fn) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const callback = (...args) => {
    setLoading(true);
    return fn(...args)
      .then((data) => {
        setError(null);
        setData(data);
        setLoading(false);
        return data;
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  return [callback, { data, loading }];
};

const handleResponse = (response) =>
  response.text().then((text) => {
    console.log(response)
    if (!response.ok) {
      throw new Error(text);
    }
    return text;
  });

const BOOKSTORE_HOSTNAME = "https://bookstore-kpatel20538.cloud.okteto.net";

const App = () => {
  const [email, setEmail] = useState("");
  const [submit, { loading: sending, error: sendError }] = useAsyncFn(() =>
    fetch(`${BOOKSTORE_HOSTNAME}/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then(handleResponse)
  );
  const [
    check,
    { data: claims, loading: checking, error: checkingError },
  ] = useAsyncFn(() =>
    fetch(`${BOOKSTORE_HOSTNAME}/auth/claims`).then(handleResponse)
  );
  const [logout, { loading: loggingOut, error: logoutError }] = useAsyncFn(() =>
    fetch(`${BOOKSTORE_HOSTNAME}/auth/logout`)
      .then(handleResponse)
      .then((res) => check())
  );

  useEffect(() => {
    check();
  }, []);

  return (
    <Section>
      <Container>
        <Column.Group centered>
          <Column narrow>
            <Box>
              <Title>Passwordless Login</Title>
              {sendError && (
                <Message color="danger">
                  <Message.Body>{sendError.message}</Message.Body>
                </Message>
              )}
              {checkingError && (
                <Message color="danger">
                  <Message.Body>{checkingError.message}</Message.Body>
                </Message>
              )}
              {logoutError && (
                <Message color="danger">
                  <Message.Body>{logoutError.message}</Message.Body>
                </Message>
              )}
              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Button.Group>
                <Button onClick={submit} state={sending ? "loading" : null}>
                  Send Auth Link
                </Button>

                <Button onClick={check} state={checking ? "loading" : null}>
                  Check Claims
                </Button>

                <Button onClick={logout} state={loggingOut ? "loading" : null}>
                  Logout
                </Button>
              </Button.Group>
            </Box>

            <Message color="info">
              <Message.Header>User Claims</Message.Header>
              <Message.Body as="pre">{JSON.stringify(JSON.parse(claims), null, 2)}</Message.Body>
            </Message>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
