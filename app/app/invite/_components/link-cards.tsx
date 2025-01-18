import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinkCardButton from "./link-card-button";

const links = [
  {
    title: "Dashboard",
    description: "View your trees and verifications",
    href: "/",
  },
  {
    title: "Plant Trees",
    description: "Plant trees to earn Pi tokens",
    href: "/plant-tree",
  },
  {
    title: "Verify Trees",
    description: "Verify trees to earn Pi tokens",
    href: "/verify-tree",
  },
  {
    title: "Start Inviting",
    description: "Invite pioneers to earn Pi tokens",
    href: "/referrals",
  },
];

export function LinkCards({ referral }: { referral?: string }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const isExternal = link.href.startsWith("http");
        const href = isExternal ? link.href : `/app${link.href}`;
        return (
          <div key={link.href} className="group flex w-full flex-1">
            <Card className="flex w-full flex-col">
              <CardHeader className="flex-1">
                <CardTitle>{link.title}</CardTitle>

                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <LinkCardButton
                  isExternal={isExternal}
                  redirect={href}
                  referral={referral}
                />
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
