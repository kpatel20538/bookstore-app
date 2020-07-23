const { ApolloServer, gql } = require("apollo-server-koa");
const Koa = require("koa");
const Router = require("@koa/router");

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {};
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