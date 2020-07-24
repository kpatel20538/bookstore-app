import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import App from './App';
import static from "./static.yaml";
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
  Loader,
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
    console.log(response);
    if (!response.ok) {
      throw new Error(text);
    }
    return text;
  });

const BOOKSTORE_HOSTNAME = "https://bookstore-kpatel20538.cloud.okteto.net";

const App = () => {
  const access_token = new URL(window.location).searchParams.get(
    "access_token"
  );
  const [email, setEmail] = useState("");
  const [
    submit,
    { data: sent, loading: sending, error: sendError },
  ] = useAsyncFn(() =>
    fetch(`${BOOKSTORE_HOSTNAME}/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then(handleResponse)
  );

  const [getData, { data, loading, error }] = useAsyncFn(() =>
    fetch(`${BOOKSTORE_HOSTNAME}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token || ""}`,
      },
      body: JSON.stringify({
        query: `query {
          books {
            title
            author
            price
            owner
          }
          me {
            loggedIn
            email
            roles
          }
        }`,
      }),
    }).then(handleResponse)
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <Section>
      <Container>
        <Column.Group centered>
          <Column narrow>
            <Box>
              <Title>Passwordless Login</Title>
              <Title subtitle>{sent && "Email Sent!"}</Title>
              {sendError && (
                <Message color="danger">
                  <Message.Body>{sendError.message}</Message.Body>
                </Message>
              )}
              {error && (
                <Message color="danger">
                  <Message.Body>{error.message}</Message.Body>
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
                <Button
                  onClick={() => (window.location = "/static/index.html")}
                  disabled={!access_token}
                >
                  Logout
                </Button>
              </Button.Group>
            </Box>
          </Column>
        </Column.Group>
        <Column.Group centered>
          <Column size={6}>
            <Message color="warning">
              <Message.Header>GraphQL Schema</Message.Header>
              <Message.Body as="pre">{static.schema}</Message.Body>
            </Message>
          </Column>
          <Column size={6}>
            <Message color="info">
              <Message.Header>GraphQL Result</Message.Header>
              <Message.Body as="pre">
                {loading ? (
                  <Loader />
                ) : (
                  JSON.stringify(JSON.parse(data), null, 2)
                )}
              </Message.Body>
            </Message>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
