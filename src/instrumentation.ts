import { parseEnv } from "@/lib/env";

// Runs once at server start, so a misconfigured deploy fails immediately instead of on first request.
export function register() {
  parseEnv(process.env);
}
