import * as filestack from "filestack-js";
import axios from "axios";

import { env } from "@/env.mjs";

type CallNames =
  | "pick"
  | "read"
  | "remove"
  | "store"
  | "write"
  | "convert"
  | "exif"
  | "stat"
  | "runWorkflow";

export const getSecurityPolicy = (
  call: CallNames[],
  expiry: number,
  handle?: string
) => {
  const jsonPolicy: filestack.SecurityOptions = {
    call,
    expiry,
    handle,
  };

  const security = filestack.getSecurity(jsonPolicy, env.FILESTACK_APP_SECRET);
  return security;
};

const future = Math.floor(new Date("2093-06-15").getTime() / 1000);

// read policy until year 2093
export const readPolicy = getSecurityPolicy(["read"], future);

export const filestackAPIClient = axios.create({
  baseURL: "https://www.filestackapi.com/api/file",
  timeout: 20000,
});
