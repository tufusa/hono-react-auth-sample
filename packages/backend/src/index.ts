import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.get("/", (c) => {
  return c.json({ message: "react-hono-auth-sample/backend is up." });
});

export default app;
