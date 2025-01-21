import { Rss } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { toDate } from "date-fns";

import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "@/app/shared-metadata";
import { Timeline } from "@/components/content/timeline";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/content/utils";
import { Shell } from "@/components/common/shell";
import { siteConfig } from "@/config/site";

const ITEMS_PER_PAGE = 10;

export const revalidate = 36000;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Blog",
  openGraph: {
    ...ogMetadata,
    title: "Blog",
  },
  twitter: {
    ...twitterMetadata,
    title: "Blog",
  },
};

export default function Post() {
  const posts = getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, ITEMS_PER_PAGE);

  return (
    <Shell>
      <Timeline
        title="Blog"
        description={`All the latest articles and news from ${siteConfig.name}.`}
        actions={
          <Button variant="outline" size="icon" asChild>
            <a href="/blog/feed.xml" target="_blank" rel="noreferrer">
              <Rss className="h-4 w-4" />
              <span className="sr-only">RSS feed</span>
            </a>
          </Button>
        }
      >
        {posts.map((post) => (
          <Timeline.Article
            key={post.slug}
            publishedAt={toDate(post.metadata.publishedAt)}
            imageSrc={`/${post.metadata.image ?? "assets/og/blog/default.png"}`}
            title={post.metadata.title}
            href={`./blog/${post.slug}`}
          >
            <div className="prose dark:prose-invert">
              <p>{post.metadata.summary}</p>
            </div>
            <div>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href={`./blog/${post.slug}`}>Read more</Link>
              </Button>
            </div>
          </Timeline.Article>
        ))}
      </Timeline>
    </Shell>
  );
}
