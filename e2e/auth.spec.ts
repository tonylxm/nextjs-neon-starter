import { expect, test } from "@playwright/test";

test("protected pages redirect signed-out visitors to the login page", async ({
  page,
}) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
