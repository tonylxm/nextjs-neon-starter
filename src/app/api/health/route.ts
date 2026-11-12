// Liveness only: no database call, so a slow or cold Neon doesn't fail the deploy smoke check.
export function GET(): Response {
  return Response.json({ ok: true });
}
