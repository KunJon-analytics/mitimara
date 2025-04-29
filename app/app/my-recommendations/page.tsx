import { Suspense } from "react";

import RecommendationsList from "./_components/recommendation-list";
import RecommendationsListSkeleton from "./_components/recommendation-list-skeleton";

export default function MyRecommendationsPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl mb-16">
      <h1 className="text-2xl font-bold mb-6">My Tree Recommendations</h1>

      <Suspense fallback={<RecommendationsListSkeleton />}>
        <RecommendationsList />
      </Suspense>
    </div>
  );
}
