import type { MetadataRoute } from "next";

import { env } from "@/env.mjs";
import {
  getBlogPosts,
  getContentPosts,
  getLegalPosts,
} from "@/lib/content/utils";

const addPathToBaseURL = (path: string) => `${env.NEXT_PUBLIC_APP_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getBlogPosts().map((post) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const legalPosts = getLegalPosts().map((post) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/legal/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const contentPosts = getContentPosts().map((post) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const routes = [
    "/",
    "/about",
    "/roadmap",
    "/app/invite",
    "/blog",
    "/revenue-pots",
  ].map((route) => ({
    url: addPathToBaseURL(route),
    lastModified: new Date(),
  }));

  return [...routes, ...blogs, ...legalPosts, ...contentPosts];
}
