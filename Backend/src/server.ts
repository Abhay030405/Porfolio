import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./env.ts";
import { authRoutes } from "./auth.ts";
import { chatRoute } from "./routes/chat.ts";
import { portfolioRoute } from "./routes/portfolio.ts";
import { adminRoute } from "./routes/admin.ts";

const app = new Hono();

app.use("*", secureHeaders());
app.use(
  "/api/*",
  cors({
    origin: (origin) => (env.ALLOWED_ORIGINS.includes(origin) ? origin : null),
    // The admin session cookie rides on cross-origin requests from the site
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 600,
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/api/chat", chatRoute);
app.route("/api/portfolio", portfolioRoute);
app.route("/api/auth", authRoutes);
app.route("/api/admin", adminRoute);

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
  console.error(`[${c.req.method} ${c.req.path}]`, err);
  return c.json({ error: "Internal error" }, 500);
});

if (!env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
  console.warn("Admin login disabled: run `npm run set-password` to enable it.");
}

serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
  console.log(`Backend listening on http://localhost:${port}`);
});
