import React from "react";

import { readPolicy } from "@/lib/services/filestack-policy";
import VerifyTreeClient from "./_components/veify-tree-client";

const VerifyTreePage = () => {
  const security = readPolicy;

  return <VerifyTreeClient security={security} />;
};

export default VerifyTreePage;
