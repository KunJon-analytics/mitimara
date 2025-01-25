import { ValidIcon } from "@/components/common/icons";
import { $Enums } from "@prisma/client";

export const verificationNotStartedStatus: $Enums.TreeStatus[] = [
  "PLANTED",
  "LISTED",
];

export type TreeStageValues = {
  icon: ValidIcon;
  description: string;
  nextStep: string;
};

export type TreeStages = Record<$Enums.TreeStatus, TreeStageValues>;

type StatusElements = {
  icon: ValidIcon;
  badgeVariant: "success" | "destructive" | "outline";
};

type TreeVerificationStatus = "N/A" | "REAL" | "FAKE";

export const treeVerifications: Record<TreeVerificationStatus, StatusElements> =
  {
    "N/A": { badgeVariant: "outline", icon: "shield" },
    FAKE: { badgeVariant: "destructive", icon: "fake" },
    REAL: { badgeVariant: "success", icon: "privacy" },
  };

export const mitimaraTreeStages: TreeStages = {
  PLANTED: {
    description: "The tree is recently planted but not yet shown to verifiers.",
    icon: "sprout",
    nextStep:
      "Add evidence (photos and geolocation) to list the tree for verification.",
  },
  LISTED: {
    description:
      "Tree evidence is added by the planter, so it gets listed for potential verifiers.",
    nextStep: "Verifiers need to start reviewing the tree submission.",
    icon: "globe",
  },
  VERIFYING: {
    description:
      "Tree verification has started as one verifier has already submitted a verification.",
    nextStep: "Encourage more verifiers to review and verify the tree.",
    icon: "shield-question",
  },
  VERIFIED: {
    description: "The tree is fully verified as the majority vote is reached.",
    nextStep: "Process the reward payment for the tree planter.",
    icon: "privacy",
  },
  PLANTERS_PAID: {
    description: "The tree planter reward is paid out if tree is authentic.",
    nextStep: "Payment for verifiers need to go out",
    icon: "coins",
  },
  VERIFIERS_PAID: {
    description: "The tree verifiers reward is paid out.",
    nextStep: "Complete the tree cycle",
    icon: "coins",
  },
  MATURED: {
    description: "The tree cycle is complete!",
    nextStep: "",
    icon: "coins",
  },
};
