"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCurrentSession from "@/components/providers/session-provider";
import LoginModal from "@/components/auth/login-modal";

export function LoginButton({ className, ...props }: ButtonProps) {
  const { session } = useCurrentSession();
  const pathname = usePathname();

  if (session.isLoggedIn) {
    return (
      <Button asChild className={cn("rounded-full", className)} {...props}>
        <Link href="/app">Get Started</Link>
      </Button>
    );
  }

  return (
    <LoginModal
      redirect={pathname.startsWith("/app") ? undefined : "/app"}
      {...props}
    />
  );
}
