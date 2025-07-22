import { CheckCircle, Star, Zap, Crown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SubscriptionTiers() {
  const tiers = [
    {
      name: "Seedling",
      icon: CheckCircle,
      price: "5 Pi",
      points: "500",
      trees: "100",
      color: "green",
      popular: false,
      features: [
        "500 Ecosystem Points",
        "Plant up to 100 trees",
        "Basic tree recommendations",
        "Community verification access",
        "Monthly impact report",
      ],
    },
    {
      name: "Forest Guardian",
      icon: Star,
      price: "15 Pi",
      points: "1,800",
      trees: "360",
      color: "blue",
      popular: true,
      features: [
        "1,800 Ecosystem Points (20% bonus)",
        "Plant up to 360 trees",
        "AI-powered tree recommendations",
        "Priority verification queue",
        "Weekly impact reports",
        "Community badge",
      ],
    },
    {
      name: "Eco Champion",
      icon: Crown,
      price: "40 Pi",
      points: "5,200",
      trees: "1,040",
      color: "purple",
      popular: false,
      features: [
        "5,200 Ecosystem Points (30% bonus)",
        "Plant up to 1,040 trees",
        "Premium AI recommendations",
        "Fast-track verification",
        "Daily impact dashboard",
        "Exclusive community access",
        "Direct impact tracking",
      ],
    },
  ];

  const getColorClasses = (color: string, popular: boolean) => {
    const colors = {
      green: {
        border: popular
          ? "border-green-500"
          : "border-green-200 dark:border-green-800",
        bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20",
        button: "bg-green-600 hover:bg-green-700",
        icon: "text-green-600",
        iconBg: "bg-green-100 dark:bg-green-900/30",
      },
      blue: {
        border: popular
          ? "border-blue-500"
          : "border-blue-200 dark:border-blue-800",
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
        button: "bg-blue-600 hover:bg-blue-700",
        icon: "text-blue-600",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
      },
      purple: {
        border: popular
          ? "border-purple-500"
          : "border-purple-200 dark:border-purple-800",
        bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
        button: "bg-purple-600 hover:bg-purple-700",
        icon: "text-purple-600",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-background/50 dark:to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Choose Your Impact Level
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Subscribe monthly to support continuous reforestation efforts. Each
            tier provides points that directly fund tree planting and community
            verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const colors = getColorClasses(tier.color, tier.popular);

            return (
              <Card
                key={index}
                className={`relative ${colors.border} ${colors.bg} ${
                  tier.popular ? "scale-105 shadow-xl" : "shadow-lg"
                } transition-all hover:scale-105`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 rounded-full ${colors.iconBg} flex items-center justify-center mx-auto mb-4`}
                  >
                    <tier.icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold mb-1">{tier.price}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {tier.points} Points
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ {tier.trees} trees planted
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${colors.button} text-white`}
                    size="lg"
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            All subscriptions can be cancelled anytime. Points are distributed
            immediately upon payment confirmation.
          </p>
          <Button
            variant="outline"
            className="bg-white/80 dark:bg-background/80 backdrop-blur-sm"
          >
            Compare All Features
          </Button>
        </div>
      </div>
    </section>
  );
}
