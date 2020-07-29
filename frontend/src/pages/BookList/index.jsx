import React from "react";
import { Hero, Title, Section, Container, Column } from "rbx";
import { useParams } from "react-router";
import { useQuery, gql } from "@apollo/client";

import BookCard from "/components/BookCard";
import BOOKS_BY_CATEGORY from "./query.gql";

const BookList = () => {
  const params = useParams();
  const { data } = useQuery(gql(BOOKS_BY_CATEGORY), {
    variables: { category: params.category },
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
              data.books.rows.map((book) => (
                <Column
                  key={book.book_id}
                  mobile={{ size: 12 }}
                  tablet={{ size: 6 }}
                  desktop={{ size: 4 }}
                >
                  <BookCard book={book} />
                </Column>
              ))}
          </Column.Group>
        </Container>
      </Section>
    </>
  );
};

export default BookList;
