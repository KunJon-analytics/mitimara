import { TreesIcon as Tree, Heart, Globe, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PaymentButton from "@/components/payments/payment-button";

export function DonateHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-grid-pattern opacity-5"></div> */}

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="default" className="mb-6 px-4 py-2 text-sm">
            <Heart className="w-4 h-4 mr-2" />
            Join the Green Revolution
          </Badge>

          {/* Main Headline */}
          <h1
            className={cn(
              "text-4xl text-foreground md:text-6xl mb-6 font-bold",
              "bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent"
            )}
          >
            Plant Trees,
            <br />
            Change the World
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl mb-8 leading-relaxed">
            Support Mitimara&apos;s mission to create a decentralized,
            community-driven reforestation network. Your contribution powers our
            dual-points ecosystem that rewards real environmental action.
          </p>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 bg-white/60 dark:bg-background/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Tree className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Real Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Every point funds verified tree planting and community
                  verification
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 dark:bg-background/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-warning mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by local communities who plant and verify trees
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 dark:bg-background/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 text-pi mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Global Scale</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain-powered transparency across all continents
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PaymentButton
              purpose="donate"
              size="lg"
              className="px-8 py-6 text-lg rounded-none"
              buttonText={
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Start Supporting Now
                </>
              }
            />
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg backdrop-blur-sm"
              asChild
            >
              <Link href={"#how-it-works"}> Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
