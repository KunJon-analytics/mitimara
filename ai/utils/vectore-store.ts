import { PineconeEmbeddings, PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

import { env } from "@/env.mjs";
import { namespace } from "./constants";

const embeddings = new PineconeEmbeddings({
  model: "multilingual-e5-large",
});

export const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);

export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
  namespace,
});
