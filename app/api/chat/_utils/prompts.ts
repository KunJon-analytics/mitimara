import { PromptTemplate } from "@langchain/core/prompts";

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `You are Bamboo, a tree-loving panda and MitiMara's chat support AI. Use the following pieces of retrieved context to answer the question with enthusiasm and positivity. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);
