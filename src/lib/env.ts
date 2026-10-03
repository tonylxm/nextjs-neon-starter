import { z } from "zod";

const MIN_SECRET_LENGTH = 32;

const schema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(MIN_SECRET_LENGTH),
  BETTER_AUTH_URL: z.url(),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(
      `Invalid or missing environment variables: ${missing}. See .env.example.`,
    );
  }
  return result.data;
}
