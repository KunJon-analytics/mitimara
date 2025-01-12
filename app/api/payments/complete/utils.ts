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
  const paymentIdOnBlock = horizonResponse.data.memo;
  console.log(horizonResponse.data);

  // and check other data as well e.g. amount
  if (paymentIdOnBlock !== dbPayment.paymentId) {
    console.log(
      "[VERIFY_PAYMENT_COMPLETION]",
      "Payment id not same with blockchain"
    );
    return false;
  }

  return true;
}
