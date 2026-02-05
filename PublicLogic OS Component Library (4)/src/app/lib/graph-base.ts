/**
 * Base Microsoft Graph API Fetchers
 */

async function request(token: string, path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `https://graph.microsoft.com/v1.0${path}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 204) return null;
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Graph API Error: ${res.status}`);
  }
  return data;
}

export const graphGet = (token: string, path: string) => request(token, path, { method: "GET" });
export const graphPost = (token: string, path: string, body: any) => request(token, path, { method: "POST", body: JSON.stringify(body) });
export const graphPatch = (token: string, path: string, body: any) => request(token, path, { method: "PATCH", body: JSON.stringify(body) });
export const graphDelete = (token: string, path: string) => request(token, path, { method: "DELETE" });
