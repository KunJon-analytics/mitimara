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
    security: z.object({
      policy: z.string(),
      signature: z.string(),
    }),
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
