import type { MetadataRoute } from "next";

import { env } from "@/env.mjs";
import { allPosts } from "@/lib/blogs";

const addPathToBaseURL = (path: string) => `${env.NEXT_PUBLIC_APP_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allPosts.map((post) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt, // date format should be YYYY-MM-DD
  }));

  const routes = [
    "/",
    "/about",
    "/roadmap",
    "/invite",
    "/app/login",
    "/legal/privacy",
    "/legal/terms",
  ].map((route) => ({
    url: addPathToBaseURL(route),
    lastModified: new Date(),
  }));

  return [...routes, ...blogs];
}
