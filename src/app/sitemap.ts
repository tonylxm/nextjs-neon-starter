import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Public, indexable pages only. Login and signed-in pages stay out (they are noindex).
// Each URL must equal that page's canonical, and Next renders the home canonical without a trailing slash.
const PUBLIC_ROUTES = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
  }));
}
