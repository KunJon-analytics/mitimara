import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TreesIcon as Tree,
  Shield,
  Coins,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export function PointsSystemExplainer() {
  return (
    <section className="py-20" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Your Support Powers Our
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Dual-Points Ecosystem
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mitimara uses an innovative dual-points system that ensures real
            environmental impact while maintaining community-driven verification
            and preventing fraud.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Ecosystem Points */}
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Tree className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ecosystem Points</CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                  >
                    Primary Currency
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The main currency for environmental actions. Users spend these
                points to participate in tree planting and verification
                activities.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    Plant a tree: <strong>5 points</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    Verify a tree: <strong>3 points</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    Get AI tree recommendation: <strong>2 points</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-background/60 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  💡 Earned through: Successful tree planting, accurate
                  verification, and community participation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Policing Points */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Policing Points</CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    Quality Control
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Special points for community moderation and fraud prevention.
                These ensure the integrity of our ecosystem.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">
                    Report fake tree: <strong>1 point</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">
                    Contest false rejection: <strong>1 point</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">
                    Successful fraud detection: <strong>+2 bonus</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-background/60 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  🛡️ Earned through: Accurate fraud reporting, successful
                  appeals, and community moderation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Flow */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Your Donation Journey</h3>
              <p className="text-muted-foreground">
                See how your Pi tokens create real environmental impact
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4 bg-white/80 dark:bg-background/80 p-4 rounded-lg">
                <Coins className="w-8 h-8 text-amber-600" />
                <div>
                  <div className="font-semibold">1 Pi Token</div>
                  <div className="text-sm text-muted-foreground">
                    Your donation
                  </div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
              <div className="w-6 h-6 border-l-2 border-muted-foreground md:hidden"></div>

              <div className="flex items-center gap-4 bg-white/80 dark:bg-background/80 p-4 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">100</span>
                </div>
                <div>
                  <div className="font-semibold">100 Ecosystem Points</div>
                  <div className="text-sm text-muted-foreground">
                    Distributed to users
                  </div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
              <div className="w-6 h-6 border-l-2 border-muted-foreground md:hidden"></div>

              <div className="flex items-center gap-4 bg-white/80 dark:bg-background/80 p-4 rounded-lg">
                <Tree className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold">≈ 9 Trees Planted</div>
                  <div className="text-sm text-muted-foreground">
                    Real environmental impact
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
