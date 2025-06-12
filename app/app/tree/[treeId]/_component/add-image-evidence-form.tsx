import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import CloudinaryButton from "./cloudinary-button";

type AddImageEvidenceFormProps = { treeId: string };

const AddImageEvidenceForm = ({ treeId }: AddImageEvidenceFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image Evidence</CardTitle>
        <CardDescription>
          Image should capture the tree, tree code and any other landmark.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CloudinaryButton treeId={treeId} />
      </CardFooter>
    </Card>
  );
};

export default AddImageEvidenceForm;
