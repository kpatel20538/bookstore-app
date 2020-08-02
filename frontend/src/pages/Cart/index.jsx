import React from "react";
import { Hero, Title, Section, Container, Column } from "rbx";
import { useParams } from "react-router";
import { useQuery, gql } from "@apollo/client";

import BookCard from "/components/BookCard";
import CART_BY_USER from "./query.gql";

const Cart = () => {
  const params = useParams();
  const { data } = useQuery(gql(CART_BY_USER), {
    fetchPolicy: "cache-and-network",
  });
  console.log(params);

  return (
    <>
      <Hero color="primary" size="medium" textAlign="centered">
        <Hero.Body>
          <Title>Books Lists</Title>
        </Hero.Body>
      </Hero>
      <Section>
        <Container>
          <Column.Group multiline>
            {data &&
              data.card.items.map(({book, quantity, price}) => (
                <Column
                  key={book.book_id}
                  mobile={{ size: 12 }}
                  tablet={{ size: 6 }}
                  desktop={{ size: 4 }}
                >
                  <BookCard book={book} quantity={quantity} price={price} inCart />
                </Column>
              ))}
          </Column.Group>
        </Container>
      </Section>
    </>
  );
};

export default Cart;
