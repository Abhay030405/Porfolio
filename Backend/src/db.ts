import { neon } from "@neondatabase/serverless";
import { env } from "./env.ts";

// Neon's HTTP driver: one round trip per query, no pool to manage.
// Use as a tagged template — values are always sent as parameters.
export const sql = neon(env.DATABASE_URL);
