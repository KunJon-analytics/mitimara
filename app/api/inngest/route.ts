import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { telegramMessage } from "@/inngest/functions/notifications/telegram-message";
import { userCreatedEvent } from "@/inngest/functions/auth/user";
import { newEvidenceEvent } from "@/inngest/functions/trees/new-evidence";
import { treePlantedEvent } from "@/inngest/functions/trees/tree-planted";
import { treeInfoUpdatedEvent } from "@/inngest/functions/trees/info-updated";
import { treeVerificationAddedEvent } from "@/inngest/functions/trees/new-verification";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    telegramMessage,
    userCreatedEvent,
    newEvidenceEvent,
    treePlantedEvent,
    treeInfoUpdatedEvent,
    treeVerificationAddedEvent,
  ],
});
