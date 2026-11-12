import { expect, test } from "@playwright/test";

test("the health check answers signed-out requests without redirecting", async ({
  request,
}) => {
  const response = await request.get("/api/health", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
});
