import type { Metadata } from "next";

import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "@/app/shared-metadata";
import Pots from "./_components/pots";
import CTA from "./_components/cta";

const title = "Revenue Pots 🪙";
const description =
  "Explore how MitiMara shares revenue from Pi donations, subscriptions, and future initiatives to support tree planting and verification. 🌿";

export const revalidate = 7200;

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  description,
  twitter: {
    ...twitterMetadata,
    title,
    description,
    images: [`/api/og?title=${title}&description=${description}`],
  },
  openGraph: {
    ...ogMetadata,
    title,
    description,
    images: [`/api/og?title=${title}&description=${description}`],
  },
};

export default async function PlayPage() {
  return (
    <div className="grid w-full gap-12">
      <Pots />
      <CTA className="mx-auto max-w-2xl lg:max-w-4xl" />
    </div>
  );
}
