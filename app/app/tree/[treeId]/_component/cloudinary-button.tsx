"use client";

import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import { addTreeEvidence } from "@/actions/tree/add-evidence";

type CloudinaryButtonProps = { treeId: string };

const CloudinaryButton = ({ treeId }: CloudinaryButtonProps) => {
  const router = useRouter();
  const { accessToken, session } = useCurrentSession();
  const [savingImage, setSavingImage] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset="mitimara"
      signatureEndpoint={`/api/sign-cloudinary-params?accessToken=${accessToken}&treeId=${treeId}`}
      options={{
        sources: ["local", "camera"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["image"],
        maxFileSize: 1000000,
        singleUploadAutoClose: true,
      }}
      onSuccess={async (results) => {
        try {
          if (
            typeof results?.info === "object" &&
            "secure_url" in results.info
          ) {
            console.log("Public ID", results.info.public_id);
            setSavingImage(true);
            const toastId = toast.loading("Saving tree evidence");
            const result = await addTreeEvidence({
              accessToken,
              treeId,
              type: "IMAGE",
              url: results.info.secure_url,
              handle: results.info.public_id,
            });
            if (result.success) {
              toast.success("Evidence added successfully", { id: toastId });
              // invalidate trees here too (probably nearby tree route too)

              router.refresh();
            } else {
              // TODO: Handle error (e.g., show error message to user)
              toast.error(result.error, { id: toastId });
              console.log(result.error);
            }
          }
        } catch (error) {
          console.log(error);
          toast.error("Network error");
        } finally {
          setSavingImage(false);
        }
      }}
    >
      {({ open }) => {
        return (
          <Button
            className="w-full"
            type="button"
            onClick={() => open()}
            disabled={!session.isLoggedIn || savingImage}
          >
            {savingImage ? "Saving Image..." : "Upload an Image"}
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default CloudinaryButton;
