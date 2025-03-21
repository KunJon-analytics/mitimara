import { Inngest, EventSchemas } from "inngest";

import { TelegramEventType } from "@/lib/notifications/telegram";
import { siteConfig } from "@/config/site";
import { $Enums } from "@prisma/client";

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

type AppToUser = {
  data: {
    memo: string;
    amount: number;
    purpose: string;
    uid: string;
    type: $Enums.PiTransactionType;
  };
};

type TreeVerified = {
  data: {
    verificationId: string;
  };
};

type PaymentReceived = {
  data: {
    amount: number;
  };
};

type CompletedPayment = {
  data: {
    paymentId: string;
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

type HuntBountyDeposited = {
  data: {
    localHuntId: string;
    paymentId: string;
  };
};

type RewardTestnet = {
  data: {
    purpose: string;
    uid: string;
  };
};

type ExchangeCreated = {
  data: {
    id: string;
  };
};

type TreeReported = {
  data: {
    treeId: string;
    report: string;
    reporterId: string;
  };
};

type ReportResolved = {
  data: {
    reportId: string;
    notes: string;
  };
};

type Events = {
  "notifications/telegram.post": TelegramEvent;
  "auth/user.created": UserCreated;
  "tree/evidence.added": EvidenceAdded;
  "tree/tree.planted": TreePlanted;
  "tree/info.updated": TreePlanted;
  "tree/verification.added": TreeVerified;
  "payments/app-to-user": AppToUser;
  "tree/verification.completed": TreePlanted;
  "filestack/file.delete": DeleteFilestackFile;
  "payments/payment-completed": CompletedPayment;
  "pots/balance-updated": PaymentReceived;
  "payments/bounty-deposited": HuntBountyDeposited;
  "payments/reward-testnet": RewardTestnet;
  "points/exchange.added": ExchangeCreated;
  "tree/tree.reported": TreeReported;
  "tree/report.resolved": ReportResolved;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: siteConfig.name,
  schemas: new EventSchemas().fromRecord<Events>(),
});
