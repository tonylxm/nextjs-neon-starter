import { describe, expect, it } from "vitest";
import { isPublicPath } from "./routes";

describe("isPublicPath", () => {
  it("allows the home, login and auth API routes", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/api/auth/sign-in/email")).toBe(true);
  });

  it("protects everything else by default", () => {
    expect(isPublicPath("/account")).toBe(false);
    expect(isPublicPath("/login-help")).toBe(false);
    expect(isPublicPath("/api/authors")).toBe(false);
  });
});
