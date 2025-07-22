"use client";

import React, { ReactNode } from "react";

import { ButtonProps } from "../ui/button";
import Donate from "./donate";
import Subscribe from "./subscribe";
import useCurrentSession from "../providers/session-provider";
import LoginModal from "../auth/login-modal";

type PaymentButtonProps = ButtonProps & {
  purpose: "donate" | "subscribe";
  buttonText?: ReactNode;
  defaultAmount?: number;
};

const PaymentButton = ({
  purpose,
  buttonText,
  defaultAmount,
  ...props
}: PaymentButtonProps) => {
  const { session } = useCurrentSession();

  if (!session.isLoggedIn) {
    return <LoginModal buttonText={buttonText} {...props} />;
  }

  if (purpose === "donate") {
    return (
      <Donate
        buttonText={buttonText}
        defaultAmount={defaultAmount}
        {...props}
      />
    );
  }

  return <Subscribe buttonText={buttonText} {...props} />;
};

export default PaymentButton;
