import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { getContentPosts } from "@/lib/content/utils";
import { CustomMDX } from "@/components/content/mdx";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "@/app/shared-metadata";
import { env } from "@/env.mjs";

type ContentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata | undefined> {
  const slug = (await params).slug;
  const contentPost = getContentPosts().find((post) => post.slug === slug);
  if (!contentPost) {
    return;
  }
  const {
    metadata: {
      title,
      summary: description,
      // publishedAt: publishedTime,
      image,
    },
  } = contentPost;

  const ogImage = `${env.NEXT_PUBLIC_APP_URL}/api/og?title=${encodeURIComponent(
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
      // type: "website",
      // publishedTime,
      url: `${env.NEXT_PUBLIC_APP_URL}/${slug}`,
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
  const contentPost = getContentPosts().find((post) => post.slug === slug);

  if (!contentPost) {
    notFound();
  }

  return <CustomMDX source={contentPost.content} />;
}

export async function generateStaticParams() {
  const contentPosts = getContentPosts();

  return contentPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;
