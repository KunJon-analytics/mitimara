import { Inngest, EventSchemas } from "inngest";

import { TelegramEventType } from "@/lib/notifications/telegram";

type UserCreated = {
  data: {
    userId: string;
  };
};

type EvidenceAdded = {
  data: {
    evidenceId: string;
  };
};

type TreePlanted = {
  data: {
    treeId: string;
  };
};

type TreeVerified = {
  data: {
    verificationId: string;
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
  "tree/evidence.added": EvidenceAdded;
  "tree/tree.planted": TreePlanted;
  "tree/info.updated": TreePlanted;
  "tree/verification.added": TreeVerified;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "greenpi",
  schemas: new EventSchemas().fromRecord<Events>(),
});
