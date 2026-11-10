import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

export function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    // Must stay last so server actions can set the session cookie.
    plugins: [nextCookies()],
  });
}

// Per request, like getDb: the instance holds a database client.
export const getAuth = cache(createAuth);
