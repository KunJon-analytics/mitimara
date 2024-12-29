import type { AxiosResponse } from "axios";

import { $Enums } from "@prisma/client";

export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

declare global {
  interface Window {
    Pi: any;
  }
}

type Direction = "user_to_app" | "app_to_user";

type AppNetwork = "Pi Network" | "Pi Testnet";

type Scope = "username" | "payments" | "wallet_address";

export type PaymentDTO<T> = {
  // Payment data:
  identifier: string; // payment identifier
  user_uid: string; // user's app-specific ID
  amount: number; // payment amount
  memo: string; // a string provided by the developer, shown to the user
  metadata: T; // an object provided by the developer for their own usage
  from_address: string; // sender address of the blockchain transaction
  to_address: string; // recipient address of the blockchain transaction
  direction: Direction; // direction of the payment
  created_at: string; // payment's creation timestamp
  network: AppNetwork; // a network of the payment

  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean; // Server-Side Approval
    transaction_verified: boolean; // blockchain transaction verified
    developer_completed: boolean; // server-Side Completion
    cancelled: boolean; // cancelled by the developer or by Pi Network
    user_cancelled: boolean; // cancelled by the user
  };

  // Blockchain transaction data:
  transaction: null | {
    // This is null if no transaction has been made yet
    txid: string; // id of the blockchain transaction
    verified: boolean; // true if the transaction matches the payment, false otherwise
    _link: string; // a link to the operation on the Blockchain API
  };
};

export type PaymentData<T> = {
  amount: number;
  memo: string;
  metadata: T;
};

export type UserDTO = {
  uid: string; // An app-specific user identifier
  credentials: {
    scopes: Array<Scope>; // a list of granted scopes
    valid_until: {
      timestamp: number;
      iso8601: string;
    };
  };
  username?: string; // The user's Pi username. Requires the `username` scope.
};

export type PiCallbacks<T> = {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => Promise<AxiosResponse<any, any>>;
  onError: (error: Error, payment?: PaymentDTO<T>) => void;
};

export type PaymentDTOMemo = {
  type: $Enums.PiTransactionType;
  purpose: string;
};

export type OnIncompletePaymentFound = (
  payment: PaymentDTO<PaymentDTOMemo>
) => Promise<void>;

export interface PiCallbacks<T> {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => Promise<AxiosResponse<any, any>>;
  onError: (error: Error, payment?: PaymentDTO<T>) => void;
}
