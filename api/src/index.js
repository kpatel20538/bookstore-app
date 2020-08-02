const { ApolloServer, gql } = require("apollo-server-koa");
const createServer = require("./router");
const AuthDirective = require("./auth-directive");
const { v4: uuid } = require("uuid");
const {
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
} = require("./cassandra-datasource");
const { searchBooks } = require("./elasticsearch-datasoruce");
const {
  getBooksFromAuthor,
  getBooksFromCustomersOfAuthor,
  getPersonalBooks,
} = require("./neo4j-datasource");
const jwt = require("./jwt");

/* type Book
    @auth(
      rules: [
        { role: ADMIN, possession: ANY, attributes: ["*"] }
        { role: VISITOR, possession: ANY, attributes: ["title", "author"] }
        { role: CUSTOMER, possession: ANY, attributes: ["price"] }
        { role: CUSTOMER, possession: OWN, attributes: ["*"] }
      ]
    ) {
    title: String
    author: String
    owner: String
    price: String
  } */

const typeDefs = gql`
  directive @auth(rules: [AuthRule!]!) on OBJECT
  input AuthRule {
    role: Role
    possession: Possession!
    attributes: [String!]!
  }

  enum Role {
    ADMIN
    CUSTOMER
    VISITOR
  }
  enum Possession {
    OWN
    ANY
  }

  type Book {
    book_id: ID!
    author: String
    category: String
    cover: String
    name: String
    price: Int
    rating: Float
    recommendationsFromAuthor: [Book]
    recommendationsFromCustomers: [Book]
  }

  type BookConnection {
    rows: [Book]
    pageState: String
  }

  type BookDetail {
    book: Book
    quantity: Int
    price: Int
  }

  type Order {
    order_id: ID!
    books: [BookDetail]
    order_date: String
  }

  type OrderConnection {
    rows: [Order]
    pageState: String
  }

  type CartItem {
    book: Book
    price: Int
    quantity: Int
  }

  type CartConnection {
    rows: [CartItem]
    pageState: String
  }

  type User {
    logged_in: Boolean
    roles: [String]
    email: String
    subject: String
  }

  scalar Key
  type Bucket {
    key: Key
    doc_count: Int
  }

  type BookSearch {
    results: [Book]
    price_ranges: [Bucket]
    rating_ranges: [Bucket]
    categories: [Bucket]
  }

  type Query {
    books(category: String, pageState: String, fetchSize: Int): BookConnection
    search(query: String, category: String): BookSearch
    book(book_id: ID!): Book
    cart(pageState: String, fetchSize: Int): CartConnection
    orders(pageState: String, fetchSize: Int): OrderConnection
    order(order_id: ID!): Order
    me: User
    recommendationsFromPurchases(email: String!): [Book]
  }

  input CartItemInput {
    book_id: ID!
    quantity: Int
  }

  type Mutation {
    addToCart(input: CartItemInput!): CartItem
    removeFromCart(book_id: ID!): CartItem
    updateCartItem(input: CartItemInput!): CartItem
    checkout: Order
  }
`;

const resolvers = {
  Query: {
    books: (parent, args) => {
      if (args.category) {
        return selectBooksByCategory(args);
      }
      return selectBooks(args);
    },
    book: (parent, args) => {
      return selectBook(args);
    },
    cart: (parent, args, context) => {
      return selectCart({
        customer_id: context.claims.subject,
        ...args,
      });
    },
    orders: async (parent, args, context) => {
      return selectOrders({
        customer_id: context.claims.subject,
        ...args,
      });
    },
    order: (parent, args, context) => {
      return selectOrder({
        customer_id: context.claims.subject,
        order_id: args.order_id,
      });
    },
    search: (parent, args) => {
      return searchBooks(args);
    },
    me: (parent, args, context) => {
      return context.claims;
    },
    recommendationsFromPurchases: (parent, args) => {
      return getPersonalBooks(args);
    },
  },
  Book: {
    recommendationsFromAuthor: (parent) => {
      return getBooksFromAuthor(parent);
    },
    recommendationsFromCustomers: (parent) => {
      return getBooksFromCustomersOfAuthor(parent);
    },
  },
  BookDetail: {
    book: (parent) => {
      return selectBook(parent);
    },
  },
  CartItem: {
    book: (parent) => {
      return selectBook(parent);
    },
  },
  Mutation: {
    addToCart: async (parent, args, context) => {
      const book = selectBook({ book_id: args.input.book_id });
      await insertCartItem({
        customer_id: context.claims.subject,
        book_id: args.input.book_id,
        price: book.price,
        quantity: args.input.quantity || 1,
      });
      return {
        book_id: args.input.book_id,
        price: book.price,
        quantity: args.input.quantity || 1,
      };
    },
    removeFromCart: async (parent, args, context) => {
      const cartItem = selectCartItem({
        customer_id: context.claims.subject,
        book_id: args.book_id,
      });
      await deleteCartItem({
        customer_id: context.claims.subject,
        book_id: args.book_id,
      });
      return {
        book_id: args.book_id,
        price: cartItem.price,
        quantity: cartItem.quantity || 1,
      };
    },
    updateCartItem: async (parent, args, context) => {
      const cartItem = selectCartItem({
        customer_id: context.claims.subject,
        book_id: args.book_id,
      });
      await updateCartItem({
        customer_id: context.claims.subject,
        book_id: args.input.book_id,
        price: cartItem.price,
        quantity: args.input.quantity || 1,
      });
      return {
        book_id: args.book_id,
        price: cartItem.price,
        quantity: args.input.quantity || 1,
      };
    },
    checkout: async (parent, args, context) => {
      const cart = await selectCart({
        customer_id: context.claims.subject,
      });
      const books = cart.map(({ book_id, quantity, price }) => ({
        book_id,
        quantity,
        price,
      }));
      return insertOrder({
        customer_id: context.claims.subject,
        order_id: uuid(),
        books,
        order_date: new Date(),
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ ctx }) => {
    const [, token = ""] = (ctx.get("authorization") || "").split(" ");
    const payload = jwt.verifyAccessToken(token);
    if (!payload) {
      return {
        claims: {
          logged_in: false,
          email: null,
          roles: ["VISITOR"],
          subject: null,
        },
      };
    }

    return {
      claims: {
        logged_in: true,
        email: payload.email,
        roles: ["VISITOR", ...payload.roles],
        subject: payload.sub,
      },
    };
  },
  schemaDirectives: {
    auth: AuthDirective,
  },
});

createServer(server).listen({ port: 8080 });
