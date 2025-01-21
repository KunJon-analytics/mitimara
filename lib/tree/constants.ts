import { ValidIcon } from "@/components/common/icons";

export type TreeStageName =
  | "Planted"
  | "Listed"
  | "Verifying"
  | "Verified"
  | "Rewarded";

export type TreeStageValues = {
  icon: ValidIcon;
  description: string;
  nextStep: string;
};

export type TreeStages = Record<TreeStageName, TreeStageValues>;

export const mitimaraTreeStages: TreeStages = {
  Planted: {
    description: "The tree is recently planted but not yet shown to verifiers.",
    icon: "sprout",
    nextStep:
      "Add evidence (photos and geolocation) to list the tree for verification.",
  },
  Listed: {
    description:
      "Tree evidence is added by the planter, so it gets listed for potential verifiers.",
    nextStep: "Verifiers need to start reviewing the tree submission.",
    icon: "globe",
  },
  Verifying: {
    description:
      "Tree verification has started as one verifier has already submitted a verification.",
    nextStep: "Encourage more verifiers to review and verify the tree.",
    icon: "shield-question",
  },
  Verified: {
    description: "The tree is fully verified as the majority vote is reached.",
    nextStep:
      "Process the reward payment for both the planter and the verifiers.",
    icon: "privacy",
  },
  Rewarded: {
    description:
      "The tree reward is paid out to both the planter and the verifiers. The cycle is complete!",
    nextStep: "",
    icon: "coins",
  },
};
