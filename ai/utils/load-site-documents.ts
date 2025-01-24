import { SitemapLoader } from "@langchain/community/document_loaders/web/sitemap";

export const loadSiteDocuments = async (siteUrl: string) => {
  console.log("Loading site Docs from sitemap of: ", siteUrl);
  const loader = new SitemapLoader(siteUrl);
  const docs = await loader.load();
  console.log("Done loading site Docs, number of docs: ", docs.length);
  return docs;
};
