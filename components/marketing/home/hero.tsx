import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "../layout/login-button";

export function Hero() {
  return (
    <div className="flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:p-6">
      <div className="flex flex-col gap-6">
        <h1
          className={cn(
            "font-cal text-4xl text-foreground md:text-6xl",
            "bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent"
          )}
        >
          Plant Trees, Earn Rewards, and Help the Planet!
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">
          Plant trees, earn rewards, and help the planet!
        </p>
      </div>
      <div className="my-4 grid gap-2 sm:grid-cols-2">
        <div className="text-center sm:block sm:text-right">
          <LoginButton />
        </div>
        <div className="text-center sm:block sm:text-left">
          <Button
            variant="outline"
            className="w-48 rounded-full sm:w-auto"
            asChild
          >
            <Link href={"/about"}>Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
