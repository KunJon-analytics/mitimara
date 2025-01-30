import * as z from "zod";

export const profileSchema = z
  .object({
    points: z.number(),
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

export type ProfileData = z.infer<typeof profileSchema>;

export const defaultProfile: ProfileData = null;
