"use client";

import { toast } from "sonner";
import { createContext, ReactNode, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import useLocalStorage from "@/hooks/use-local-storage";
import {
  AuthResultSchema,
  defaultSession,
  LoginParams,
  SessionData,
} from "@/lib/validations/session";
import useSession from "@/hooks/use-session";
import { Scope } from "@/types/pi";
import { onIncompletePaymentFound } from "@/lib/pi/callbacks";

const scopes: Scope[] = ["payments", "username", "wallet_address"];

// A "provider" is used to encapsulate only the
// components that needs the state in this context
type SessionContextType = {
  session: SessionData;
  isPending: boolean;
  accessToken: string;
  login: (params?: LoginParams) => Promise<void>;
  logout: () => void;
  status: "error" | "success" | "pending";
};

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [accessToken, setAccessToken] = useLocalStorage<string>(
    "access-token",
    ""
  );
  const router = useRouter();

  //if status is error or is not loggedin present the button, disable button
  //if is pending
  const { data, status, mutate, mutateStatus, isLoading } =
    useSession(accessToken);
  const isPending = isLoading || mutateStatus === "pending";

  const logout = () => {
    setAccessToken("");
    queryClient.removeQueries({ queryKey: ["session"] });
  };

  const login = async (params?: LoginParams) => {
    try {
      const authResult: AuthResultSchema = await window.Pi.authenticate(
        scopes,
        onIncompletePaymentFound
      );
      mutate(
        { ...authResult, referral: params?.referral },
        {
          onSuccess: (data, variables, context) => {
            setAccessToken(variables.accessToken);
            toast.success("You are successfully logged in");
          },
          onError: (error, variables, context) => {
            setAccessToken("");
            toast.error(error.message);
          },
          onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            if (params?.redirect) {
              router.push(params.redirect);
            }
          },
        }
      );
    } catch (_e) {
      toast.error("Network Error");
      console.log(_e);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session: data || defaultSession,
        isPending,
        login,
        logout,
        status,
        accessToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

const useCurrentSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error(
      "useClient has to be used within <SessionContext.Provider>"
    );
  }

  return sessionContext;
};

export default useCurrentSession;
