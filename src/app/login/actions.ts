"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { LOGIN_PATH, SIGNED_IN_PATH } from "@/lib/auth/routes";

const MIN_PASSWORD_LENGTH = 8;

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  intent: z.enum(["sign-in", "sign-up"]),
});

export interface AuthFormState {
  error?: string;
  // React resets the form after each action, so the typed email comes back to refill the field.
  email?: string;
}

export async function authenticate(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  const typedEmail = String(formData.get("email") ?? "");
  if (!parsed.success) {
    return {
      error: `Enter a valid email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
      email: typedEmail,
    };
  }

  const { email, password, intent } = parsed.data;
  try {
    if (intent === "sign-in") {
      await auth.api.signInEmail({ body: { email, password } });
    } else {
      // Better Auth requires a display name, so use the part before the @ until the app collects one.
      const name = email.split("@")[0];
      await auth.api.signUpEmail({ body: { email, password, name } });
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, email };
    }
    throw error;
  }
  redirect(SIGNED_IN_PATH);
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect(LOGIN_PATH);
}
