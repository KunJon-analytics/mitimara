import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import {
  filestackAPIClient,
  getSecurityPolicy,
} from "@/lib/services/filestack-policy";

export const deleteFileStackFile = inngest.createFunction(
  { id: "delete-filestack-file" },
  { event: "filestack/file.delete" },
  async ({ event, step }) => {
    const { fileHandle } = event.data;

    // add explicit permission to remove particular file for 15 minutes
    const now = Math.floor(new Date().getTime() / 1000);
    const fiftenMinutes = 60 * 15;
    const expiry = now + fiftenMinutes;

    const { policy, signature } = getSecurityPolicy(
      ["remove"],
      expiry,
      fileHandle
    );

    // delete file from filestack using axios post
    const filestackResponse = await step.run(
      "delete-filestack-file",
      async () => {
        const { data, status } = await filestackAPIClient.delete(
          `/${fileHandle}?key=${env.NEXT_PUBLIC_FILESTACK_API_KEY}&policy=${policy}&signature=${signature}`
        );
        return { data, status };
      }
    );

    // return

    return {
      message: `Filestack file: ${fileHandle} deleted with status code: ${filestackResponse.status}`,
    };
  }
);
