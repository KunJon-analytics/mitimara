import { v2 as cloudinary } from "cloudinary";

import { inngest } from "@/inngest/client";
import { env } from "@/env.mjs";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryFile = inngest.createFunction(
  { id: "delete-cloudinary-file" },
  { event: "cloudinary/file.delete" },
  async ({ event, step }) => {
    const { fileHandle } = event.data;

    // delete file from uploadthing using utapi
    const cloudinaryResponse = await step.run(
      "delete-cloudinary-file",
      async () => {
        return cloudinary.uploader.destroy(fileHandle);
      }
    );

    // return

    return {
      message: `cloudinary file: ${fileHandle} deleted with success: ${cloudinaryResponse.result}`,
    };
  }
);
