import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Coins, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getExchangeDetails } from "@/lib/services/exchange";
import {
  getExchangeStatus,
  getExchangeStatusBadge,
} from "@/lib/exchanges/utils";

async function ExchangeDetailContent({ id }: { id: string }) {
  const exchange = await getExchangeDetails(id);

  if (!exchange) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Exchange Details</span>
          <Badge variant={getExchangeStatusBadge(exchange.status)}>
            {getExchangeStatus(exchange.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Amount:</span>
          <span>{exchange.amount} Pi</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Points Traded:</span>
          <span>{exchange.pointsTraded} points</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Type:</span>
          <span>{exchange.type}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Last Exchange:</span>
          <span>{exchange.lastExchange.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Initiated On:</span>
          <span>{exchange.createdAt.toLocaleDateString()}</span>
        </div>
        {exchange.piTransactionLink && (
          <div className="flex items-center">
            <Coins className="mr-2 h-4 w-4" />
            <span className="font-semibold mr-2">Pi Transaction:</span>
            <Link
              href={exchange.piTransactionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              View on Explorer
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function ExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Exchange Detail</h1>
      <Suspense fallback={<ExchangeDetailSkeleton />}>
        <ExchangeDetailContent id={id} />
      </Suspense>
    </div>
  );
}

function ExchangeDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
