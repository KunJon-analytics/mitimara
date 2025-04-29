import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { env } from "@/env.mjs";
import { ragModelName, recommendationModel } from "./llm";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const ragModel = openrouter(ragModelName);
export const recAgentModel = openrouter(recommendationModel);
