// Configuration read once from the environment. Required values fail fast at
// startup; optional ones switch individual features off instead.

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} is not set. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
};

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ?? "http://localhost:8080")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  IS_PRODUCTION: process.env.NODE_ENV === "production",

  DATABASE_URL: required("DATABASE_URL"),

  // Admin auth — see `npm run set-password`
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH ?? "",
  SESSION_SECRET: process.env.SESSION_SECRET ?? "",

  // AI drafts; without a key the admin pages still work in hand-written mode
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? "",
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-5.5",

  // Chat routing; without a key /api/route answers 503 and the frontend falls back
  TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY ?? "",
};
