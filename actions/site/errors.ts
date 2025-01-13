"use server";

import { env } from "@/env.mjs";
import {
  getTelegramChannel,
  telegramClient,
} from "@/lib/notifications/telegram";

export async function reportError(error: Error & { digest?: string }) {
  console.error(error);
  const message = `<b>Site Error Report</b> ⚠️

<b>Message:</b> ${error.message}
<b>Name:</b> ${error.name}
<b>Stack:</b> <pre>${error.stack ?? ""}</pre>
<b>Digest:</b> ${error.digest ?? ""}

Thank you for helping us improve MitiMara!
`;

  const token = env.TELEGRAM_BOT_TOKEN;
  const chat_id = getTelegramChannel("DEV_MODE");

  const data = {
    chat_id,
    text: message,
    parse_mode: "HTML",
  };

  try {
    await telegramClient.post(`/bot${token}/sendMessage`, data);
  } catch (error) {
    console.log("SEND_ERROR_MESSAGE", error);
  }
}
