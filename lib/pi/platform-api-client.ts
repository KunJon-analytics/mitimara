import axios from "axios";

import { env } from "@/env.mjs";

const platformAPIClient = axios.create({
  baseURL: env.PI_PLATFORM_API_URL,
  timeout: 20000,
  headers: { Authorization: `Key ${env.PI_API_KEY}` },
});

export default platformAPIClient;
