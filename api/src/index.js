const { ApolloServer, gql } = require("apollo-server-koa");
const Koa = require("koa");
const Router = require("@koa/router");
const AuthDirective = require("./auth-directive");
const jwt = require("./jwt");

const typeDefs = gql`
  directive @auth(roles: [Role!]!, possession: Possession!) on FIELD_DEFINITION
  enum Role {
    admin
    customer
  }
  enum Possession {
    own
    any
  }

  type Book {
    title: String
    author: String
    price: String @auth(roles: [customer], possession: any)
    sales: String @auth(roles: [customer], possession: own)
    reports: Int @auth(roles: [admin], possession: any)
  }

  type User {
    loggedIn: Boolean
    roles: [String!]
    email: String
  }

  type Query {
    books: [Book]
    me: User
  }
`;

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    owner: "J.K. Rowling",
    price: "$50.40",
    sales: "23M",
    reports: 34,
  },
  {
    title: "Jurassic Park",
    owner: "Michael Crichton",
    price: "$10.40",
    sales: "43M",
    reports: 3,
  },
];

const resolvers = {
  Query: {
    books: (parent, args, context, info) => {
      return books;
    },
    me: (parent, args, context, info) => {
      console.log(context)
      return {
        loggedIn: context.claims !== null,
        email: context.claims ? context.claims.email : null,
        roles: context.claims ? context.claims.roles : [],
        owner: context.claims ? context.claims.sub : null,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => {
    const [, token = ""] = (ctx.get("authorization") || "").split(" ");
    return {
      claims: jwt.verifyAccessToken(token),
    };
  },
  schemaDirectives: {
    auth: AuthDirective,
  },
});

const app = new Koa();
const router = new Router();
router.all("/graphql", server.getMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8080 }, () => {
  console.log(`🚀 Server ready at http://localhost:8080/graphql`);
});
