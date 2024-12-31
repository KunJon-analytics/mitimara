import Link from "next/link";
import { type Geo } from "@vercel/functions";
import { ChevronLeft } from "lucide-react";

import { env } from "@/env.mjs";
import { Button } from "@/components/ui/button";
import TreeMap from "./_components/tree-map";
import PlantTreeForm from "./_components/plant-tree-form";

export const dynamic = "force-dynamic";

export default async function PlantTree() {
  const data = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/my-location`);
  const myLocation = (await data.json()) as Geo | null;

  if (!myLocation) {
    return <div className="text-center p-4">Loading your location...</div>;
  }

  const { latitude, longitude, city, country } = myLocation;

  if (!latitude || !longitude) {
    return <div className="text-center p-4">Invalid Location...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <Button variant="ghost" asChild className="p-2">
          <Link href="/app">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Plant a Tree</h1>
      </div>
      <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
        <TreeMap latitude={latitude} longitude={longitude} />
      </div>
      <div className="text-center">
        {city && country && (
          <>
            <p className="font-semibold">Your current location:</p>
            <p>
              {city}, {country}
            </p>
          </>
        )}
        <p className="mt-4">
          Is this the exact location where you planted the tree?
        </p>
      </div>
      <PlantTreeForm
        latitude={parseFloat(latitude)}
        longitude={parseFloat(longitude)}
      />
    </div>
  );
}
