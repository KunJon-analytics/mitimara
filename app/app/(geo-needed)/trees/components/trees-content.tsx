import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { numberFormatter } from "@/lib/utils";
import { getTrees } from "../services";
import { TreesMap } from "../components/trees-map";
import { TreesFilters } from "../components/trees-filters";
import { searchParamsCache } from "../searchParams";

async function TreesContent() {
  const searchParams = searchParamsCache.all();

  const trees = await getTrees(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trees Map</h1>
          <p className="text-muted-foreground">
            Explore trees in your area and help verify plantings
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {numberFormatter(trees.length)} tree
          {trees.length !== 1 ? "s" : ""}
        </div>
      </div>

      <TreesFilters />

      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
        </CardHeader>
        <CardContent>
          <TreesMap trees={trees} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
          <span>Unverified Trees</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Verified Trees</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Rejected Trees</span>
        </div>
      </div>
    </div>
  );
}

export default TreesContent;
