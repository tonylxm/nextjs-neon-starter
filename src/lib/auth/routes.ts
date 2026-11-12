export const LOGIN_PATH = "/login";
export const SIGNED_IN_PATH = "/account";

// Crawlers and link previews fetch these without a session, so they must not redirect to login.
const CRAWLER_PATHS: readonly string[] = [
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
  "/twitter-image",
];

// The deploy job's smoke check; a redirect to login would pass `curl -f` without reaching the app.
const HEALTH_PATH = "/api/health";

const PUBLIC_PATHS: readonly string[] = [
  "/",
  LOGIN_PATH,
  HEALTH_PATH,
  ...CRAWLER_PATHS,
];
const PUBLIC_PREFIXES: readonly string[] = ["/api/auth/"];

export function isPublicPath(pathname: string): boolean {
  const isListedPath = PUBLIC_PATHS.includes(pathname);
  const isUnderPublicPrefix = PUBLIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  return isListedPath || isUnderPublicPrefix;
}
