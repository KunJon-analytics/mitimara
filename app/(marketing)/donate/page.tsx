import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { DonateHero } from "./_components/donate-hero";
import { ImpactStats } from "./_components/impact-stats";
import { PointsSystemExplainer } from "./_components/points-system-explainer";
import { TransparencySection } from "./_components/transparency-section";
import { DonationOptions } from "./_components/donation-options";
// import { SubscriptionTiers } from "./_components/subscription-tiers";
// import { CommunityTestimonials } from "./_components/community-testimonials";

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <DonateHero />

      {/* Impact Statistics */}
      <Suspense fallback={<ImpactStatsSkeleton />}>
        <ImpactStats />
      </Suspense>

      {/* Points System Explanation */}
      <PointsSystemExplainer />

      {/* Subscription Tiers */}
      {/* <SubscriptionTiers /> */}

      {/* One-time Donations */}
      <DonationOptions />

      {/* Community Testimonials */}
      {/* <CommunityTestimonials /> */}

      {/* Transparency */}
      <TransparencySection />
    </div>
  );
}

function ImpactStatsSkeleton() {
  return (
    <section className="py-16 bg-white/50 dark:bg-background/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
