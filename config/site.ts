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
    "Join MitiMara, the decentralized platform that rewards tree planting and verification with Pi tokens. Promote sustainability, boost environmental efforts, and earn rewards. 🌳🌱",
  url: baseUrl,
  ogImage: `${baseUrl}/og.jpg`,
  links: {
    twitter: "https://x.com/MitimaraPi",
    github: "https://github.com/shadcn/taxonomy",
    telegram: "https://t.me/mitimara_pi",
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
