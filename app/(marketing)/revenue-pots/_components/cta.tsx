import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/marketing/layout/login-button";
import Donate from "@/components/payments/donate";

export default function CTA({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-6",
        className
      )}
    >
      <p className="max-w-lg text-center text-lg text-muted-foreground">
        Join us in creating a greener future! Earn Pi tokens by planting and
        verifying trees, or donate to our revenue pots. Every contribution
        counts! 🌳💚
      </p>
      <div className="flex gap-2">
        <Suspense
          fallback={
            <Button asChild className="rounded-full">
              <Link href="/app">Get Started</Link>
            </Button>
          }
        >
          <LoginButton />
        </Suspense>
        <Donate size={"lg"} variant={"secondary"} />
      </div>
    </div>
  );
}
