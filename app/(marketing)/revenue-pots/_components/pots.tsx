import { Pi } from "lucide-react";

import {
  CardContainer,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@/components/marketing/card";
import prisma from "@/lib/prisma";
import {
  Card as ShadCard,
  CardContent as ShadCardContent,
  CardHeader as ShadCardHeader,
  CardTitle as ShadCardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";

export default async function Pots() {
  const pots = await prisma.pot.findMany({
    where: { isPublic: true, isOpen: true },
    select: { balance: true, name: true, revenueFraction: true },
  });

  const totalBalance = pots.reduce((sum, pot) => sum + pot.balance, 0);

  return (
    <CardContainer>
      <CardHeader>
        <CardIcon icon="coins" />
        <CardTitle>Open Revenue Pots Overview 🌱</CardTitle>
        <CardDescription className="max-w-md">
          Check out {siteConfig.name}
          {"'"}s open revenue pots with their{" "}
          <span className="text-foreground">
            current balances and revenue fractions.
          </span>
          🍃
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pots.map((pot, index) => (
            <ShadCard key={index}>
              <ShadCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ShadCardTitle className="text-sm font-medium">
                  {pot.name}
                </ShadCardTitle>
                <Pi className="h-4 w-4 text-muted-foreground" />
              </ShadCardHeader>
              <ShadCardContent>
                <div className="text-2xl font-bold">
                  π{pot.balance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(pot.revenueFraction * 100).toFixed(1)}% of revenue
                </p>
                <Progress
                  value={(pot.balance / totalBalance) * 100}
                  className="mt-2"
                />
              </ShadCardContent>
            </ShadCard>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}
