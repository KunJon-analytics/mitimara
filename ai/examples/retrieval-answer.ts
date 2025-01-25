import { Document } from "@langchain/core/documents";
import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";

import { vectorStore } from "../utils/vectore-store";
import { getRagPromptTemplate } from "../utils/pull";
import { openrouterChatModel as llm } from "../utils/llm";

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

// retrieve similar docs from vector store
const retrieve = async (state: typeof InputStateAnnotation.State) => {
  console.log("Retrieving similar docs for question: ", state.question);
  const retrievedDocs = await vectorStore.similaritySearch(state.question, 2);
  console.log(
    "Completed Retrieving similar docs for question: ",
    state.question
  );
  return { context: retrievedDocs };
};

// generate context aware answer using retrieved context docs
const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");

  console.log("Getting RAG prompt template");
  const promptTemplate = await getRagPromptTemplate();
  console.log("Done getting RAG prompt template");

  console.log("Invoking RAG prompt template");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  console.log({ docsContent });
  console.log("Done invoking RAG prompt template");

  console.log("Invoking LLM");
  const response = await llm.invoke(messages);
  console.log("Done invoking LLM");

  return { answer: response.content };
};

const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();

export async function retrieveAnswer(question: string) {
  let inputs = { question };

  const result = await graph.invoke(inputs);
  console.log(result.context.slice(0, 2));
  console.log(`\nAnswer: ${result["answer"]}`);
}
