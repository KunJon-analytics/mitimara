import Link from "next/link";
import * as React from "react";

// Hottake: you don't need a features page if you have a changelog page
// Except for SEO

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/common/icons";

type BrandNameProps = { homeLink?: string };

export function BrandName({ homeLink }: BrandNameProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={homeLink ? homeLink : "/"}
          className="flex items-center gap-2 font-cal text-primary"
        >
          <Icons.logo className="rounded-full w-8 h-8 border border-border bg-transparent" />
          {siteConfig.name}
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <a href="/logo.png" download={`${siteConfig.name}.png`}>
            Download SVG
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
