import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // PRISMA
    DATABASE_URL: z.string().url(),

    // MISC
    NODE_ENV: z.enum(["development", "production", "test"]),

    // PI NETWORK
    PI_PLATFORM_API_URL: z.string().url(),
    PI_EXPLORER_LINK: z.string().url(),
    PI_API_KEY: z.string().min(1),

    // TELEGRAM
    TELEGRAM_BOT_TOKEN: z.string().min(1),
    TELEGRAM_PUBLIC_CHANNEL: z.string().min(1),
    TELEGRAM_PRIVATE_CHANNEL: z.string().min(1),

    // FILESTACK
    FILESTACK_APP_SECRET: z.string().min(1),

    // SENTRY
    SENTRY_AUTH_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),

    // MAPTILER
    NEXT_PUBLIC_MAPTILER_TOKEN: z.string().min(1),

    // FILESTACK
    NEXT_PUBLIC_FILESTACK_API_KEY: z.string().min(1),

    // SENTRY
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_PUBLIC_CHANNEL: process.env.TELEGRAM_PUBLIC_CHANNEL,
    TELEGRAM_PRIVATE_CHANNEL: process.env.TELEGRAM_PRIVATE_CHANNEL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

    // MAPTILER
    NEXT_PUBLIC_MAPTILER_TOKEN: process.env.NEXT_PUBLIC_MAPTILER_TOKEN,

    // PI NETWORK
    PI_PLATFORM_API_URL: process.env.PI_PLATFORM_API_URL,
    PI_API_KEY: process.env.PI_API_KEY,
    PI_EXPLORER_LINK: process.env.PI_EXPLORER_LINK,

    // FILESTACK
    NEXT_PUBLIC_FILESTACK_API_KEY: process.env.NEXT_PUBLIC_FILESTACK_API_KEY,
    FILESTACK_APP_SECRET: process.env.FILESTACK_APP_SECRET,

    // SENTRY
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  },
});
