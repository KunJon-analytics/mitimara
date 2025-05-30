import { env } from "@/env.mjs";
import {
  LocalBountyLogicConfig,
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
  admin: { email: "kunjonng@gmail.com", name: "KunJon" },
  links: {
    twitter: "https://x.com/MitimaraPi",
    github: "https://github.com/KunJon-analytics/mitimara",
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
  planterRewardFactor: 6,
  verifierRewardFactor: 2,
};

export const localBountyLogicConfig: LocalBountyLogicConfig = {
  minCreatorPoints: 5,
  tax: 10 / 100,
};

export const STARTER_POINTS = 10;

export const MONTHS_BEFORE_TREES_ARCHIVE = 3;

export const MIN_POLICING_POINTS = 1;

export const POLICING_REWARDS = 2 * MIN_POLICING_POINTS;

export const REWARD_COOLDOWN_DAYS = 28;

export const TREE_RECOMMENDATION_COST = 2;

export const CUTOFF_VERIFICATIONS = Math.ceil(
  treeLogicConfig.maxNoOfTreeVerifications / 2
);

export const MIN_EXCHANGE_POINTS =
  subscriptionConfig.userPointsPerPi + STARTER_POINTS;
