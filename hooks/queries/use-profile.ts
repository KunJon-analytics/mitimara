import { skipToken, useQuery } from "@tanstack/react-query";

import { defaultProfile, profileSchema } from "@/lib/validations/profile";

function useProfile(userId: string) {
  const { status, data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    refetchInterval: 1000 * 60 * 10,
    queryFn: userId
      ? async () => {
          const response = await fetch(`/api/profile/${userId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          const data = profileSchema.safeParse(json);
          if (!data.success) return defaultProfile;
          return data.data;
        }
      : skipToken,
  });

  return { status, data, isLoading };
}

export default useProfile;
