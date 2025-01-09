import { Inngest, EventSchemas } from "inngest";

import { TelegramEventType } from "@/lib/notifications/telegram";
import { siteConfig } from "@/config/site";

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

type DeleteFilestackFile = {
  data: {
    fileHandle: string;
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
  "filestack/file.delete": DeleteFilestackFile;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: siteConfig.name,
  schemas: new EventSchemas().fromRecord<Events>(),
});
