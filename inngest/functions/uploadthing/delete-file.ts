import { inngest } from "@/inngest/client";
import { utapi } from "@/lib/uploadthing/server";

export const deleteUploadThingFile = inngest.createFunction(
  { id: "delete-uploadthing-file" },
  { event: "uploadthing/file.delete" },
  async ({ event, step }) => {
    const { fileHandle } = event.data;

    // delete file from uploadthing using utapi
    const uploadthingResponse = await step.run(
      "delete-uploadthing-file",
      async () => {
        return utapi.deleteFiles(fileHandle);
      }
    );

    // return

    return {
      message: `uploadthing file: ${fileHandle} deleted with success: ${uploadthingResponse.success}`,
    };
  }
);
