import React from "react";

type TreeDetailPageParams = {
  params: Promise<{ treeId: string }>;
};

const TreeDetailPage = async ({ params }: TreeDetailPageParams) => {
  const treeId = (await params).treeId;

  return <div>TreeDetailPage:{treeId}</div>;
};

export default TreeDetailPage;
