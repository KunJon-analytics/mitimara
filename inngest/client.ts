import { Inngest, EventSchemas } from "inngest";

import { TelegramEventType } from "@/lib/notifications/telegram";

type UserCreated = {
  data: {
    userId: string;
  };
};

type TelegramEvent = {
  data: {
    message: string;
    type: TelegramEventType;
  };
};

type Events = {
  "notifications/telegram.send": TelegramEvent;
  "auth/user.created": UserCreated;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "greenpi",
  schemas: new EventSchemas().fromRecord<Events>(),
});
