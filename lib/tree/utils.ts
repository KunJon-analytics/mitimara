import { $Enums } from "@prisma/client";

export const getTreeStageColor = (treeStatus: $Enums.TreeStatus) => {
  switch (treeStatus) {
    case "PLANTED":
      return "default";
    case "LISTED":
      return "secondary";
    case "VERIFYING":
      return "outline";

    default:
      return "success";
  }
};

export const isTreeVerficationEnded = (treeStatus: $Enums.TreeStatus) => {
  return ["VERIFIED", "PLANTERS_PAID", "VERIFIERS_PAID", "MATURED"].includes(
    treeStatus
  );
};

export const getUIStatus = (treeStatus: $Enums.TreeStatus) => {
  return treeStatus.split("_").join(" ");
};
