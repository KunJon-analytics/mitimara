import { UrlWithOverrides } from "uploadthing/types";

import { getImageUrlWithPolicy } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import {
  filestackAPIClient,
  getSecurityPolicy,
  readPolicy,
} from "@/lib/services/filestack-policy";
import { env } from "@/env.mjs";
import { utapi } from "../lib/uploadthing/server";

// const sampleUploadData = {
//   key: "LwzNyEBuVqEXovf7g6A38VI5Odo2UL4QxlFzw90XMNuqyBbt",
//   url: "https://utfs.io/f/LwzNyEBuVqEXovf7g6A38VI5Odo2UL4QxlFzw90XMNuqyBbt",
//   appUrl:
//     "https://utfs.io/a/tjq2u0sn85/LwzNyEBuVqEXovf7g6A38VI5Odo2UL4QxlFzw90XMNuqyBbt",
//   ufsUrl:
//     "https://tjq2u0sn85.ufs.sh/f/LwzNyEBuVqEXovf7g6A38VI5Odo2UL4QxlFzw90XMNuqyBbt",
//   lastModified: 1748630550706,
//   name: "zAHawa0OR2W8s8htaQGn",
//   size: 899418,
//   type: "application/octet-stream",
//   customId: null,
//   fileHash: "ab2411c8fbc373b5d7a47feb580b31fe",
// };

const prisma = new PrismaClient();

async function main() {
  // get image from db
  const dbImages = await prisma.media.findMany({
    where: { url: { startsWith: "https://cdn.filestackcontent.com" } },
    take: 20,
    select: { handle: true, url: true, id: true },
  });
  console.log({ dbImages });

  // convert to array of strings of urls with read policy
  const fileUrls: UrlWithOverrides[] = dbImages.map((im) => ({
    url: getImageUrlWithPolicy(im.url, readPolicy),
    name: im.id,
  }));

  // upload image to uploadthing
  const uploadedFiles = await utapi.uploadFilesFromUrl(fileUrls, {
    concurrency: dbImages.length,
  });
  console.dir(uploadedFiles, { depth: null });

  // filter out those without error
  const successfulUploads = uploadedFiles.filter((uf) => uf.error === null);

  // update db url and filekey for image
  const updateMediaParams = successfulUploads.map((uf) => {
    return prisma.media.update({
      where: { id: uf.data.name },
      data: {
        handle: uf.data.key,
        url: uf.data.ufsUrl,
      },
      select: {
        id: true,
      },
    });
  });

  const updatedMedia = await prisma.$transaction(updateMediaParams);

  console.log({ updatedMedia });

  // delete filestack image

  // add explicit permission to remove particular file for 15 minutes
  const deleteFileStackFilesPromise = dbImages.map((oldMedia) => {
    const now = Math.floor(new Date().getTime() / 1000);
    const fiftenMinutes = 60 * 15;
    const expiry = now + fiftenMinutes;

    const { policy, signature } = getSecurityPolicy(
      ["remove"],
      expiry,
      oldMedia.handle as string
    );
    return filestackAPIClient.delete(
      `/${oldMedia.handle}?key=${env.NEXT_PUBLIC_FILESTACK_API_KEY}&policy=${policy}&signature=${signature}`
    );
  });
  const deletedFiles = await Promise.all(deleteFileStackFilesPromise);
  console.log(deletedFiles);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
