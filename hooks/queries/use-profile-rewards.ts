import { skipToken, useQuery } from "@tanstack/react-query";

import { profileRewardsSchema } from "@/lib/validations/profile";

function useProfileRewards(userId: string) {
  const { status, data, isLoading } = useQuery({
    queryKey: ["profile-rewards", userId],
    refetchInterval: 1000 * 60 * 10,
    queryFn: userId
      ? async () => {
          const response = await fetch(`/api/profile/${userId}/rewards`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          const data = profileRewardsSchema.safeParse(json);
          if (!data.success) return null;
          return data.data;
        }
      : skipToken,
  });

  return { status, data, isLoading };
}

export default useProfileRewards;
