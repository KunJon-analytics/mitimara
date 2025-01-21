import { CUTOFF_VERIFICATIONS, treeLogicConfig } from "@/config/site";
import { TreeStageName } from "./constants";

type Tree = {
  id: string;
  verifications: {
    treeIsAuthentic: boolean;
  }[];
};

export const treeVerified = (selectedTree: Tree) => {
  // Check if the tree has reached the maximum number of verifications
  if (
    selectedTree.verifications.length >=
    treeLogicConfig.maxNoOfTreeVerifications
  ) {
    return true;
  }

  // Count the number of isAuthentic and notAuthentic verifications
  const authenticVerifications = selectedTree.verifications.filter(
    (v) => v.treeIsAuthentic
  ).length;

  const unauthenticVerifications =
    selectedTree.verifications.length - authenticVerifications;

  // Check if the tree has reached the cutoff for isAuthentic // not authentic verifications
  if (
    authenticVerifications >= CUTOFF_VERIFICATIONS ||
    unauthenticVerifications >= CUTOFF_VERIFICATIONS
  ) {
    return true;
  }

  return false;
};

type GetTreeStageParams = {
  rewardClaimed: boolean;
  dateVerified: Date | null;
  noOfMediaEvidence: number;
  noOfVerifications: number;
};

export const getTreeStage = (params: GetTreeStageParams): TreeStageName => {
  const { dateVerified, noOfMediaEvidence, noOfVerifications, rewardClaimed } =
    params;
  if (rewardClaimed) {
    return "Rewarded";
  }
  if (dateVerified) {
    return "Verified";
  }
  if (noOfVerifications > 0) {
    return "Verifying";
  }
  if (noOfMediaEvidence > 0) {
    return "Listed";
  }
  return "Planted";
};

export const getTreeStageColor = (stage: TreeStageName) => {
  switch (stage) {
    case "Listed":
      return "default";
    case "Planted":
      return "secondary";
    case "Rewarded":
      return "success";
    case "Verified":
      return "success";
    case "Verifying":
      return "default";
    default:
      return "outline";
  }
};
