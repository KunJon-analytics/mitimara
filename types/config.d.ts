export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DonationConfig = {
  userPointsPerPi: number;
};

export type TreeLogicConfig = {
  maxNoOfTreeEvidences: number;
  minPlanterPoints: number;
  minVerifierPoints: number;
  maxVerifierDistance: number;
};
