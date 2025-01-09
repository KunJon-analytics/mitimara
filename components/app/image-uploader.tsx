"use client";

import { useState } from "react";
import { PickerOverlay } from "filestack-react";
import { type PickerResponse } from "filestack-js";
import { toast } from "sonner";

import { env } from "@/env.mjs";
import { Button } from "../ui/button";

const ImageUploader = () => {
  const [showPicker, setShowPicker] = useState(false);

  const onOpen = () => {
    // toast info message on what to do
    toast.info("Upload your plant image with the code");
  };

  const onUploadDone = (result: PickerResponse) => {};

  return (
    <>
      {showPicker && (
        <PickerOverlay
          apikey={env.NEXT_PUBLIC_FILESTACK_API_KEY}
          onUploadDone={onUploadDone}
          pickerOptions={{
            accept: "image/*",
            fromSources: ["webcam"],
            maxFiles: 1,
            maxSize: 1 * 1024 * 1024,
            onClose: () => setShowPicker(false),
            onOpen,
          }}
        />
      )}
      <Button onClick={() => setShowPicker(true)}>Upload File</Button>
    </>
  );
};

export default ImageUploader;
