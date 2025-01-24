import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

export const getRagPromptTemplate = async () => {
  return pull<ChatPromptTemplate>("rlm/rag-prompt");
};
