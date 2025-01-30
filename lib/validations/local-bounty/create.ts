import { subDays } from "date-fns";
import { z } from "zod";

// add refine to ensure end date is greater than start date
// and start date is not later than today

export const createDefaultValues = {
  title: "Get green Ikeja",
  description: "Ikeja must go green",
  radius: 0.5,
  startDate: new Date(),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to one month from now
  totalBounty: 100,
};

export const createBountySchema = z
  .object({
    accessToken: z.string().min(1),

    title: z
      .string()
      .min(3, {
        message: "Title must be at least 3 characters.",
      })
      .max(60, {
        message: "Title must not be less than 60 characters.",
      }),
    description: z.string().min(3).max(200).optional(),
    totalBounty: z.coerce.number().min(1, {
      message: "Total bounty must be at least 1 Pi token.",
    }),
    //min radius of 100m
    radius: z.coerce.number().min(0.1, {
      message: "Radius must be at least 0.1 km.",
    }),

    startDate: z.coerce.date().min(subDays(new Date(), 1), {
      message: "The past is not allowed",
    }),
    endDate: z.coerce
      .date()
      .min(subDays(new Date(), 1), { message: "The past is not allowed" }),

    centerLatitude: z.coerce.number().min(-90).max(90),
    centerLongitude: z.coerce.number().min(-180).max(180),
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

export const formASchema = z.object({
  accessToken: z.string().min(1),
  centerLatitude: z.coerce.number().min(-90).max(90),
  centerLongitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1, {
    message: "Radius must be at least 0.1 km.",
  }),
});

export const formBSchema = z
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

export type CreateBountySchema = z.infer<typeof createBountySchema>;

export const formSteps = ["location", "information", "summary"] as const;

export type FormStep = (typeof formSteps)[number];

export const formTabs: Record<FormStep, { title: string }> = {
  information: { title: "Information" },
  location: { title: "Location" },
  summary: { title: "Summary" },
};
