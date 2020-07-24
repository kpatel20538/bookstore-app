const Koa = require("koa");
const Router = require("@koa/router");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const qs = require("qs");
const { AccessControl } = require("accesscontrol");

const Store = require(`./store/inmemory`);
const jwt = require("./jwt");
const sendMail = require("./email");
const fetch = require("node-fetch");

const app = new Koa();
const router = new Router();
const store = new Store();

const fetchClaims = async (subject) => {
  const claims = await store.get(subject);
  if (!claims) {    
    const defaultClaims = {roles: ["customer"]}
    await store.set(subject, defaultClaims);
    return defaultClaims;
  }
  return claims;
};

router.post("/auth/send", async (ctx) => {
  console.log(`SEND:EMAIL ${JSON.stringify(ctx.request.body)}`);
  const { email } = ctx.request.body;

  const token = jwt.signOtpToken({ subject: email });
  console.log(`SEND:TOKEN ${token}`);

  const href = `${process.env.HOSTNAME}/auth/verify?${qs.stringify({ token })}`;
  console.log(`SEND:HREF ${href}`);

  const response = await fetch(
    `https://api.elasticemail.com/v2/email/send?${qs.stringify({
      apikey: process.env.ELASTIC_API_KEY,
      from: process.env.STMP_FROM,
      to: email,
      subject: "Auth Link to Bookstore Toy",
      bodyText: `Auth link to Bookstore Toy ${href}`,
      bodyHtml: `Auth link to Bookstore Toy <a href='${href}'>${href}</a>`,
      isTransactional: true,
    })}`,
    { method: "POST" }
  );

  const info = await response.text();

  console.log(`SEND:MESSAGE ${info}`);
  ctx.body = { status: "OK" };
});

router.get("/auth/verify", async (ctx) => {
  try {
    const { token } = ctx.query;
    const { email: subject } = jwt.verifyOtpToken(token);

    console.log(`VEFIFICATION SUCCESSFUL: ${subject}`);
    const claims = await fetchClaims(subject);
    // TODO: Replace with authenication code
    const access_token = jwt.signAccessToken({ subject, ...claims });
    const uri = `${process.env.SUCCESS_REDIRECT}?${qs.stringify({
      access_token,
    })}`;
    console.log(uri);
    ctx.redirect(uri);
  } catch (err) {
    console.error(err);
    ctx.redirect(process.env.FAILED_REDIRECT);
  }
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8080);
