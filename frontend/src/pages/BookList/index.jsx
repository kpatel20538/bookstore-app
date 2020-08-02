import React, { useState } from "react";
import {
  Hero,
  Title,
  Section,
  Container,
  Column,
  Loader,
  Menu,
  Field,
  Control,
  Input,
  Button,
  Tag,
} from "rbx";
import { useParams, useHistory } from "react-router";
import { useQuery, gql } from "@apollo/client";

import Ratings from "../../components/Ratings";
import BookCard from "../../components/BookCard";
import { formatPrice } from "../../helpers/format";

import SEARCH_BY_BOOKS from "./query.gql";

const BookList = () => {
  const params = useParams();
  const history = useHistory();
  const [stage, setStage] = useState("");
  const [query, setQuery] = useState("");

  const { data, loading } = useQuery(gql(SEARCH_BY_BOOKS), {
    variables: {
      query: `(${query || "*"})${
        params.category ? ` AND (category:${params.category})` : ""
      }`,
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <>
      <Hero color="primary" size="medium" textAlign="centered">
        <Hero.Body>
          <Title>{params.category || "All Books"}</Title>
        </Hero.Body>
      </Hero>
      <Section>
        <Container>
          <Column.Group>
            <Column size={2}>
              <Menu>
                <Menu.Label>Ratings</Menu.Label>
                <Menu.List>
                  {data &&
                    data.search.rating_ranges.map(({ key, doc_count }) => (
                      <Menu.List.Item key={key}>
                        <Ratings rating={key + 1} />:{" "}
                        <strong>{doc_count}</strong>
                      </Menu.List.Item>
                    ))}
                </Menu.List>
                <Menu.Label>Categories</Menu.Label>
                <Menu.List>
                  {data &&
                    data.search.categories.map(({ key, doc_count }) => (
                      <Menu.List.Item
                        key={key}
                        onClick={() => {
                          history.push(
                            key === params.category ? "/" : `/books/${key}`
                          );
                        }}
                      >
                        <Tag.Group gapless>
                          <Tag color="primary">{key}</Tag>
                          {key === params.category ? (
                            <Tag delete color="danger" />
                          ) : (
                            <Tag color="light">{doc_count}</Tag>
                          )}
                        </Tag.Group>
                      </Menu.List.Item>
                    ))}
                </Menu.List>

                <Menu.Label>Price Ranges</Menu.Label>
                <Menu.List>
                  {data &&
                    data.search.price_ranges.map(({ key, doc_count }) => (
                      <Menu.List.Item key={key}>
                        Less than {formatPrice(key)}:
                        <strong>{doc_count}</strong>
                      </Menu.List.Item>
                    ))}
                </Menu.List>
              </Menu>
            </Column>
            <Column>
              <Field kind="addons">
                <Control>
                  <Input
                    placeholder="Find a repository"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  />
                </Control>
                <Control>
                  <Button color="info" onClick={() => setQuery(stage)}>
                    Search
                  </Button>
                </Control>
              </Field>
              <Column.Group multiline>
                {loading && <Loader />}
                {data &&
                  data.search.results.map((book) => (
                    <Column
                      key={book.book_id}
                      mobile={{ size: 12 }}
                      tablet={{ size: 6 }}
                    >
                      <BookCard book={book} />
                    </Column>
                  ))}
              </Column.Group>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    </>
  );
};

export default BookList;
