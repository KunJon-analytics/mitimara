"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import LoginModal from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";

type LinkCardButtonProps = {
  isExternal: boolean;
  redirect: string;
  referral?: string;
};

const LinkCardButton = ({
  isExternal,
  redirect,
  referral,
}: LinkCardButtonProps) => {
  const { session, isPending, status } = useCurrentSession();
  const router = useRouter();

  if (isPending) {
    return (
      <Button disabled>
        <LoadingAnimation />
      </Button>
    );
  }

  if (!session.isLoggedIn || status === "error") {
    return <LoginModal redirect={redirect} referral={referral} />;
  }

  return (
    <Button onClick={() => router.push(redirect)}>
      {isExternal ? (
        <ArrowUpRight className="h-4 w-4 animate-pulse" />
      ) : (
        <ArrowRight className="h-4 w-4 animate-pulse" />
      )}{" "}
      Get Started
    </Button>
  );
};

export default LinkCardButton;
