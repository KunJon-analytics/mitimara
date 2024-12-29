import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  AuthResultSchema,
  defaultSession,
  sessionSchema,
} from "@/lib/validations/session";

function useSession(token: string) {
  const { status, data, isLoading } = useQuery({
    queryKey: ["session", token],
    refetchInterval: 1000 * 60 * 10,
    queryFn: token
      ? async () => {
          const response = await fetch(`/api/session?token=${token}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          const data = sessionSchema.safeParse(json);
          if (!data.success) return defaultSession;
          return data.data;
        }
      : skipToken,
  });

  const { mutate, status: mutateStatus } = useMutation({
    mutationFn: (authResult: AuthResultSchema) => {
      return axios.post("/api/session", authResult);
    },
  });

  return { status, data, mutate, mutateStatus, isLoading };
}

export default useSession;
