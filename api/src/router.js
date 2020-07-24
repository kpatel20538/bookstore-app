
const Koa = require("koa");
const Router = require("@koa/router");

module.exports = (server) => {
  const app = new Koa();
  const router = new Router();
  router.all("/graphql", server.getMiddleware());
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

