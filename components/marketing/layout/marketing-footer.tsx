import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { socialsConfig } from "@/config/socials";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/common/mode-toggle";
import { Shell } from "@/components/common/shell";
import { BrandName } from "./brand-name";
import { SocialIconButton } from "./social-icon-button";

interface Props {
  className?: string;
}

export function MarketingFooter({ className }: Props) {
  return (
    <footer className={cn("w-full", className)}>
      <Shell className="grid gap-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3">
            <div>
              <BrandName />
              <p className="mt-2 max-w-md font-light text-muted-foreground text-sm">
                Tree planting platform rewarding users with Pi tokens for
                planting and verifying trees.
                <br />
                <span className="underline decoration-dotted underline-offset-2">
                  Go Green
                </span>
              </p>
            </div>
          </div>
          <div className="order-2 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground">Resources</p>
            <FooterLink href="/#faq" label="FAQ" />
            <FooterLink href="/about" label="About" />
          </div>
          <div className="order-3 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground">Company</p>
            <FooterLink href="/legal/terms" label="Terms" />
            <FooterLink href="/legal/privacy" label="Privacy" />
          </div>
          <div className="order-3 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground">Tools</p>
            <FooterLink href="/#how-it-works" label="How it Works" />
            <FooterLink href="/blog/how-to-plant-a-tree" label="Plant a Tree" />
            <FooterLink
              href="/blog/how-to-verify-a-tree"
              label="Verify a Tree"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {socialsConfig.map(({ title, href, icon }) => (
              <SocialIconButton key={title} {...{ href, icon, title }} />
            ))}
          </div>
          <div className="text-right md:text-left">
            <ModeToggle />
          </div>
        </div>
      </Shell>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function FooterLink({ href, label, external = false }: FooterLinkProps) {
  const isExternal = external || href.startsWith("http");

  const externalProps = isExternal
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {};

  return (
    <Link
      className="flex flex-wrap gap-1 w-fit items-center text-muted-foreground underline underline-offset-4 hover:text-foreground hover:no-underline"
      href={href}
      {...externalProps}
    >
      {label}
      {isExternal ? <ArrowUpRight className="h-4 w-4 flex-shrink-0" /> : null}
    </Link>
  );
}
