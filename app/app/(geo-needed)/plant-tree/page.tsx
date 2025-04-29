import PlantTreeForm from "./_components/plant-tree-form";
import TreeLocationContainer from "./_components/tree-location-container";
import PlantTreeInfo from "./_components/plant-tree-info";
import { TreeRecommendation } from "./_components/tree-recommendation";

export default function PlantTree() {
  return (
    <div className="flex flex-col items-center space-y-4 p-4 -mt-2">
      <div className="flex justify-between items-center">
        <p className="font-bold">Plant Tree</p>
        <PlantTreeInfo />
        <TreeRecommendation />
      </div>

      <TreeLocationContainer />
      <div className="text-center">
        <p className="mt-4">
          Is this the exact location where you planted the tree?
        </p>
      </div>
      <PlantTreeForm />
    </div>
  );
}
