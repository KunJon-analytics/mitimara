import { CUTOFF_VERIFICATIONS, treeLogicConfig } from "@/config/site";

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
