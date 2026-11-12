import { z } from "zod";

// NEXT_PUBLIC_ vars are inlined at build time, so the same values apply to static and dynamic pages.
// Only `pnpm run deploy` sets NEXT_PUBLIC_SITE_ENV=production; every other build is noindex.
export const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

// Canonicals, the sitemap and share images always use the production URL, including on previews.
function readSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) {
    if (isProduction) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is required for production builds. See .env.example.",
      );
    }
    return "http://localhost:3000";
  }
  return z.url().parse(value).replace(/\/$/, "");
}

export const siteUrl = readSiteUrl();

export const site = {
  name: "Example App",
  description: "Replace with one sentence on what the app does and for whom.",
  /** BCP 47 language tag for <html lang>. */
  locale: "en",
} as const;
