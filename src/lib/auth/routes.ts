export const LOGIN_PATH = "/login";
export const SIGNED_IN_PATH = "/account";

// Crawlers and link previews fetch these without a session, so they must not redirect to login.
const CRAWLER_PATHS: readonly string[] = [
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
  "/twitter-image",
];

const PUBLIC_PATHS: readonly string[] = ["/", LOGIN_PATH, ...CRAWLER_PATHS];
const PUBLIC_PREFIXES: readonly string[] = ["/api/auth/"];

export function isPublicPath(pathname: string): boolean {
  const isListedPath = PUBLIC_PATHS.includes(pathname);
  const isUnderPublicPrefix = PUBLIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  return isListedPath || isUnderPublicPrefix;
}
