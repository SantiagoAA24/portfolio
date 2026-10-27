import { getSiteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*/styleguide"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
