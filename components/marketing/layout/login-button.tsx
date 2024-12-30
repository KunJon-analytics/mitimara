"use client";

import Link from "next/link";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";

export function LoginButton({ className, ...props }: ButtonProps) {
  const { session, isPending } = useCurrentSession();

  if (isPending) {
    return (
      <Button disabled className={cn("rounded-full", className)} {...props}>
        <LoadingAnimation />
      </Button>
    );
  }

  return (
    <Button asChild className={cn("rounded-full", className)} {...props}>
      {session.isLoggedIn ? (
        <Link href="/dashboard">Dashboard</Link>
      ) : (
        <Link href="/login">Sign In</Link>
      )}
    </Button>
  );
}
