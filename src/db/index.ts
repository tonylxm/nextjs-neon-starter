import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { cache } from "react";
import * as schema from "./schema";
import { databaseUrl } from "./url";

// Cloudflare Workers can't reuse a socket across requests, so each request gets its own pool, and
// maxUses: 1 closes every connection after one use instead of returning it for another request.
export const getDb = cache(() =>
  drizzle(new Pool({ connectionString: databaseUrl(), maxUses: 1 }), {
    schema,
  }),
);
