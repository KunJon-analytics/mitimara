"use client";

import Link, { type LinkProps } from "next/link";
import { Menu } from "lucide-react";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { marketingPagesConfig } from "@/config/pages";
import { socialsConfig } from "@/config/socials";
import { cn } from "@/lib/utils";
import { Icons, type ValidIcon } from "@/components/common/icons";
import { LoginButton } from "./login-button";
import { SocialIconButton } from "./social-icon-button";

export function MarketingMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, []); // remove searchParams if not needed

  return (
    <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className={cn("flex flex-col")}>
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col justify-between gap-8">
          <ul className="grid gap-1">
            {marketingPagesConfig.map(({ href, title, icon, children }) => {
              if (!children) {
                return (
                  <ListItemSingle
                    title={title}
                    className="w-full"
                    key={href}
                    href={href}
                    icon={icon}
                    onClick={() => setOpen(false)}
                  />
                );
              }

              return (
                <li key={href}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={title}>
                      <AccordionTrigger>{title}</AccordionTrigger>
                      <AccordionContent>
                        <ul>
                          {children.map((page) => {
                            const { href, title, icon } = page;

                            return (
                              <ListItem
                                key={href}
                                title={title}
                                href={href}
                                icon={icon}
                                onClick={() => setOpen(false)}
                              />
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between gap-2">
            <ul className="flex flex-wrap gap-2">
              {socialsConfig.map((props) => (
                <li key={props.title}>
                  <SocialIconButton {...props} />
                </li>
              ))}
            </ul>
            <LoginButton variant="outline" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & LinkProps & { icon: ValidIcon }
>(({ className, title, icon, ...props }, ref) => {
  // TODO: if external, add Arrow-Right-Up Icon
  const Icon = Icons[icon];
  return (
    <li className="group">
      <Link
        ref={ref}
        className={cn(
          "flex select-none items-center gap-2 space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="font-medium text-sm leading-none">{title}</div>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

const ListItemSingle = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & LinkProps & { icon: ValidIcon }
>(({ className, title, ...props }, ref) => {
  // TODO: if external, add Arrow-Right-Up Icon

  return (
    <li className="group">
      <Link
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between border-b py-4 font-medium transition-all hover:underline",
          className
        )}
        {...props}
      >
        {title}
      </Link>
    </li>
  );
});
ListItemSingle.displayName = "ListItemSingle";
