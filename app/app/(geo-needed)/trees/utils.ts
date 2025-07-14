import { TreeData } from "./services";

export const treeMarkerStatus = [
  "planted", // alias for all
  "verifying",
  "verified",
  "rejected",
] as const;

export type TreeMarkerStatus = (typeof treeMarkerStatus)[number];

export const getTreeMarkerStatus = (tree: TreeData): TreeMarkerStatus => {
  switch (tree.status) {
    case "MATURED":
      return tree.isAuthentic ? "verified" : "rejected"; // green
    case "LISTED":
      return "verifying"; // red
    case "VERIFYING":
      return "verifying"; // amber
    default:
      return "planted"; // gray
  }
};

export const getTreeMarkerColor = (treeMarkerStatus: TreeMarkerStatus) => {
  switch (treeMarkerStatus) {
    case "verified":
      return "#22c55e"; // green
    case "rejected":
      return "#ef4444"; // red
    case "verifying":
      return "#f59e0b"; // amber
    default:
      // return "#6b7280"; // gray
      return "#f59e0b"; // gray
  }
};

export const getStatusBadgeVariant = (status: TreeMarkerStatus) => {
  switch (status) {
    case "verified":
      return "success" as const;
    case "rejected":
      return "destructive" as const;
    case "verifying":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export const canVerifyTree = ({
  status,
  distance,
}: {
  distance?: number;
  status: TreeMarkerStatus;
}) => {
  return status === "verifying" && distance !== undefined && distance <= 2;
};

export type PopupInfo = {
  tree: TreeData & { distance?: number };
  latitude: number;
  longitude: number;
};
