import { treeLogicConfig } from "@/config/site";
import ProfileStats from "./_components/profile-stats";
import LogicLink from "./_components/logic-link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ProfileStats />

      <div className="grid gap-4 md:grid-cols-3">
        <LogicLink
          bodyText="Submit a new tree planting entry and earn rewards!"
          buttonText="Plant Tree"
          link="/app/plant-tree"
          minPoints={treeLogicConfig.minPlanterPoints}
          title="Plant a Tree"
        />
        <LogicLink
          bodyText=" Help verify other users' tree plantings and earn rewards!"
          buttonText="Verify Trees"
          link="/app/verify-tree"
          minPoints={treeLogicConfig.minVerifierPoints}
          title="Verify Trees"
        />
        <LogicLink
          bodyText="View and manage your unverified planted trees."
          buttonText="View My Trees"
          link="/app/my-trees"
          minPoints={0}
          title="My Unverified Trees"
        />
      </div>
    </div>
  );
}
