import React from "react";

import { $Enums } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/common/video-player";

type MediaModalProps = { type: $Enums.MediaType; url: string };

const MediaModal = ({ type, url }: MediaModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          {type === "IMAGE" ? "View Picture" : "View Video"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tree Evidence Media</DialogTitle>
        </DialogHeader>
        {type === "IMAGE" ? (
          <img
            src={url}
            alt="Tree evidence"
            className="w-full h-full p-4 object-cover rounded"
          />
        ) : (
          <VideoPlayer url={url} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
