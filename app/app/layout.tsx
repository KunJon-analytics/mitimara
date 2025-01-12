import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/common/mode-toggle";
import { BrandName } from "@/components/marketing/layout/brand-name";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserNavLoading from "@/components/app/user-nav-loading";
import { UserNav } from "@/components/app/user-nav";
import Donate from "@/components/payments/donate";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="bg-foreground/5 px-3 py-3 backdrop-blur-lg md:px-6 md:py-3">
        <div className="flex w-full items-center justify-between">
          <BrandName homeLink="/app" />
          <div className="flex items-center gap-1">
            <ul className="gap-1">
              <li className="w-full">
                <Button variant="link" asChild>
                  <Link href="/telegram" target="_blank">
                    Telegram
                    <ArrowUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
                  </Link>
                </Button>
              </li>
            </ul>
            <div className="relative">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="absolute inset-0">
                <Suspense fallback={<UserNavLoading />}>
                  <UserNav />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </header>
      <ScrollArea className="container mx-auto p-4 grow">{children}</ScrollArea>
      <footer className="bg-foreground/5 p-4 mt-8 flex">
        <p>&copy; 2025 {siteConfig.name}. All rights reserved.</p>
        <div className="flex gap-3 text-right ml-auto">
          <Donate className="bg-foreground/5" />
          <ModeToggle className="bg-foreground/5" />
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
