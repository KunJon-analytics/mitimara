import { subDays } from "date-fns";
import { z } from "zod";

export const updateBountySchema = z
  .object({
    title: z
      .string()
      .min(3, {
        message: "Title must be at least 3 characters.",
      })
      .max(120, {
        message: "Title must not be more than 3 characters.",
      }),
    description: z.string().min(1).max(300).optional(),
    totalBounty: z.coerce.number().min(1, {
      message: "Total bounty must be at least 1 Pi token.",
    }),
    startDate: z.coerce.date().min(subDays(new Date(), 1), {
      message: "The past is not allowed",
    }),
    accessToken: z.string().min(1),
    id: z.string().min(1),
    endDate: z.coerce
      .date()
      .min(subDays(new Date(), 1), { message: "The past is not allowed" }),
  })
  .refine(
    (data) => {
      if (data.endDate.getTime() < data.startDate.getTime()) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "End date must be later than start date",
      path: ["startDate", "endDate"], // path of error
    }
  );

export type UpdateBountySchema = z.infer<typeof updateBountySchema>;

export const deleteBountySchema = z.object({
  accessToken: z.string().min(1),
  id: z.string().min(1),
});

export type DeleteBountySchema = z.infer<typeof deleteBountySchema>;
