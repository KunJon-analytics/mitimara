import { env } from "@/env.mjs";
import { DonationConfig, SiteConfig, TreeLogicConfig } from "@/types/config";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "GreenPi",
  description:
    "AI-powered investments with secure and seamless trading across multiple blockchain networks.",
  url: baseUrl,
  ogImage: `${baseUrl}/og.jpg`,
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/taxonomy",
  },
};

export const donationConfig: DonationConfig = {
  userPointsPerPi: 5,
};

export const treeLogicConfig: TreeLogicConfig = {
  maxNoOfTreeEvidences: 2,
  minPlanterPoints: 3,
};
