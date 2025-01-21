import RSS from "rss";

import { siteConfig } from "@/config/site";
import { getBlogPosts } from "@/lib/content/utils";

export async function GET() {
  const feed = new RSS({
    title: siteConfig.name,
    description: `${siteConfig.name} blog feed"`,
    generator: "RSS for Node and Next.js",
    feed_url: `${siteConfig.url}/blog/feed.xml`,
    site_url: `${siteConfig.url}`,
    managingEditor: `${siteConfig.admin.email} (${siteConfig.name} Team)`,
    webMaster: `${siteConfig.admin.email} (${siteConfig.name} Team)`,
    copyright: `Copyright ${new Date().getFullYear().toString()}, ${
      siteConfig.name
    }`,
    language: "en-US",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .map((post) => {
      feed.item({
        title: post.metadata.title,
        description: post.metadata.summary,
        url: `${siteConfig.url}/blog/${post.slug}`,
        author: siteConfig.admin.name,
        date: post.metadata.publishedAt,
      });
    });
  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
