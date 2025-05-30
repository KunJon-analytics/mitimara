import * as z from "zod";
import { $Enums } from "@prisma/client";

export const profileSchema = z
  .object({
    points: z.number(),
    policingPoints: z.number(),
    noOfReferrals: z.number(),
    _count: z.object({
      plantedTrees: z.number(),
      treeVerifications: z.number(),
    }),
    bountyRewards: z
      .object({
        id: z.string(),
        treesPlanted: z.number(),
        treesVerified: z.number(),
        localBounty: z.object({ title: z.string() }),
      })
      .array(),
    treeRecommendations: z
      .object({
        id: z.string(),
        commonName: z.string().nullable(),
        description: z.string().nullable(),
        scientificName: z.string().nullable(),
        error: z.string().nullable(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        status: z.nativeEnum($Enums.TreeRecommendationStatus),
      })
      .array(),
  })
  .nullable();

export const profileRewardsSchema = z
  .object({
    points: z.number(),
    verifiedOrPlantedAuthTrees: z.boolean(),
    hasPendingExchange: z.boolean(),
    nextClaimDate: z.coerce.date(),

    exchangeHistory: z
      .object({
        id: z.string(),
        amount: z.number(),
        updatedAt: z.coerce.date(),
        status: z.nativeEnum($Enums.PointsExchangeStatus),
      })
      .array(),
  })
  .nullable();

export type ProfileData = z.infer<typeof profileSchema>;
export type ProfileRewardsData = z.infer<typeof profileRewardsSchema>;

export const defaultProfile: ProfileData = null;
