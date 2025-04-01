import { Coins, Pi } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  {
    icon: Pi,
    text: "Ecosystem Points Exchange",
    href: "/app/exchange/ecosystem",
  },
  {
    icon: Coins,
    text: "Bounty Contest Rewards",
    href: "/app/rewards/bounty-contest",
  },
];

export default function RewardLinks() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <link.icon className="h-6 w-6 shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium">{link.text}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
