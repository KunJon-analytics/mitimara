"use client";

import React from "react";
import { YouTubeEmbed } from "@next/third-parties/google";

import { validateYouTubeUrl } from "@/lib/validations/tree";

type VideoPlayerProps = {
  url: string;
  height?: number;
  width?: number;
};

const VideoPlayer = ({ url, height, width }: VideoPlayerProps) => {
  const videoid = validateYouTubeUrl(url);

  if (!videoid) {
    return null;
  }

  return (
    // Only loads the YouTube player
    <YouTubeEmbed
      videoid={videoid}
      height={height}
      width={width}
      params="controls=1"
    />
  );
};

export default VideoPlayer;
