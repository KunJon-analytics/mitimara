import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import {
  getTelegramChannel,
  telegramClient,
} from "@/lib/notifications/telegram";

// Some function we'll call
export const telegramMessage = inngest.createFunction(
  { id: "send-telegram-notification" },
  { event: "notifications/telegram.send" },
  async ({ event, step }) => {
    const { message, type } = event.data;
    const token = env.TELEGRAM_BOT_TOKEN;
    const chat_id =
      env.NODE_ENV === "development"
        ? getTelegramChannel("DEV_MODE")
        : getTelegramChannel(type);
    const data = {
      chat_id,
      text: message,
      parse_mode: "HTML",
    };

    const messageSent = await step.run("send-telegram-message", async () => {
      return await telegramClient.post(`/bot${token}/sendMessage`, data);
    });

    // send notification

    return messageSent.data;
  }
);
