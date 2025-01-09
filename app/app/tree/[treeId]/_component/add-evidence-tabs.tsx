import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddVideoEvidenceForm from "./add-video-evidence-form";
import AddImageEvidenceForm from "./add-image-evidence-form";

type AddEvidenceTabsProps = { treeId: string };

const AddEvidenceTabs = ({ treeId }: AddEvidenceTabsProps) => {
  return (
    <Tabs defaultValue="add-image" className="p-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add-image">Add Image</TabsTrigger>
        <TabsTrigger value="add-video">Add Video</TabsTrigger>
      </TabsList>
      <TabsContent value="add-image">
        <AddImageEvidenceForm treeId={treeId} />
      </TabsContent>
      <TabsContent value="add-video">
        <AddVideoEvidenceForm treeId={treeId} />
      </TabsContent>
    </Tabs>
  );
};

export default AddEvidenceTabs;
