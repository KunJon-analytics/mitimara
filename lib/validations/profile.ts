import * as z from "zod";

export const profileSchema = z
  .object({
    points: z.number(),
    noOfReferrals: z.number(),
    _count: z.object({
      plantedTrees: z.number(),
      treeVerifications: z.number(),
    }),
    security: z.object({
      policy: z.string(),
      signature: z.string(),
    }),
  })
  .nullable();

export type ProfileData = z.infer<typeof profileSchema>;

export const defaultProfile: ProfileData = null;
