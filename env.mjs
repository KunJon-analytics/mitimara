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
    PI_SECRET_KEY: z.string().min(1),
    PI_VALIDATION_KEY: z.string().min(1),

    // TELEGRAM
    TELEGRAM_BOT_TOKEN: z.string().min(1),
    TELEGRAM_PUBLIC_CHANNEL: z.string().min(1),
    TELEGRAM_PRIVATE_CHANNEL: z.string().min(1),

    // FILESTACK
    FILESTACK_APP_SECRET: z.string().min(1),

    // UPLOADTHING
    UPLOADTHING_TOKEN: z.string().min(1),
    UPLOADTHING_CALLBACK_URL: z.string().url(),

    // SENTRY
    SENTRY_AUTH_TOKEN: z.string().min(1),

    //LANGSMITH
    LANGSMITH_TRACING: z.coerce.boolean(),
    LANGSMITH_ENDPOINT: z.string().url(),
    LANGSMITH_API_KEY: z.string().min(1),
    LANGSMITH_PROJECT: z.string().min(1),

    // OPENAPI
    OPENAI_API_KEY: z.string().min(1),

    // OPENROUTER
    OPENROUTER_API_KEY: z.string().min(1),

    // PINECONE
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_INDEX: z.string().min(1),

    // LOCATIONIQ
    LOCATIONIQ_ACCESS_TOKEN: z.string().min(1),

    // UNSPLASH
    UNSPLASH_ACCESS_KEY: z.string().min(1),
    UNSPLASH_SECRET_KEY: z.string().min(1),

    // CLOUDINARY
    CLOUDINARY_API_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),

    //PINETWORK
    NEXT_PUBLIC_PINET_URL: z.string().url(),
    NEXT_PUBLIC_WALLET_ADDRESS: z.string().min(1),

    // MAPTILER
    NEXT_PUBLIC_MAPTILER_TOKEN: z.string().min(1),

    // TELEGRAM
    NEXT_PUBLIC_TELEGRAM_GROUP: z.string().min(1),

    // FILESTACK
    NEXT_PUBLIC_FILESTACK_API_KEY: z.string().min(1),

    // CLOUDINARY
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),

    // GOOGLE ADSENSE
    NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID: z.string().min(1),

    // SENTRY
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_PUBLIC_CHANNEL: process.env.TELEGRAM_PUBLIC_CHANNEL,
    TELEGRAM_PRIVATE_CHANNEL: process.env.TELEGRAM_PRIVATE_CHANNEL,
    NEXT_PUBLIC_TELEGRAM_GROUP: process.env.NEXT_PUBLIC_TELEGRAM_GROUP,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

    // MAPTILER
    NEXT_PUBLIC_MAPTILER_TOKEN: process.env.NEXT_PUBLIC_MAPTILER_TOKEN,

    // PI NETWORK
    PI_PLATFORM_API_URL: process.env.PI_PLATFORM_API_URL,
    PI_API_KEY: process.env.PI_API_KEY,
    PI_EXPLORER_LINK: process.env.PI_EXPLORER_LINK,
    NEXT_PUBLIC_PINET_URL: process.env.NEXT_PUBLIC_PINET_URL,
    PI_SECRET_KEY: process.env.PI_SECRET_KEY,
    PI_VALIDATION_KEY: process.env.PI_VALIDATION_KEY,
    NEXT_PUBLIC_WALLET_ADDRESS: process.env.NEXT_PUBLIC_WALLET_ADDRESS,

    // FILESTACK
    NEXT_PUBLIC_FILESTACK_API_KEY: process.env.NEXT_PUBLIC_FILESTACK_API_KEY,
    FILESTACK_APP_SECRET: process.env.FILESTACK_APP_SECRET,

    // UPLOADTHING
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_CALLBACK_URL: process.env.UPLOADTHING_CALLBACK_URL,

    // SENTRY
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    // LANGSMITH
    LANGSMITH_TRACING: process.env.LANGSMITH_TRACING,
    LANGSMITH_ENDPOINT: process.env.LANGSMITH_ENDPOINT,
    LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY,
    LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT,

    // OPEN AI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // OPENROUTER
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,

    // PINECONE
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX: process.env.PINECONE_INDEX,

    //LOCATIONIQ
    LOCATIONIQ_ACCESS_TOKEN: process.env.LOCATIONIQ_ACCESS_TOKEN,

    //UNSPLASH
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,

    //CLOUDINARY
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    //GOOGLE ADSENSE
    NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID,
  },
});
