"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { authenticate, type AuthFormState } from "./actions";

const INITIAL_STATE: AuthFormState = {};
const INPUT_CLASS =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AuthForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          className={INPUT_CLASS}
        />
      </label>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          name="intent"
          value="sign-in"
          disabled={isPending}
        >
          Sign in
        </Button>
        <Button
          type="submit"
          name="intent"
          value="sign-up"
          variant="outline"
          disabled={isPending}
        >
          Create account
        </Button>
      </div>
    </form>
  );
}
