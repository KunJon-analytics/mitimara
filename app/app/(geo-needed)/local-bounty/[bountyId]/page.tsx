import { notFound } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBountyHuntById } from "@/lib/services/bounty-hunt";
import { GeneralTab } from "./_components/general-tab";
import { StatsTab } from "./_components/stats-tab";
import { LocationTab } from "./_components/location-tab";

type BountyHuntDetailPageParams = { params: Promise<{ bountyId: string }> };

export default async function BountyHuntDetailPage({
  params,
}: BountyHuntDetailPageParams) {
  const bountyHunt = await getBountyHuntById((await params).bountyId);

  if (!bountyHunt) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 space-y-6 mb-16 sm:max-w-lg">
      <h1 className="text-2xl font-bold">{bountyHunt.title}</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralTab bountyHunt={bountyHunt} />
        </TabsContent>
        <TabsContent value="stats">
          <StatsTab bountyHunt={bountyHunt} />
        </TabsContent>
        <TabsContent value="location">
          <LocationTab bountyHunt={bountyHunt} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
