import { Card, CardContent } from "@/components/ui/card";
import { numberFormatter } from "@/lib/utils";
import { getTrees } from "../services";
import { TreesMap } from "../components/trees-map";
import { TreesFilters } from "../components/trees-filters";
import { searchParamsCache } from "../searchParams";
import UserLocationLegend from "./user-location-legend";

async function TreesContent() {
  const searchParams = searchParamsCache.all();

  const trees = await getTrees(searchParams);

  return (
    <div className="h-screen flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Trees Map</h1>
            <p className="text-sm text-muted-foreground">
              {numberFormatter(trees.length)} tree
              {trees.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <TreesFilters />
        </div>
      </div>

      {/* Map - Takes remaining space */}
      <div className="flex-1 relative">
        <TreesMap trees={trees} />

        {/* Legend - Floating overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-background/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Unverified</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Rejected</span>
                </div>
                <UserLocationLegend />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TreesContent;
