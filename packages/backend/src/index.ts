import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { except } from "hono/combine";
import { setSignedCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { jwt, sign } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";

export type Bindings = {
  JWT_SECRET: string;
  COOKIE_KEY: string;
  COOKIE_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://hono-react-auth-sample.pages.dev",
    ],
  })
);
app.get(
  "/auth",
  basicAuth({
    username: "admin",
    password: "password",
  }),
  async (c) => {
    const token = await sign({}, c.env.JWT_SECRET);
    setSignedCookie(c, c.env.COOKIE_KEY, token, c.env.COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 5, // 5 min
      sameSite: "strict",
      prefix: "host",
    });
    return c.json({ message: "Authenticated" });
  }
);
app.use("*", except("/auth"), (c, next) =>
  jwt({
    secret: c.env.JWT_SECRET,
    cookie: {
      key: c.env.COOKIE_KEY,
      secret: c.env.COOKIE_SECRET,
      prefixOptions: "host",
    },
  })(c, next)
);

app.get("/", (c) => {
  return c.json({ data: "you are authenticated." });
});

export default app;
