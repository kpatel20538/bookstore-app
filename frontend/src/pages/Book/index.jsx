import React from "react";
import { Hero, Title, Section, Container, Column } from "rbx";
import { useParams } from "react-router";
import { useQuery, gql } from "@apollo/client";

import BookCard from "/components/BookCard";
import BOOK_BY_ID from "./query.gql";

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
    </>
  );
};

export default BookList;
