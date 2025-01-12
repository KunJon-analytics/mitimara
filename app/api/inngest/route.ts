import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { telegramMessage } from "@/inngest/functions/notifications/telegram-message";
import { userCreatedEvent } from "@/inngest/functions/auth/user";
import { newEvidenceEvent } from "@/inngest/functions/trees/new-evidence";
import { treePlantedEvent } from "@/inngest/functions/trees/tree-planted";
import { treeInfoUpdatedEvent } from "@/inngest/functions/trees/info-updated";
import { treeVerificationAddedEvent } from "@/inngest/functions/trees/new-verification";
import { deleteFileStackFile } from "@/inngest/functions/filestack/delete-file";
import { completePayment } from "@/inngest/functions/payments/complete-payment";
import { updatePots } from "@/inngest/functions/pots/update-pots";
import { finishSubscription } from "@/inngest/functions/payments/finish-subscription";

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
    deleteFileStackFile,
    completePayment,
    updatePots,
    finishSubscription,
  ],
});
