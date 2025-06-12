import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";

import { env } from "@/env.mjs";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { verificationNotStartedStatus } from "@/lib/tree/constants";
import { treeLogicConfig } from "@/config/site";

const invalidSignature = { signature: "invalid" };

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const treeId = searchParams.get("treeId");

  if (!accessToken || !treeId) {
    console.error(
      "[GENERATE_CLOUDINARY_SIGNATURE]",
      "Invalid authentication params"
    );
    return Response.json(invalidSignature);
  }

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("[GENERATE_CLOUDINARY_SIGNATURE]", "Invalid Access Token");
    return Response.json(invalidSignature);
  }

  const tree = await prisma.tree.findUnique({
    where: {
      id: treeId,
      status: { in: verificationNotStartedStatus },
      planter: { accessToken },
    },
    select: { _count: { select: { mediaEvidence: true } } },
  });

  if (!tree) {
    return Response.json(invalidSignature);
  }

  if (tree._count.mediaEvidence >= treeLogicConfig.maxNoOfTreeEvidences) {
    // if evidence type is image send delete image from uploadthing
    return Response.json(invalidSignature);
  }

  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
