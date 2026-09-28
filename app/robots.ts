import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/business",
          "/categoria",
          "/ciudad",
          "/negocios",
        ],
        disallow: [
          "/admin",
          "/dashboard",
          "/profile",
          "/",
          "/search",
          "/business-requests",
          "/businesses",
          "/nfc",
          "/visit",
          "/u/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
