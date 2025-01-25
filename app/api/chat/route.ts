import { NextResponse } from "next/server";
import { LangChainAdapter, Message as VercelChatMessage } from "ai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { togetherAIModel as model } from "@/ai/utils/llm";
import { vectorStore } from "@/ai/utils/vectore-store";
import { answerPrompt, condenseQuestionPrompt } from "./_utils/prompts";
import { combineDocumentsFn, formatVercelMessages } from "./_utils/helpers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
  try {
    const body = await req.json();

    const messages: VercelChatMessage[] = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    /**
     * We use LangChain Expression Language to compose two chains.
     * To learn more, see the guide here:
     *
     * https://js.langchain.com/docs/guides/expression_language/cookbook
     *
     * You can also use the "createRetrievalChain" method with a
     * "historyAwareRetriever" to get something prebaked.
     */
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const retriever = vectorStore.asRetriever();

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new StringOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e) {
    console.error({ e });
    if (e instanceof Error) {
      // Inside this block, err is known to be a Error

      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
