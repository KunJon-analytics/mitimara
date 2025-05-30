"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import useCurrentSession from "@/components/providers/session-provider";
import { UploadButton } from "@/lib/uploadthing/client";

type AddImageEvidenceFormProps = { treeId: string };

const AddImageEvidenceForm = ({ treeId }: AddImageEvidenceFormProps) => {
  const { accessToken } = useCurrentSession();
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image Evidence</CardTitle>
        <CardDescription>
          Image should capture the tree, tree code and any other landmark.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <UploadButton
          endpoint="treeVerificationImageUpload"
          className="w-full ut-button:bg-primary ut-button:ring-0 ut-button:text-primary-foreground ut-button:ut-readying:bg-primary/50"
          input={{ accessToken, treeId }}
          onClientUploadComplete={() => {
            // Do something with the response

            toast.success("Evidence added successfully");
            // invalidate trees here too (probably nearby tree route too)
            router.refresh();
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast.error(error.message);
            console.log(error);
          }}
        />
      </CardFooter>
    </Card>
  );
};

export default AddImageEvidenceForm;
