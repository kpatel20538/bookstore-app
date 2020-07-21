import React from "react";
import { Hero, Title, Message, Column, Section, Container } from "rbx";

const Account = () => {
  return (
    <>
      <Hero color="info">
        <Hero.Body>
          <Title>My Account</Title>
        </Hero.Body>
      </Hero>
      <Section>
        <Container>
          <Column.Group>
            <Column size="6" offset="3">
              <Message>
                <Message.Body as="pre">{"example"}</Message.Body>
              </Message>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    </>
  );
};

export default Account;
