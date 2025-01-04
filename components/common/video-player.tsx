"use client";

import React from "react";
import ReactPlayer from "react-player/youtube";

type VideoPlayerProps = {
  url: string;
  height?: string | number;
  width?: string | number;
};

const VideoPlayer = (props: VideoPlayerProps) => {
  return (
    // Only loads the YouTube player
    <ReactPlayer {...props} controls />
  );
};

export default VideoPlayer;
