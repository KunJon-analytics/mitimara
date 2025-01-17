import axios from "axios";

type VerifyPaymentParams = {
  txURL: string;
  dbPayment: { paymentId: string; amount: number };
};

export async function verifyPaymentCompletion({
  txURL,
  dbPayment,
}: VerifyPaymentParams) {
  // check the transaction on the Pi blockchain
  const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
  const operationsResponse = await axios
    .create({ timeout: 20000 })
    .get(`${txURL}/operations`);
  const horizonAmount = operationsResponse.data._embedded.records[0]
    .amount as string;
  const paymentIdOnBlock = horizonResponse.data.memo;

  // and check other data as well e.g. amount
  if (dbPayment.amount < parseFloat(horizonAmount)) {
    console.error(
      "[VERIFY_PAYMENT_COMPLETION]",
      "Payment amount not the same with blockchain payment"
    );
    return false;
  }

  if (paymentIdOnBlock !== dbPayment.paymentId) {
    console.error(
      "[VERIFY_PAYMENT_COMPLETION]",
      "Payment id not same with blockchain"
    );
    return false;
  }

  return true;
}
