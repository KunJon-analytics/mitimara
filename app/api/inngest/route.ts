import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { telegramMessage } from "@/inngest/functions/notifications/telegram-message";
import { userCreatedEvent } from "@/inngest/functions/auth/user";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    telegramMessage,
    userCreatedEvent,
  ],
});
