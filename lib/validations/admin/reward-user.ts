import * as z from "zod";

export const rewardUserSchema = z.object({
  pointType: z.enum(["ecosystem", "policing"], {
    required_error: "You must select a point type",
  }),
  action: z.enum(["reward", "penalize"], {
    required_error: "You must select an action",
  }),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .int({
      message: "Amount must be interger",
    })
    .positive({
      message: "Amount must be positive",
    }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters",
  }),
});

export const rewardUserParams = rewardUserSchema.extend({
  accessToken: z.string().min(1, {
    message: "User must be authenticated",
  }),
  userId: z.string().min(1, {
    message: "User ID must be provided",
  }),
});

export type RewardUserValues = z.infer<typeof rewardUserSchema>;

export type RewardUserParams = z.infer<typeof rewardUserParams>;
