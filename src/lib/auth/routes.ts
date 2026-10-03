export const LOGIN_PATH = "/login";
export const SIGNED_IN_PATH = "/account";

const PUBLIC_PATHS: readonly string[] = ["/", LOGIN_PATH];
const PUBLIC_PREFIXES: readonly string[] = ["/api/auth/"];

export function isPublicPath(pathname: string): boolean {
  const isListedPath = PUBLIC_PATHS.includes(pathname);
  const isUnderPublicPrefix = PUBLIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  return isListedPath || isUnderPublicPrefix;
}
