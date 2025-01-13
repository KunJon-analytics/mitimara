import { env } from "@/env.mjs";

export const SIZE = {
  width: 1200,
  height: 630,
};

export const DEFAULT_URL = env.NEXT_PUBLIC_APP_URL;
// export const DEFAULT_URL = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

export const calSemiBold = fetch(
  new URL("../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
