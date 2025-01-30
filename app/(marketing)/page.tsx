import { Suspense } from "react";

import { FAQs } from "@/components/marketing/home/faqs";
import { Hero } from "@/components/marketing/home/hero";
import HowItWorks from "@/components/marketing/home/how-it-works";
import { Stats } from "@/components/marketing/home/stats";
import StatsSkeleton from "@/components/marketing/home/stats-skeleton";
import { SlidingBanner } from "@/components/marketing/home/sliding-banner";
import { SlidingBannerSkeleton } from "@/components/marketing/home/sliding-banner-skeleton";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="grid gap-12">
      <div className="w-full mx-auto mb-8">
        <Suspense fallback={<SlidingBannerSkeleton />}>
          <SlidingBanner />
        </Suspense>
      </div>
      <Hero />
      <HowItWorks />
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <FAQs />
    </div>
  );
}
