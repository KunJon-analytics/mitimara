"use client";

import { Heart, Gift, TreesIcon as Tree, Users } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { subscriptionConfig } from "@/config/site";
import PaymentButton from "@/components/payments/payment-button";

export function DonationOptions() {
  const [customAmount, setCustomAmount] = useState(1);

  const quickAmounts = [
    { amount: 10, label: "Small Forest" },
    { amount: 25, label: "Community Grove" },
    { amount: 50, label: "Eco Warrior" },
    { amount: 100, label: "Forest Hero" },
  ];

  return (
    <section className="py-20" id="one-time-impact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Make a One-Time Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Prefer a one-time contribution? Your donation directly funds our
            community of tree planters and helps expand our global reforestation
            network.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Quick Donation Amounts */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Quick Donations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickAmounts.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/80 dark:bg-background/80 rounded-lg hover:bg-white dark:hover:bg-background transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Tree className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold">{option.amount} Pi</div>
                        <div className="text-sm text-muted-foreground">
                          ≈{" "}
                          {option.amount * subscriptionConfig.treesPlantedPerPi}{" "}
                          trees
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                      >
                        {option.label}
                      </Badge>
                      <PaymentButton
                        purpose="donate"
                        size="sm"
                        className="bg-green-600 rounded-md hover:bg-green-700"
                        buttonText={"Donate"}
                        defaultAmount={option.amount}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Amount */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  Custom Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter Pi Token Amount
                  </label>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Enter amount..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="text-lg h-12 bg-white/80 dark:bg-background/80"
                  />
                </div>

                {customAmount && customAmount > 0 && (
                  <div className="bg-white/80 dark:bg-background/80 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {(
                          customAmount * subscriptionConfig.userPointsPerPi
                        ).toLocaleString()}{" "}
                        Points
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Will fund approximately{" "}
                        <strong>
                          {Math.ceil(
                            customAmount * subscriptionConfig.treesPlantedPerPi
                          ).toLocaleString()}{" "}
                          trees
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                          <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                          <div>
                            ~{Math.ceil(customAmount * 4)} planters supported
                          </div>
                        </div>
                        <div className="text-center">
                          <Tree className="w-4 h-4 mx-auto mb-1 text-green-600" />
                          <div>
                            ~{Math.ceil(customAmount * 6.7)} verifications
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <PaymentButton
                  purpose="donate"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  disabled={!customAmount || customAmount <= 0}
                  buttonText={
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Donate {customAmount} Pi Tokens
                    </>
                  }
                  defaultAmount={customAmount}
                />
              </CardContent>
            </Card>
          </div>

          {/* Impact Guarantee */}
          {/* <Card className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">100% Impact Guarantee</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every Pi token you donate is converted to points and distributed
                directly to our community of tree planters. We provide full
                transparency with real-time tracking of how your donation
                creates environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="bg-white/80 dark:bg-background/80 backdrop-blur-sm"
                >
                  View Impact Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/80 dark:bg-background/80 backdrop-blur-sm"
                >
                  Read Our Transparency Report
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </section>
  );
}
