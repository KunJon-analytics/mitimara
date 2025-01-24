import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { getBlogPosts } from "@/lib/content/utils";
import { CustomMDX } from "@/components/content/mdx";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "@/app/shared-metadata";
import { env } from "@/env.mjs";
import { blogComponents } from "@/content/blog/snippets";
import { BackButton } from "@/components/content/back-button";

type ContentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata | undefined> {
  const slug = (await params).slug;
  const blogPosts = getBlogPosts().find((post) => post.slug === slug);
  if (!blogPosts) {
    return;
  }
  const {
    metadata: {
      title,
      summary: description,
      publishedAt: publishedTime,
      image,
    },
  } = blogPosts;

  const ogImage = `${
    env.NEXT_PUBLIC_APP_URL
  }/api/og/post?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}&image=${
    image ? image : ""
  }`;

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...ogMetadata,
      title,
      description,
      type: "article",
      publishedTime,
      url: `${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const slug = (await params).slug;
  const blogPosts = getBlogPosts().find((post) => post.slug === slug);

  if (!blogPosts) {
    notFound();
  }

  return (
    <>
      <BackButton href="/blog" />
      <CustomMDX source={blogPosts.content} components={blogComponents} />
    </>
  );
}

export async function generateStaticParams() {
  const blogPosts = getBlogPosts();

  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;
