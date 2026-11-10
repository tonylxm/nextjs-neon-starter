import { getCloudflareContext } from "@opennextjs/cloudflare";

// On Workers, connect through the Hyperdrive binding (pooled near Neon). Under plain Node
// (`next dev`, `next start`, tests) there is no Cloudflare context, so use DATABASE_URL.
export function databaseUrl(): string | undefined {
  try {
    const hyperdrive = getCloudflareContext().env.HYPERDRIVE;
    if (hyperdrive) return hyperdrive.connectionString;
  } catch {}
  return process.env.DATABASE_URL;
}
