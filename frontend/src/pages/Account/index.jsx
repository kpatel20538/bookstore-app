import React from "react";
import { Message, Column, Section, Container } from "rbx";
import { gql, useQuery } from "@apollo/client";

import GET_USER from "./query.gql";

const Account = () => {
  const { data, loading, error } = useQuery(gql(GET_USER));

  return (
    <>
      <Section>
        <Container>
          <Column.Group>
            <Column size="6" offset="3">
              <Message color={error ? "danger" : "primary"}>
                <Message.Body as="pre">
                  {JSON.stringify(data || loading || error, null, 1)}
                </Message.Body>
              </Message>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    </>
  );
};

export default Account;
