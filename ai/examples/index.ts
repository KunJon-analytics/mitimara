// import { deployedSiteUrl } from "../utils/constants";
import { retrieveAnswer } from "./retrieval-answer";
// import { storeDocs } from "./store-docs";

async function main() {
  // await storeDocs(deployedSiteUrl);
  await retrieveAnswer("How does mitimara ensure trees are really planted");
}

main()
  .then(async () => {
    console.log("DONE!!!");
  })
  .catch(async (e) => {
    console.error("MAIN_ERROR", e);
    console.error({ metadata: e.error.metadata });

    process.exit(1);
  });
