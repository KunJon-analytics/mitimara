import { OnIncompletePaymentFound } from "@/types/pi";
import axiosClient from "../axios-client";

export const onIncompletePaymentFound: OnIncompletePaymentFound = async (
  payment
) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post("/payments/incomplete", { payment });
};
