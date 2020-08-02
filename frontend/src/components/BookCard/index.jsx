import React from "react";
import {
  Button,
  Media,
  Image,
  Content,
  Level,
  Icon,
  Delete,
  Box,
  Tag,
} from "rbx";
import { useHistory } from "react-router-dom";
import { FaCartPlus, FaTimes } from "react-icons/fa";

import Ratings from "/components/Ratings";

const BookCard = ({ book, inCart, quantity, price }) => {
  const history = useHistory();

  return (
    <Box>
      <Media>
        <Media.Item as="figure" align="left">
          <a onClick={() => history.push(`/book/${book.book_id}`)}>
            <Image.Container>
              <Image alt={book.name} src={book.cover} />
            </Image.Container>
          </a>
        </Media.Item>
        <Media.Item align="content">
          <Content>
            <strong>{book.name}</strong>
            <br />
            <small>By: {book.author}</small>
            <br />
            <small>${(price || book.price) / 100}</small>
            <br />
            {quantity ? (
              <small>Quantity: {quantity}</small>
            ) : (
              <Ratings rating={book.rating} />
            )}
          </Content>
          <Tag
            as="a"
            onClick={() => history.push(`/books/${book.category}`)}
            color="primary"
          >
            {book.category}
          </Tag>
        </Media.Item>
        <Media.Item align="right">
          {inCart ? (
            <Button color="danger">
              <FaTimes />
            </Button>
          ) : (
            <Button>
              <FaCartPlus />
            </Button>
          )}
        </Media.Item>
      </Media>
    </Box>
  );
};

export default BookCard;
