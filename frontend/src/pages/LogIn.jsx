import React from "react";
import {
  Button,
  Section,
  Container,
  Column,
  Box,
  Field,
  Label,
  Control,
  Input,
  Block,
} from "rbx";
import { useHistory } from "react-router-dom";

const LogIn = () => {
  const history = useHistory();

  function onSumbit() {
    history.replace("/account");
  }

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size="6" offset="3">
            <Box>
              <Field>
                <Label>Email</Label>
                <Control>
                  <Input type="email" placeholder="Enter Email Here..." />
                </Control>
              </Field>
              <Field>
                <Label>Password</Label>
                <Control>
                  <Input type="password" placeholder="Enter Password Here..." />
                </Control>
              </Field>
              <Field kind="group" align="right">
                <Control>
                  <Button color="primary" onClick={onSumbit}>
                    Log In
                  </Button>
                </Control>
              </Field>
              <Block textColor="danger">{"Example"}</Block>
            </Box>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default LogIn;
