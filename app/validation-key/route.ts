import { env } from "@/env.mjs";

export async function GET() {
  return new Response(`${env.PI_VALIDATION_KEY}`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
