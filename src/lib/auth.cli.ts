import { createAuth } from "./auth";

// Only for `auth generate`, which needs an exported `auth`. App code uses getAuth() so nothing holds a client across requests.
export const auth = createAuth();
