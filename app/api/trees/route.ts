import { NextRequest } from "next/server";

import { getUnverifiedTrees } from "@/lib/tree/services";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const userId = sp.get("userid");

  if (!userId) {
    return [];
  }

  try {
    const unverifiedTrees = await getUnverifiedTrees(userId);

    return Response.json(unverifiedTrees);
  } catch (error) {
    console.error("Failed to find user unverified trees:", error);
    return Response.json([]);
  }
}
