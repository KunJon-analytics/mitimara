"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "ai/react";
import { toast } from "sonner";

import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import CodeDisplayBlock from "./code-display-block";
import { MemoizedMarkdown } from "./memoized-markdown";
import ChatInputForm from "./chat-input-form";
import useCurrentSession from "../providers/session-provider";

export default function ChatSupport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { session } = useCurrentSession();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      // experimental_throttle: 50,
      api: "/api/ai-chat",
      onResponse(response) {
        if (response) {
          console.log(response);
          setIsGenerating(false);
        }
      },
      onError(error) {
        toast.error(`Error while processing your request`, {
          description: "please come back later or chat us up on telegram",
        });
        console.log({ error: error });
        setIsGenerating(false);
      },
    });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    handleSubmit(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  if (!session.isLoggedIn) {
    return null;
  }

  return (
    <ExpandableChat
      icon={<Bot className="h-6 w-6" />}
      size="md"
      position="bottom-right"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Chat with our AI ✨</h1>
        <p>Ask any question for our AI to answer</p>
        <div className="flex gap-2 items-center pt-2">
          <Button variant="secondary" asChild>
            <Link href={"/telegram"}>Telegram</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={"/#faq"}>See FAQ</Link>
          </Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList
          ref={messagesContainerRef}
          className="dark:bg-muted/40"
        >
          <AnimatePresence>
            {messages &&
              messages.map((message, index) => {
                return (
                  <motion.div
                    key={`motion-div-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1 },
                      layout: {
                        type: "spring",
                        bounce: 0.3,
                        duration: index * 0.05 + 0.2,
                      },
                    }}
                    style={{ originX: 0.5, originY: 0.5 }}
                    className="flex flex-col"
                  >
                    <ChatBubble
                      key={message.id}
                      variant={message.role === "user" ? "sent" : "received"}
                    >
                      <ChatBubbleAvatar
                        fallback={message.role === "user" ? "👨🏽" : "🤖"}
                      />
                      <ChatBubbleMessage>
                        {message.content ? (
                          message.content
                            .split("```")
                            .map((part: string, index: number) => {
                              if (index % 2 === 0) {
                                return (
                                  <MemoizedMarkdown
                                    id={`${message.id}-index_${index}`}
                                    key={`${message.id}-index_${index}`}
                                    content={part}
                                  />
                                );
                              } else {
                                return (
                                  <pre
                                    className="whitespace-pre-wrap pt-2"
                                    key={index}
                                  >
                                    <CodeDisplayBlock code={part} />
                                  </pre>
                                );
                              }
                            })
                        ) : (
                          <span className="italic font-light">
                            {"calling tool: " +
                              message?.toolInvocations?.[0].toolName}
                          </span>
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <ChatInputForm
          handleInputChange={handleInputChange}
          input={input}
          isLoading={isLoading}
          onKeyDown={onKeyDown}
          onSubmit={onSubmit}
        />
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
