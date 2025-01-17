import { NextRequest } from "next/server";

import { getTreeCodeSchema } from "@/lib/validations/tree";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ treeId: string }> }
) {
  const sp = request.nextUrl.searchParams;

  const reqParams = {
    accessToken: sp.get("token"),
    treeId: (await params).treeId,
  };

  const validatedFields = getTreeCodeSchema.safeParse(reqParams);

  if (!validatedFields.success) {
    return Response.json(null);
  }

  const { accessToken, treeId } = validatedFields.data;
  try {
    const treeCode = await prisma.tree.findFirst({
      where: {
        id: treeId,
        planter: { accessToken },
      },
      select: { code: true },
    });

    return Response.json(treeCode);
  } catch (error) {
    console.error("Failed to get tree code:", error);
    return Response.json(null);
  }
}
