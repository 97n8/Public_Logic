import { useQuery } from "@tanstack/react-query";
import { acquireToken } from "../../lib/auth";

export default function useAccessToken() {
  return useQuery({
    queryKey: ["auth", "accessToken"],
    queryFn: async () => {
      const result = await acquireToken();
      return result.accessToken;
    },
    staleTime: 4 * 60 * 1000,
  });
}

