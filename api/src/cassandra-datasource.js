const { Client } = require("cassandra-driver");

const client = new Client({
  cloud: {
    secureConnectBundle: "/etc/secret/cassandra_secure_connect",
  },
  credentials: {
    username: process.env.CASSANDRA_USERNAME,
    password: process.env.CASSANDRA_PASSWORD,
  },
});

client.connect();

const toConnection = async (results, {offset, limit}) => {
  const items = [];
  for await (const item of results) {
    items.push(item);
  }
  
  return {
    items: items.slice(offset, offset + limit),
    offset: offset + limit < items.length ? offset + limit : null,
  };
};

const deleteCartItem = async ({ customer_id, book_id }) => {
  console.log("deleteCartItem", { customer_id, book_id });
  const query =
    "DELETE FROM bookstore.carts_by_customer WHERE customer_id=? AND book_id=?;";
  await client.execute(query, [customer_id, book_id], {
    prepare: true,
  });
};
const insertCartItem = async ({ customer_id, book_id, price, quantity }) => {
  console.log("insertCartItem", { customer_id, book_id, price, quantity });
  const query =
    "INSERT INTO bookstore.carts_by_customer (customer_id, book_id, price, quantity) VALUES (?, ?, ?, ?);";
  await client.execute(query, [customer_id, book_id, price, quantity], {
    prepare: true,
  });
};
const insertOrder = async ({ customer_id, order_id, books, orderDate }) => {
  console.log("insertOrder", { customer_id, order_id, books, orderDate });
  const query =
    "INSERT INTO bookstore.orders_by_customer (customer_id, order_id, books, orderDate) VALUES (?, ?, ?, ?);";
  await client.execute(query, [customer_id, order_id, books, orderDate], {
    prepare: true,
  });
};
const selectBook = async ({ book_id }) => {
  console.log("selectBook", { book_id });
  const query = "SELECT * FROM bookstore.books_by_id WHERE book_id=?;";
  const results = await client.execute(query, [book_id], { prepare: true });

  const item = results.first();
  console.log("selectBook", item);
  return item;
};
const selectBooks = async ({ offset = 0, limit = 10 }) => {
  console.log("selectBooks", { offset, limit });
  const query = "SELECT * FROM bookstore.books_by_id;";
  const results = await client.execute(query);

  const connection = await toConnection(results, { offset, limit })
  console.log("selectBooks", connection);
  return connection;
};
const selectBooksByCategory = async ({ category, offset = 0, limit = 10 }) => {
  console.log("selectBooksByCategory", { category, offset, limit });
  const query =
    "SELECT * FROM bookstore.books_by_category WHERE category=?;";
  const results = await client.execute(query, [category], {
    prepare: true,
  });

  const connection = await toConnection(results, { offset, limit })
  console.log("selectBooksByCategory", connection);
  return connection;
};
const selectCart = async ({ customer_id, offset = 0, limit = 10 }) => {
  console.log("selectCart", { customer_id, offset, limit });
  const query =
    "SELECT * FROM bookstore.carts_by_customer WHERE customer_id=?;";
  const results = await client.execute(query, [customer_id], {
    prepare: true,
  });

  const connection = await toConnection(results, { offset, limit });
  console.log("selectCart", connection);
  return connection;
};
const selectCartItem = async ({ customer_id, book_id }) => {
  console.log("selectCartItem", { customer_id, book_id });
  const query =
    "SELECT * FROM bookstore.carts_by_customer WHERE customer_id=? AND book_id=?;";
  const results = await client.execute(query, [customer_id, book_id], {
    prepare: true,
  });

  const item = results.first();
  console.log("selectCartItem", item);
  return item;
};
const selectOrder = async ({ customer_id, order_id }) => {
  console.log("selectOrder", { customer_id, order_id });
  const query =
    "SELECT * FROM bookstore.orders_by_customer WHERE customer_id=? AND order_id=?;";
  const results = await client.execute(query, [customer_id, order_id], {
    prepare: true,
  });

  const item = results.first();
  console.log("selectOrder", item);
  return item;
};
const selectOrders = async ({ customer_id, offset = 0, limit = 10 }) => {
  console.log("selectOrders", { customer_id, offset, limit });
  const query =
    "SELECT * FROM bookstore.orders_by_customer WHERE customer_id=?;";
  const results = await client.execute(query, [customer_id], {
    prepare: true,
  });

  const connection = await toConnection(results, { offset, limit });
  console.log("selectOrders", connection);
  return connection;
};
const updateCartItem = async ({ customer_id, book_id, quantity }) => {
  console.log("updateCartItem", { customer_id, book_id, quantity });
  const query =
    "UPDATE bookstore.carts_by_customer SET quantity=? WHERE customer_id=? AND book_id=?;";
  await client.execute(query, [quantity, customer_id, book_id], {
    prepare: true,
  });
};

module.exports = {
  deleteCartItem,
  insertCartItem,
  insertOrder,
  selectBook,
  selectBooks,
  selectBooksByCategory,
  selectCart,
  selectCartItem,
  selectOrder,
  selectOrders,
  updateCartItem,
};
