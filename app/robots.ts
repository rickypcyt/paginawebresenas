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
          "/ofertas",
          "/negocios",
          "/como-funciona",
        ],
        disallow: [
          "/admin",
          "/dashboard",
          "/profile",
          "/favorites",
          "/home",
          "/explore",
          "/search",
          "/business-requests",
          "/businesses",
          "/visit",
          "/u/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
