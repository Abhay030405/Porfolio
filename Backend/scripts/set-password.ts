// Sets the admin password: writes its scrypt hash (never the password) to
// ADMIN_PASSWORD_HASH in .env, and a fresh SESSION_SECRET, which also logs
// out any existing session.
//
//   npm run set-password              prompts for the password
//   npm run set-password -- <pass>    takes it as an argument
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/auth.ts";

const ENV_FILE = new URL("../.env", import.meta.url);
const MIN_LENGTH = 12;

let password = process.argv[2] ?? "";
if (!password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  password = await rl.question("New admin password: ");
  rl.close();
}
if (password.length < MIN_LENGTH) {
  console.error(`Password must be at least ${MIN_LENGTH} characters.`);
  process.exit(1);
}

const values: Record<string, string> = {
  ADMIN_PASSWORD_HASH: await hashPassword(password),
  SESSION_SECRET: randomBytes(32).toString("base64url"),
};

let file = await readFile(ENV_FILE, "utf8").catch(() => "");
for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  // Function replacer: the hash contains "$", which a replacement string would treat as a pattern
  file = pattern.test(file) ? file.replace(pattern, () => line) : `${file.trimEnd()}\n${line}\n`;
}
await writeFile(ENV_FILE, file);
console.log("Admin password updated in .env. Restart the backend to apply it.");
