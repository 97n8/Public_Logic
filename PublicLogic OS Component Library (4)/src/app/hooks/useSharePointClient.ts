import { useMemo } from "react";
import useAccessToken from "./useAccessToken";
import { createSharePointClient } from "../lib/sharepoint-client";

export default function useSharePointClient() {
  const token = useAccessToken();
  const client = useMemo(() => {
    if (!token.data) return null;
    return createSharePointClient(token.data);
  }, [token.data]);

  return { ...token, client };
}

