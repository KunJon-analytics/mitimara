import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { verificationNotStartedStatus } from "@/lib/tree/constants";
import { treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  treeVerificationImageUpload: f(
    {
      image: {
        maxFileSize: "1MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    .input(
      z.object({ accessToken: z.string().min(1), treeId: z.string().min(1) })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input: { accessToken, treeId } }) => {
      // This code runs on your server before upload

      const validToken = await isValidAccessToken(accessToken);

      // If you throw, the user will not be able to upload
      if (!validToken) throw new UploadThingError("Unauthorized");

      // ensure tree is planted by user, is LISTED or PLANTED
      //  and media evidence is not more than 3
      const tree = await prisma.tree.findUnique({
        where: {
          id: treeId,
          status: { in: verificationNotStartedStatus },
          planter: { accessToken },
        },
        select: { _count: { select: { mediaEvidence: true } } },
      });

      if (!tree) {
        throw new UploadThingError("Unauthorized");
      }

      if (tree._count.mediaEvidence >= treeLogicConfig.maxNoOfTreeEvidences) {
        // if evidence type is image send delete image from uploadthing
        throw new UploadThingError("Forbidden");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { treeId };
    })
    .onUploadComplete(async ({ metadata: { treeId }, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const treeEvidence = await prisma.media.create({
        data: { type: "IMAGE", url: file.ufsUrl, treeId, handle: file.key },
        select: { id: true },
      });

      // send tree evidence added event (send TG message)
      await inngest.send({
        name: "tree/evidence.added",
        data: {
          evidenceId: treeEvidence.id,
        },
      });

      revalidatePath("/app");

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { success: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
