import Link from "next/link";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "../layout/login-button";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <div className="flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:p-6">
      <div className="flex flex-col gap-6">
        <h1
          className={cn(
            "text-4xl text-foreground md:text-6xl",
            "bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent"
          )}
        >
          Plant Trees, Earn Rewards, and Help the Planet!
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">
          Join MitiMara, the decentralized platform that rewards tree planting
          and verification with Pi tokens.
        </p>
      </div>
      <div className="my-4 grid gap-2 sm:grid-cols-2">
        <div className="text-center sm:block sm:text-right">
          <Suspense
            fallback={
              <Button asChild className="rounded-full">
                <Link href="/app">Get Started</Link>
              </Button>
            }
          >
            <LoginButton />
          </Suspense>
        </div>
        <div className="text-center sm:block sm:text-left">
          <Button variant="outline" className="rounded-full" asChild>
            <Link href={"/about"}>About {siteConfig.name}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
