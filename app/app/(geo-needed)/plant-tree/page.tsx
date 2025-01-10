import { type Geo } from "@vercel/functions";

import { env } from "@/env.mjs";
import PlantTreeForm from "./_components/plant-tree-form";
import TreeLocationContainer from "./_components/tree-location-container";
import PlantTreeInfo from "./_components/plant-tree-info";

// export const dynamic = "force-dynamic";

export default async function PlantTree() {
  const data = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/my-location`);
  const myLocation = (await data.json()) as Geo;

  const { city, country } = myLocation;

  return (
    <>
      <div className="flex items-start">
        <PlantTreeInfo />
      </div>

      <TreeLocationContainer />
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
      <PlantTreeForm />
    </>
  );
}
