import * as z from "zod";

export const authResultSchema = z.object({
  accessToken: z.string(),
  referral: z.string().optional(),
  user: z.object({ uid: z.string(), username: z.string() }),
});

export type AuthResultSchema = z.infer<typeof authResultSchema>;

export const sessionSchema = z.object({
  username: z.string(),
  isLoggedIn: z.boolean(),
  id: z.string(),
});

export type SessionData = z.infer<typeof sessionSchema>;

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
  id: "",
};

export type LoginParams = { referral?: string; redirect?: string };
