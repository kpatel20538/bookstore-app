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
  }

  type BookConnection {
    items: [Book]
    offset: Int
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
    items: [Order]
    offset: Int
  }

  type CartItem {
    book: Book
    price: Int
    quantity: Int
  }

  type CartConnection {
    items: [CartItem]
    offset: Int
  }

  type User {
    logged_in: Boolean
    roles: [String]
    email: String
    subject: String
  }

  type Query {
    books(category: String, offset: Int, limit: Int): BookConnection
    book(book_id: ID!): Book
    cart(offset: Int, limit: Int): CartConnection
    orders(offset: Int, limit: Int): OrderConnection
    order(order_id: ID!): Order
    me: User
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
    books: (parent, args, context, info) => {
      if (args.category) {
        return selectBooksByCategory(args);
      } else {
        return selectBooks(args);
      }
    },
    book: (parent, args, context, info) => {
      return selectBook(args);
    },
    cart: (parent, args, context, info) => {
      return selectCart({
        customer_id: context.claims.subject,
        ...args,
      });
    },
    orders: async (parent, args, context, info) => {
      return selectOrders({
        customer_id: context.claims.subject,
        ...args,
      });
    },
    order: (parent, args, context, info) => {
      return selectOrder({
        customer_id: context.claims.subject,
        order_id: args.order_id,
      });
    },
    me: (parent, args, context, info) => {
      return context.claims;
    },
  },
  BookDetail: {
    book: (parent, args, context, info) => {
      return selectBook(parent);
    },
  },
  CartItem: {
    book: (parent, args, context, info) => {
      return selectBook(parent);
    },
  },
  Mutation: {
    addToCart: async (parent, args, context, info) => {
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
    removeFromCart: async ({ parent, args, context, info }) => {
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
    updateCartItem: async (parent, args, context, info) => {
      const cartItem = selectCartItem({
        customer_id: context.claims.subject,
        book_id: args.book_id,
      });
      await updateCartItem({
        customer_id: context.claims.subject,
        book_id: args.input.book_id,
        price: book.price,
        quantity: args.input.quantity || 1,
      });
      return {
        book_id: args.book_id,
        price: cartItem.price,
        quantity: args.input.quantity || 1,
      };
    },
    checkout: async (parent, args, context, info) => {
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
