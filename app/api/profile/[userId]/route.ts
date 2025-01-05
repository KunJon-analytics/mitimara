import { type NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { defaultProfile } from "@/lib/validations/profile";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const id = (await params).userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        _count: { select: { plantedTrees: true, treeVerifications: true } },
        noOfReferrals: true,
        points: true,
      },
    });
    return Response.json(user);
  } catch (error) {
    console.log("GET_USER_PROFILE", error);
    return Response.json(defaultProfile);
  }
}
