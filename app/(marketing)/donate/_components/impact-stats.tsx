import { TreesIcon as Tree, Users, Globe, Coins } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getSiteStats } from "@/lib/services/stats";
import { numberFormatter } from "@/lib/utils";
import { ACTIVE_COUNTRIES } from "@/config/site";

export async function ImpactStats() {
  const { trees, users, totalBalance } = await getSiteStats();

  const impactData = [
    {
      icon: Tree,
      value: numberFormatter(trees),
      label: "Trees Planted",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Users,
      value: numberFormatter(users),
      label: "Active Planters",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Globe,
      value: ACTIVE_COUNTRIES,
      label: "Countries",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Coins,
      value: numberFormatter(totalBalance ?? 0),
      label: "Pi Tokens Earned",
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <section className="py-16 bg-white/50 dark:bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Growing Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the real-world impact of our community-driven reforestation
            efforts
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactData.map((stat, index) => (
            <Card
              key={index}
              className="border-0 bg-white/80 dark:bg-background/80 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
