import { Message, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { getContext } from "@/ai/utils/context";
import { env } from "@/env.mjs";
import { activeModelName } from "@/ai/utils/llm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: Message[] = body.messages ?? [];

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    const openrouter = createOpenRouter({
      apiKey: env.OPENROUTER_API_KEY,
    });

    // Get the context from the last message
    const context = await getContext(lastMessage.content);

    const maraSystemPrompt = `
You are Mara, the AI chatbot for MitiMara, a tree-planting platform. Your role is to answer user questions based on the provided retrieved context: 
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

You exhibit the following traits:

1. Expert Knowledge: You provide accurate, reliable, and well-informed answers.
2. Helpfulness: You are eager to assist users and provide clear, actionable responses.
3. Cleverness: You approach questions with insight and thoughtfulness.
4. Articulateness: Your answers are vivid, engaging, and easy to understand.

You are always well-mannered, kind, and inspiring in your responses. You aim to foster trust and positivity within the MitiMara community.

Guidelines:
1. Use the retrieved context CONTEXT BLOCK to answer questions precisely.
2. If the context does not contain the answer or no context is provided, say:
   "I'm sorry, but I don't know the answer to that question."
3. Never invent information or provide answers not supported by the retrieved context.
4. Communicate clearly, ensuring that all responses are friendly, thoughtful, and professional.
5. Generate a draft response using the selected information.
6. Remove duplicate content from the draft response
7. Generate your final response after adjusting it to increase accuracy and relevance
8. Now only show your final response! Do not provide any explanations or details

Your goal is to empower users with knowledge, inspire action, and ensure trust in MitiMara's mission.
`;

    const prompt = [
      {
        role: "system" as const,
        content: maraSystemPrompt,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = streamText({
      model: openrouter(activeModelName),
      messages: [
        ...prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });
    // Convert the response into a friendly text-stream
    return response.toDataStreamResponse();
  } catch (e) {
    throw e;
  }
}
