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
    return <LoadingAnimation />;
  }

  if (!session.isLoggedIn || status === "error") {
    return (
      <LoginModal
        size={"icon"}
        variant={"ghost"}
        redirect={redirect}
        referral={referral}
        className="h-4 w-4 shrink-0 self-end text-muted-foreground border-solid group-hover:text-foreground animate-pulse"
      />
    );
  }
  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => router.push(redirect)}
    >
      {isExternal ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 self-end text-muted-foreground group-hover:text-foreground animate-pulse" />
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0 self-end text-muted-foreground group-hover:text-foreground animate-pulse" />
      )}
    </Button>
  );
};

export default LinkCardButton;
