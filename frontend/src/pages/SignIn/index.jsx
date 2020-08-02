import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Column,
  Container,
  Control,
  Field,
  Input,
  Label,
  Message,
  Section,
} from "rbx";
import { useHistory } from "react-router-dom";

import { fetchJSON } from "../../helpers/rest";
import { AuthApiContext } from "../../components/AuthApiProvider";
import constants from "./constants.yaml";

const SignIn = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { putToken } = useContext(AuthApiContext);

  const onSumbit = async () => {
    try {
      const { access_token } = await fetchJSON(constants.services.auth, {
        email,
      });
      putToken(access_token);
      history.replace("/account");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size="6" offset="3">
            <Box>
              {error && <Message>{error.message}</Message>}
              <Field>
                <Label>{constants.labels.email}</Label>
                <Control>
                  <Input
                    type="email"
                    placeholder={constants.placeholders.email}
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                </Control>
              </Field>
              <Field kind="group" align="right">
                <Control>
                  <Button color="primary" onClick={onSumbit}>
                    {constants.actions.signIn}
                  </Button>
                </Control>
              </Field>
            </Box>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default SignIn;
