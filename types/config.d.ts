export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    telegram: string;
  };
};

export type SubscriptionConfig = {
  userPointsPerPi: number;
  fee: number;
};

export type TreeLogicConfig = {
  maxNoOfTreeEvidences: number;
  maxNoOfTreeVerifications: number;
  minPlanterPoints: number;
  minVerifierPoints: number;
  maxVerifierDistance: number;
  planterRewardFactor: number;
  verifierRewardFactor: number;
};
