import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuth } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { signOut } from "../login/actions";

// The proxy's redirect is only an optimistic check, so pages that show user data verify again.
export default async function AccountPage(): Promise<React.JSX.Element> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) {
    redirect(LOGIN_PATH);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-4 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="text-muted-foreground">Signed in as {session.user.email}</p>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
