"use client";

import Link from "next/link";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCurrentSession from "@/components/providers/session-provider";
import LoginModal from "@/components/auth/login-modal";

export function LoginButton({ className, ...props }: ButtonProps) {
  const { session } = useCurrentSession();

  if (session.isLoggedIn) {
    return (
      <Button asChild className={cn("rounded-full", className)} {...props}>
        <Link href="/app">Get Started</Link>
      </Button>
    );
  }

  return <LoginModal redirect="/app" />;
}
