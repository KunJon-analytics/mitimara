"use client";

import { Suspense } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { AlertCircle, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProfileRewards from "@/hooks/queries/use-profile-rewards";
import { MIN_EXCHANGE_POINTS } from "@/config/site";
import useCurrentSession from "@/components/providers/session-provider";
import { ExchangeDataTable } from "./_components/exchange-data-table";
import { ExchangePointsModal } from "./_components/exchange-points-modal";

function PointExchangeContent() {
  const { session, isPending } = useCurrentSession();

  const { data, isLoading } = useProfileRewards(session.id);

  if (!session.isLoggedIn) {
    return (
      <p className="text-center text-muted-foreground">
        Please log in to see your unclaimed rewards.
      </p>
    );
  }

  if (isLoading || isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="text-destructive">
          There was an error. Please try again later.
        </CardHeader>
      </Card>
    );
  }

  const {
    points,
    nextClaimDate,
    hasPendingExchange,
    exchangeHistory,
    verifiedOrPlantedAuthTrees,
  } = data;

  const isClaimable = isPast(nextClaimDate);

  const hasEnoughPoints = points >= MIN_EXCHANGE_POINTS;

  return (
    <div className="flex flex-col items-center container mx-auto">
      <Tabs defaultValue="exchange">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exchange">Exchange Points</TabsTrigger>
          <TabsTrigger value="history">Exchange History</TabsTrigger>
        </TabsList>
        <TabsContent value="exchange" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Mitimara Points</CardTitle>
              <CardDescription>
                Convert your Mitimara points to Pi tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">Your Points: {points}</div>

              {hasPendingExchange && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Pending Exchange</AlertTitle>
                  <AlertDescription>
                    You have a pending point exchange. Please wait for it to be
                    processed.
                  </AlertDescription>
                </Alert>
              )}

              {!isClaimable && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Next Claim Available</AlertTitle>
                  <AlertDescription>
                    You can claim again{" "}
                    {formatDistanceToNow(nextClaimDate, { addSuffix: true })}
                  </AlertDescription>
                </Alert>
              )}

              {!verifiedOrPlantedAuthTrees && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Authentic Tree Planted / Verified</AlertTitle>
                  <AlertDescription>
                    You need to plant or verify at least one authentic tree.
                  </AlertDescription>
                </Alert>
              )}

              {!hasEnoughPoints && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Insufficient Points</AlertTitle>
                  <AlertDescription>
                    You need at least {MIN_EXCHANGE_POINTS} points to exchange.
                    You are {MIN_EXCHANGE_POINTS - points} points short.
                  </AlertDescription>
                </Alert>
              )}

              <ExchangePointsModal
                disabled={
                  !isClaimable ||
                  !hasEnoughPoints ||
                  hasPendingExchange ||
                  !verifiedOrPlantedAuthTrees
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mb-16">
          <Card className="min-w-full">
            <CardHeader>
              <CardTitle>Exchange History</CardTitle>
              <CardDescription>
                Your past point exchange transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <ExchangeDataTable data={exchangeHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PointExchangePage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Point Exchange</h1>
      <Suspense fallback={<PointExchangeSkeleton />}>
        <PointExchangeContent />
      </Suspense>
    </div>
  );
}

function PointExchangeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </Card>
    </div>
  );
}
