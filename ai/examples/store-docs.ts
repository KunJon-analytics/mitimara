import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";

import { namespace } from "../utils/constants";
import { vectorStore } from "../utils/vectore-store";
import { loadSiteDocuments } from "../utils/load-site-documents";

export async function storeDocs(siteUrl: string) {
  const docs = await loadSiteDocuments(siteUrl);

  console.log(`Splitting ${docs.length} site pages.`);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 20,
  });
  const transformer = new HtmlToTextTransformer();
  const sequence = splitter.pipe(transformer);

  const newDocuments = await sequence.invoke(docs);
  console.log(
    `Splitted ${docs.length} site files. into ${newDocuments.length} sub-documents.`
  );

  // delete previous namespace
  console.log("deleting previous namespace");
  await vectorStore.delete({ deleteAll: true, namespace });
  console.log("completed deleting previous namespace");

  console.log(`Storing ${newDocuments.length} sub-documents in pinecone`);
  // Batch the upsert operation
  const batchSize = 90;
  for (let i = 0; i < newDocuments.length; i += batchSize) {
    const batch = newDocuments.slice(i, i + batchSize);
    const result = await vectorStore.addDocuments(batch, { namespace });
    const completed = i === 0 ? result.length : batchSize * i + result.length;
    console.log({ total: newDocuments.length, completed });
  }
  console.log(
    `Finished Storing ${newDocuments.length} sub-documents in pinecone`
  );
}
