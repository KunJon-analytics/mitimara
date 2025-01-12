import * as z from "zod";

export const donationSchema = z.object({
  amount: z.coerce.number().positive(),
});

export type DonationSchema = z.infer<typeof donationSchema>;
