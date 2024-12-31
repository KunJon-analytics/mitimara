import { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

import { env } from "@/env.mjs";
import { defaultLocation } from "@/lib/validations/location";

export async function GET(request: NextRequest) {
  try {
    const details =
      env.NODE_ENV === "production" ? geolocation(request) : defaultLocation;

    return Response.json(details);
  } catch (error) {
    console.log("GET_MY_LOACTION", error);
    return Response.json(null);
  }
}
