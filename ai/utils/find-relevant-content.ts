import { vectorStore } from "./vectore-store";

export const findRelevantContent = async (userQuery: string) => {
  console.log("Retrieving similar docs for user query: ", userQuery);
  const retrievedDocs = await vectorStore.similaritySearch(userQuery, 2);
  console.log("Done retrieving similar docs for user query: ", userQuery);

  const docsContent = retrievedDocs.map((doc) => doc.pageContent).join("\n");

  return docsContent;
};
