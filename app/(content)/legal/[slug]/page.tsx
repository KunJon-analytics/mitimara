import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { getLegalPosts } from "@/lib/content/utils";
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
  const legalPosts = getLegalPosts().find((post) => post.slug === slug);
  if (!legalPosts) {
    return;
  }
  const {
    metadata: {
      title,
      summary: description,
      // publishedAt: publishedTime,
      image,
    },
  } = legalPosts;

  const ogImage = `${env.NEXT_PUBLIC_APP_URL}/api/og?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}&image=${
    image ? image : "assets/og/legal.png"
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
      url: `${env.NEXT_PUBLIC_APP_URL}/legal/${slug}`,
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
  const legalPosts = getLegalPosts().find((post) => post.slug === slug);

  if (!legalPosts) {
    notFound();
  }

  return <CustomMDX source={legalPosts.content} />;
}

export async function generateStaticParams() {
  const legalPosts = getLegalPosts();

  return legalPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;
