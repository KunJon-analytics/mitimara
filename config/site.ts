import { env } from "@/env.mjs";
import {
  SiteConfig,
  SubscriptionConfig,
  TreeLogicConfig,
} from "@/types/config";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "MitiMara",
  description:
    "MitiMara is a decentralized platform that incentivizes tree planting and verification through Pi token rewards. Join our community to plant trees, earn rewards, and contribute to global reforestation efforts. Together, we can make the world a greener place, one tree at a time. 🌳🌍",
  url: baseUrl,
  ogImage: `${baseUrl}/og.jpg`,
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/taxonomy",
    telegram: "https://github.com/shadcn/taxonomy",
  },
};

export const subscriptionConfig: SubscriptionConfig = {
  userPointsPerPi: 100,
  fee: 1,
};

export const treeLogicConfig: TreeLogicConfig = {
  maxNoOfTreeEvidences: 2,
  maxNoOfTreeVerifications: 3,
  maxVerifierDistance: 2,
  minPlanterPoints: 5,
  minVerifierPoints: 3,
  planterRewardFactor: 3,
  verifierRewardFactor: 2,
};

export const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const CUTOFF_VERIFICATIONS = Math.ceil(
  treeLogicConfig.maxNoOfTreeVerifications / 2
);
