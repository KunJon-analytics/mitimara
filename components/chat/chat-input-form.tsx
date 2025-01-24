"use client";

import React from "react";
import { Send } from "lucide-react";

import { ChatInput } from "../ui/chat/chat-input";
import { Button } from "../ui/button";
import { LoadingAnimation } from "../common/loading-animation";

type ChatInputProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  isLoading: boolean;
};

const ChatInputForm = ({
  onSubmit,
  onKeyDown,
  input,
  handleInputChange,
  isLoading,
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex relative gap-2">
      <ChatInput
        onKeyDown={onKeyDown}
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <Button
        disabled={!input || isLoading}
        type="submit"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 shrink-0"
      >
        {isLoading ? <LoadingAnimation /> : <Send className="size-4" />}
      </Button>
    </form>
  );
};

export default ChatInputForm;
