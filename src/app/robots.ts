import type { MetadataRoute } from "next";

const BASE_URL = "https://www.lepearleducation.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin-dashboard/",
          "/admin-login/",
          "/faculty-dashboard/",
          "/faculty-login/",
          "/student-dashboard/",
          "/login/",
          "/login-portal/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
