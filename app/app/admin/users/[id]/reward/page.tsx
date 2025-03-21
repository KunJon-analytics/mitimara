import { Suspense } from "react";
import {
  RewardUserContent,
  RewardUserSkeleton,
} from "./components/reward-user-content";

type RewardUserPageParams = {
  params: Promise<{ id: string }>;
};

export default async function RewardUserPage({ params }: RewardUserPageParams) {
  return (
    <div className="container mx-auto p-4 space-y-6 mb-16">
      <h1 className="text-2xl font-bold">User Points Management</h1>
      <Suspense fallback={<RewardUserSkeleton />}>
        <RewardUserContent params={params} />
      </Suspense>
    </div>
  );
}
