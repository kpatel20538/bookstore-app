import React from "react";
import { Hero, Title, Column, Block, Box, Image } from "rbx";
import { useParams, useHistory } from "react-router";
import { useQuery, gql } from "@apollo/client";

import BookCard from "../../components/BookCard";
import BOOK_BY_ID from "./query.gql";

const Recommendations = ({ title, books }) => {
      const history = useHistory();

  return books ? (
    <Block>
      <Title>{title}</Title>
      <Column.Group multiline>
        {books.map(({ book_id, cover, name }) => (
          <Column size={2} key={book_id}>
            <Box>
              <Image.Container onClick={() => {history.push(`/book/${book_id}`)}}>
                <Image alt={name} src={cover} />
              </Image.Container>
              <strong>{name}</strong>
            </Box>
          </Column>
        ))}
      </Column.Group>
    </Block>
  ) : null;
};

const BookList = () => {
  const params = useParams();

  const { data } = useQuery(gql(BOOK_BY_ID), {
    variables: { book_id: params.id },
    fetchPolicy: "cache-and-network",
  });

  return (
    <>
      <Hero color="primary" size="medium" textAlign="centered">
        <Hero.Body>
          <Title>Book</Title>
        </Hero.Body>
      </Hero>
      {data && <BookCard book={data.book} />}
      <Recommendations
        title="From the Author"
        books={data && data.book.recommendationsFromAuthor}
      />
      <Recommendations
        title="From the Customers of the Author"
        books={data && data.book.recommendationsFromCustomers}
      />
      <Recommendations
        title="For you, Demi"
        books={data && data.recommendationsFromPurchases}
      />
    </>
  );
};

export default BookList;
