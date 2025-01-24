import { ChatOpenAI } from "@langchain/openai";

import { env } from "@/env.mjs";

const cheapModels = {
  rougeRose: "sophosympatheia/rogue-rose-103b-v0.2:free", // big time story teller. lol
  learnLm: "google/learnlm-1.5-pro-experimental:free", // very strict passed the dog test.
  // strict, powerful but can be a bit slow. cheap on sambanova (fav now)
  // cheaper on novita just that it's not openrouter provider
  metallama323: "meta-llama/llama-3.2-3b-instruct:free",
  // hallucinates a lot, repeats question. cheapest on sambanova
  metallama321: "meta-llama/llama-3.2-1b-instruct:free",
  // very sharp but expensive since it is for vision
  metallama3290: "meta-llama/llama-3.2-90b-vision-instruct:free",
  // also sharp, too detailed (using site theme lol, probably clean data).
  // Also on together ai (start free) (2nd fave)
  metallama3211: "meta-llama/llama-3.2-11b-vision-instruct:free",
  // also good third cheapest
  metallama318: "meta-llama/llama-3.1-8b-instruct:free",
  //very sharp too but too expensive
  metallama3170: "meta-llama/llama-3.1-70b-instruct:free",
  // love it too, also cheap on novita, it is direct. love it too
  // on a good 2nd place with metallama3211
  quen27: "qwen/qwen-2-7b-instruct:free",
  // act like a baby, talks cheap and still more expensive
  // than metallama323 on deepinfra
  gemma: "google/gemma-2-9b-it:free",
} as const;

/**
 * Model used for RAG.
 */
export const activeModelName = cheapModels.metallama323;

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
