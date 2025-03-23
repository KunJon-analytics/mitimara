import { vectorStore } from "./vectore-store";

export const getContext = async (query: string) => {
  const matchingDocs = await vectorStore.similaritySearchWithScore(query);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matchingDocs.filter(
    ([_, score]) => score && score > 0.4
  );

  if (qualifyingDocs.length < 1) {
    return "";
  }

  const serializedDocs = qualifyingDocs.map(([doc]) => doc.pageContent);

  return serializedDocs.join("\n").substring(0, 3000);
};
