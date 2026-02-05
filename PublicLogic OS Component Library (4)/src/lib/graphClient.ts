import { Client } from "@microsoft/microsoft-graph-client";
import { acquireToken } from "./auth";

let client: Client | null = null;

export function getGraphClient() {
  if (client) return client;

  client = Client.init({
    authProvider: async (done) => {
      try {
        const result = await acquireToken();
        done(null, result.accessToken);
      } catch (e) {
        done(e as Error, null);
      }
    },
  });

  return client;
}

