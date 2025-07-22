import {
  PieChart,
  BarChart3,
  Shield,
  Eye,
  FileText,
  ExternalLink,
  TreesIcon as Tree,
  Users,
  Coins,
  Globe,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSiteStats } from "@/lib/services/stats";
import { ACTIVE_COUNTRIES } from "@/config/site";
import { numberFormatter } from "@/lib/utils";
import { env } from "@/env.mjs";
import ComingSoonButton from "./coming-soon-button";
import PaymentButton from "@/components/payments/payment-button";

export async function TransparencySection() {
  const { pots, users, trees, totalBalance } = await getSiteStats();

  const impactMetrics = [
    {
      label: "Trees Planted",
      value: numberFormatter(trees),
      icon: Tree,
      color: "text-green-600",
    },
    {
      label: "Active Users",
      value: numberFormatter(users),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Pi Tokens Distributed",
      value: numberFormatter(totalBalance ?? 0),
      icon: Coins,
      color: "text-amber-600",
    },
    {
      label: "Countries Active",
      value: ACTIVE_COUNTRIES,
      icon: Globe,
      color: "text-pi",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-background/50 dark:to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Complete Transparency
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built on blockchain technology, every donation and its impact is
            publicly verifiable. See exactly how your contribution creates real
            environmental change.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {/* Funding Breakdown */}
          <Card className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                Fund Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                See how every Pi token donation is allocated across our
                ecosystem
              </p>

              {pots
                ?.sort((a, b) => b.revenueFraction - a.revenueFraction)
                .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.balance.toFixed(2)} Pi
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {(item.revenueFraction * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={item.revenueFraction * 100}
                      className="h-2"
                    />
                  </div>
                ))}

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 All allocations are automatically executed and publicly
                  auditable on the Pi blockchain
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Impact */}
          <Card className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                Live Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Real-time data from our global reforestation network
              </p>

              <div className="grid grid-cols-2 gap-4">
                {impactMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-muted/30 rounded-lg"
                  >
                    <metric.icon
                      className={`w-6 h-6 ${metric.color} mx-auto mb-2`}
                    />
                    <div className="text-2xl font-bold mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <p className="text-xs text-green-700 dark:text-green-400">
                  🌱 Updated every 10 minutes from verified tree planting
                  activities worldwide
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification & Audit */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Verified</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Every transaction and tree planting is recorded on the Pi
                blockchain for permanent verification
              </p>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-background/80"
                asChild
              >
                <Link
                  href={`${env.PI_EXPLORER_LINK}/accounts/${env.NEXT_PUBLIC_WALLET_ADDRESS}`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Community Audited</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our community of verifiers ensures every tree is real and
                properly planted
              </p>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="bg-white/80 dark:bg-background/80"
              >
                <Link href="/app/verify-tree">
                  <Users className="w-4 h-4 mr-2" />
                  Join Verifiers
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our entire platform is open source and regularly audited by
                security experts
              </p>
              <ComingSoonButton />
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join thousands of environmental champions who trust Mitimara to
              create real, verified impact in the fight against climate change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PaymentButton
                purpose="subscribe"
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 rounded-md"
                buttonText={"Start Your Subscription"}
              />
              <PaymentButton
                purpose="donate"
                size="lg"
                className="border-white text-white hover:bg-white/10 bg-transparent rounded-md"
                buttonText={"Make a One-Time Donation"}
                defaultAmount={100}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
