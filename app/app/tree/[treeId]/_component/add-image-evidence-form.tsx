"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { PickerOverlay } from "filestack-react";
import { type PickerResponse } from "filestack-js";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { env } from "@/env.mjs";
import { Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import { addTreeEvidence } from "@/actions/tree/add-evidence";
import { TreeEvidenceSchema } from "@/lib/validations/tree";
import { LoadingAnimation } from "@/components/common/loading-animation";
import useProfile from "@/hooks/queries/use-profile";
import { MAX_FILE_SIZE } from "@/config/site";

type AddImageEvidenceFormProps = { treeId: string };

const AddImageEvidenceForm = ({ treeId }: AddImageEvidenceFormProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { accessToken, session } = useCurrentSession();
  const { data } = useProfile(session.id);

  const queryClient = useQueryClient();

  const onOpen = () => {
    // toast info message on what to do
    toast.info(
      "Image should capture the tree, tree code and any other landmark."
    );
  };

  function onUploadDone(result: PickerResponse) {
    startTransition(async () => {
      const url = result.filesUploaded[0]?.url;
      const handle = result.filesUploaded[0]?.handle;
      if (url) {
        const values: TreeEvidenceSchema = {
          accessToken,
          treeId,
          type: "IMAGE",
          url,
          handle,
        };
        try {
          const result = await addTreeEvidence(values);

          if (result.success) {
            toast.success("Evidence added successfully");
            // invalidate trees here too
            queryClient.invalidateQueries({
              queryKey: ["profile", session.id],
            });
          } else {
            // TODO: Handle error (e.g., show error message to user)
            toast.error(result.error);
            console.error(result.error);
          }
        } catch (error) {
          console.error(error);
          toast.error("Network error");
        }
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image Evidence</CardTitle>
        <CardDescription>
          Image should capture the tree, tree code and any other landmark.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showPicker && data && (
          <PickerOverlay
            apikey={env.NEXT_PUBLIC_FILESTACK_API_KEY}
            onUploadDone={onUploadDone}
            clientOptions={{ security: data.security }}
            pickerOptions={{
              accept: "image/*",
              fromSources: ["webcam"],
              maxFiles: 1,
              maxSize: MAX_FILE_SIZE,
              onClose: () => setShowPicker(false),
              onOpen,
              uploadConfig: { tags: { treeId, for: "TREE_EVIDENCE" } },
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => setShowPicker(true)}
          disabled={isPending}
        >
          {isPending ? <LoadingAnimation /> : "Add Image Evidence"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddImageEvidenceForm;
