import { type NextRequest } from "next/server";

import { defaultProfile } from "@/lib/validations/profile";
import { getUserprofile } from "@/lib/services/profile";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const id = (await params).userId;

  // change to accessToken

  try {
    const user = await getUserprofile(id);
    return Response.json(user);
  } catch (error) {
    console.error("GET_USER_PROFILE", error);
    return Response.json(defaultProfile);
  }
}
