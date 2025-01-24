import { ChatOpenAI } from "@langchain/openai";

import { env } from "@/env.mjs";

const cheapModels = {
  geminiFlashThinking: "google/gemini-2.0-flash-thinking-exp-1219:free",
  geminiFlash: "google/gemini-2.0-flash-exp:free",
  learnLm: "google/learnlm-1.5-pro-experimental:free",
  gemini15: "google/gemini-flash-1.5-exp",
  metallama3: "meta-llama/llama-3.1-70b-instruct:free",
  quen2: "qwen/qwen-2-7b-instruct:free",
  llama: "meta-llama/llama-3.1-8b-instruct:free",
  gemma: "google/gemma-2-9b-it:free",
} as const;

/**
 * Model used for RAG.
 */
export const activeModelName = cheapModels.gemma;

export const llm = new ChatOpenAI(
  {
    modelName: activeModelName,
    temperature: 0.6,
    streaming: true,
    openAIApiKey: env.OPENROUTER_API_KEY,
  },
  {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": env.NEXT_PUBLIC_APP_URL, // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "MitiMara Testing",
    }, // Optional. Site title for rankings on openrouter.ai.}
  }
);
