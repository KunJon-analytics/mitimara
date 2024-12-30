import Link from "next/link";
import React from "react";

import { siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/common/mode-toggle";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="bg-foreground/5 p-4">
        <h1 className="text-2xl font-bold">
          <Link href={"/app"}>{siteConfig.name}</Link>
        </h1>
      </header>
      <main className="container mx-auto p-4 grow">{children}</main>
      <footer className="bg-foreground/5 p-4 mt-8 flex">
        <p>&copy; 2025 {siteConfig.name}. All rights reserved.</p>
        <ModeToggle className="bg-foreground/5 ml-auto" />
      </footer>
    </div>
  );
};

export default AppLayout;
