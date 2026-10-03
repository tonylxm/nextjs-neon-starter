import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

const validEnv = {
  DATABASE_URL: "postgres://postgres:postgres@localhost:5432/app",
  BETTER_AUTH_SECRET: "x".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
};

describe("parseEnv", () => {
  it("accepts a complete environment", () => {
    expect(parseEnv(validEnv).BETTER_AUTH_URL).toBe("http://localhost:3000");
  });

  it("names the missing variables", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("rejects a short auth secret", () => {
    expect(() =>
      parseEnv({ ...validEnv, BETTER_AUTH_SECRET: "short" }),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });
});
