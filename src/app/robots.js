import { SITE_URL } from "../constants/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The login page has nothing to index and the admin UI is behind it.
      disallow: "/admin/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
