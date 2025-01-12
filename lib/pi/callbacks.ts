import { toast } from "sonner";

import {
  OnIncompletePaymentFound,
  PaymentDTO,
  PaymentDTOMemo,
  PiCallbacks,
} from "@/types/pi";
import axiosClient, { axiosConfig } from "../axios-client";

export const onIncompletePaymentFound: OnIncompletePaymentFound = async (
  payment
) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post("/payments/incomplete", { payment });
};

const onReadyForServerApproval = (paymentId: string) => {
  console.log("onReadyForServerApproval", paymentId);
  axiosClient.post(`/payments/approve`, { paymentId }, axiosConfig);
};

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log("onReadyForServerCompletion", paymentId, txid);
  axiosClient.post(`/payments/complete`, { paymentId, txid }, axiosConfig);
  toast.success("Thanks for your donation");
};

const onCancel = (paymentId: string) => {
  console.log("onCancel", paymentId);
  toast.error("Payment was cancelled");
  return axiosClient.post("/payments/cancel", { paymentId });
};

const onError = (error: Error, payment?: PaymentDTO<PaymentDTOMemo>) => {
  console.error("onError", error);
  toast.error(error.message);
  if (payment) {
    console.log(payment);
    // handle the error accordingly send notification to admin
  }
};

export const piPaymentCallbacks: PiCallbacks<PaymentDTOMemo> = {
  onCancel,
  onError,
  onReadyForServerApproval,
  onReadyForServerCompletion,
};
