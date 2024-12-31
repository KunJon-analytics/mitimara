import * as z from "zod";

export const createTreeSchema = z.object({
  accessToken: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateTreeSchema = z.infer<typeof createTreeSchema>;
