const { ApolloServer, gql } = require("apollo-server-koa");
const createServer = require("./router");
const AuthDirective = require("./auth-directive");
const jwt = require("./jwt");
/* 
    @auth(role: ADMIN, possession: ANY, attributes: ["*"])
    @auth(role: VISITOR, possession: ANY, attributes: ["title", "author"])
    @auth(role: CUSTOMER, possession: ANY, attributes: ["*", "!sales"])
    @auth(role: CUSTOMER, possession: OWN, attributes: ["*"]) */
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

  type Book
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
  }

  type User {
    loggedIn: Boolean
    roles: [String!]
    email: String
    subject: String
  }

  type Query {
    books: [Book]
    me: User
  }
`;

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    owner: "admin@bookstore.org",
    price: "$50.40",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
    owner: "gerad@bookstore.org",
    price: "$10.40",
  },
];

const resolvers = {
  Query: {
    books: (parent, args, context, info) => {
      return books;
    },
    me: (parent, args, context, info) => {
      return context.claims;
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
          loggedIn: false,
          email: null,
          roles: ["VISITOR"],
          subject: null,
        },
      };
    }

    return {
      claims: {
        loggedIn: true,
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
