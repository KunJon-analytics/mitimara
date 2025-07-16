import { Prisma, $Enums } from "@prisma/client";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";
import { defaultRadius } from "./searchParams";

type TreeStatus = $Enums.TreeStatus;

export type TreeData = {
  id: string;
  latitude: number;
  longitude: number;
  status: TreeStatus;
  isAuthentic: boolean;
  createdAt: Date;
  planter: {
    username: string;
  };
};

type GetTreesParams = {
  latitude?: number | null;
  longitude?: number | null;
  status?: TreeStatus | null;
  sortBy?: "distance" | "newest" | "oldest";
  radius?: number; // in kilometers
};

export async function getTrees(params: GetTreesParams = {}) {
  const {
    latitude,
    longitude,
    status,
    sortBy = "newest",
    radius = defaultRadius,
  } = params;

  // Build where clause
  const whereClause: Prisma.TreeWhereInput = { archivedAt: null };

  // all, verifying, verified
  // note planted gets all trees

  if (status) {
    if (status === "VERIFYING") {
      whereClause.status = { in: ["LISTED", "VERIFYING"] };
    } else if (status === "MATURED") {
      whereClause.status = "MATURED";
      whereClause.isAuthentic = true;
    } else {
      whereClause.status = undefined;
    }
  }

  // Get trees from database
  const trees = await prisma.tree.findMany({
    where: whereClause,
    select: {
      id: true,
      latitude: true,
      longitude: true,
      status: true,
      isAuthentic: true,
      createdAt: true,
      planter: {
        select: {
          username: true,
        },
      },
      verifications: {
        select: {
          id: true,
        },
      },
    },
    orderBy:
      sortBy === "newest"
        ? { createdAt: "desc" }
        : sortBy === "oldest"
        ? { createdAt: "asc" }
        : undefined,
  });

  // Transform and filter trees
  let transformedTrees: (TreeData & { distance?: number })[] = trees;

  // Calculate distances and filter by radius if user location is provided
  if (latitude && longitude) {
    transformedTrees = transformedTrees
      .map((tree) => ({
        ...tree,
        distance: calculateDistance(
          latitude,
          longitude,
          tree.latitude,
          tree.longitude
        ),
      }))
      .filter((tree) => tree.distance! <= radius);

    // Sort by distance if requested
    if (sortBy === "distance") {
      transformedTrees.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
  }

  return transformedTrees;
}
