import { Shell } from "@/components/common/shell";
import { getSiteStats } from "@/lib/services/stats";
import { numberFormatter } from "@/lib/utils";

export async function Stats() {
  const siteStats = await getSiteStats();

  return (
    <Shell>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-16">
        <div className="text-center">
          <h1 className="text-3xl">{numberFormatter(siteStats.users)}</h1>
          <p className="font-light text-muted-foreground">Active Users</p>
        </div>
        <div className="text-center">
          <h1 className="text-3xl">{numberFormatter(siteStats.trees)}</h1>
          <p className="font-light text-muted-foreground">Trees Planted</p>
        </div>
        <div className="text-center">
          <h1 className="text-3xl">
            {numberFormatter(siteStats.treeVerifications)}
          </h1>
          <p className="font-light text-muted-foreground">Tree Verifications</p>
        </div>
      </div>
    </Shell>
  );
}
