import { afterEach, describe, expect, it, vi } from "vitest";

async function loadRobots() {
  vi.resetModules();
  return (await import("./robots")).default();
}

afterEach(() => vi.unstubAllEnvs());

describe("robots", () => {
  it("blocks crawlers outside production", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "preview");
    expect(await loadRobots()).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("allows crawlers and lists the sitemap in production", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(await loadRobots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://example.com/sitemap.xml",
    });
  });

  it("fails a production build without a site URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    await expect(loadRobots()).rejects.toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
