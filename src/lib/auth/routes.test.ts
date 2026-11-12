import { describe, expect, it } from "vitest";
import { isPublicPath } from "./routes";

describe("isPublicPath", () => {
  it("allows the home, login and auth API routes", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/api/auth/sign-in/email")).toBe(true);
  });

  it("allows the files crawlers and link previews fetch", () => {
    expect(isPublicPath("/robots.txt")).toBe(true);
    expect(isPublicPath("/sitemap.xml")).toBe(true);
    expect(isPublicPath("/opengraph-image")).toBe(true);
    expect(isPublicPath("/twitter-image")).toBe(true);
  });

  it("allows the health check the deploy smoke test fetches", () => {
    expect(isPublicPath("/api/health")).toBe(true);
  });

  it("protects everything else by default", () => {
    expect(isPublicPath("/account")).toBe(false);
    expect(isPublicPath("/login-help")).toBe(false);
    expect(isPublicPath("/api/authors")).toBe(false);
  });
});
