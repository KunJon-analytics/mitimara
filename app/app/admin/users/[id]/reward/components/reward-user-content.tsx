import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserForAdmin } from "../../service";
import { RewardUserForm } from "./reward-user-form";

export async function RewardUserContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getUserForAdmin(userId);
  if (!user) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward or Penalize User</CardTitle>
        <CardDescription>
          Modify {user.username}
          {"'"}s points balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <p className="text-sm font-medium mb-1">Current Ecosystem Points</p>
            <p className="text-2xl font-bold">{user.points}</p>
          </div>
          <div className="p-4 border rounded-md">
            <p className="text-sm font-medium mb-1">Current Policing Points</p>
            <p className="text-2xl font-bold">{user.policingPoints}</p>
          </div>
        </div>
        <RewardUserForm userId={userId} />
      </CardContent>
    </Card>
  );
}

export function RewardUserSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
