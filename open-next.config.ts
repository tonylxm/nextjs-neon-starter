import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: every page here is dynamic. Add the R2 cache from the OpenNext docs once the app uses ISR.
export default defineCloudflareConfig({});
