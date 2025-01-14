import PlantTreeForm from "./_components/plant-tree-form";
import TreeLocationContainer from "./_components/tree-location-container";
import PlantTreeInfo from "./_components/plant-tree-info";

export default async function PlantTree() {
  return (
    <>
      <div className="flex items-start">
        <PlantTreeInfo />
      </div>

      <TreeLocationContainer />
      <div className="text-center">
        <p className="mt-4">
          Is this the exact location where you planted the tree?
        </p>
      </div>
      <PlantTreeForm />
    </>
  );
}
