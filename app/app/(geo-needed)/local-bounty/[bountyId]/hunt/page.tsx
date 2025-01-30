import { notFound } from "next/navigation";

import { getActiveContest } from "@/lib/services/bounty-hunt";
import PlantTreeForm from "../../../plant-tree/_components/plant-tree-form";
import PlantTreeInfo from "../../../plant-tree/_components/plant-tree-info";
import TreeLocationContainer from "../../../plant-tree/_components/tree-location-container";
import GeneralInfoModal from "../_components/general-info-modal";

type PlantBountyTreeProps = { params: Promise<{ bountyId: string }> };

export default async function PlantBountyTree({
  params,
}: PlantBountyTreeProps) {
  const bountyId = (await params).bountyId;
  const activeBounty = await getActiveContest(bountyId);

  if (!activeBounty) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 -mt-2 mb-16">
      <div className="flex justify-between items-center">
        <p className="font-bold">Plant Tree</p>
        <PlantTreeInfo />
        <GeneralInfoModal className="ml-2" localHunt={activeBounty} />
      </div>

      <TreeLocationContainer localBounty={activeBounty} />
      <div className="text-center">
        <p className="mt-4">
          Is this the exact location where you planted the tree?
        </p>
      </div>
      <PlantTreeForm localhunt={activeBounty} />
    </div>
  );
}
