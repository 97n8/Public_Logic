import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// HARD TRUTH: No hardcoded prefixes. No client_credentials logic.
// We only accept delegated user tokens from the frontend.

app.use('*', logger(console.log));

// Hardened Wildcard CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['authorization', 'content-type', 'apikey', 'x-ms-graph-token'],
  maxAge: 86400,
}));

app.options('*', (c) => c.text('', 204));

// Helper: Extract and verify Graph Token
async function graphFetch(url: string, c: any) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized: Missing delegated MS Graph token");
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  const res = await fetch(`https://graph.microsoft.com/v1.0${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Graph Error [${res.status}]: ${errText}`);
    throw new Error(`Microsoft Graph responded with ${res.status}`);
  }
  
  return res.json();
}

// HEALTH CHECK - Pinpoints routing vs auth issues
app.get('**/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// STATS - Using Wildcard Routing
app.get('**/stats', async (c) => {
  try {
    // Attempt to get real data if token is present
    const siteData = await graphFetch('/sites/publiclogic978.sharepoint.com:/sites/PL', c);
    const siteId = siteData.id;
    
    const lists = await graphFetch(`/sites/${siteId}/lists?$filter=displayName eq 'ARCHIEVE'`, c);
    const listId = lists.value?.[0]?.id;
    
    if (!listId) return c.json({ archivedCount: 0, open: 0, overdue: 0 });

    const items = await graphFetch(`/sites/${siteId}/lists/${listId}/items?expand=fields`, c);
    const values = items.value || [];
    
    return c.json({
      archivedCount: values.length,
      open: values.filter((i: any) => i.fields?.Status !== 'Completed').length,
      overdue: values.filter((i: any) => {
        const d = i.fields?.DueDate ? new Date(i.fields.DueDate) : null;
        return d && d < new Date() && i.fields.Status !== 'Completed';
      }).length
    });
  } catch (err: any) {
    console.error("Stats Failure:", err.message);
    return c.json({ error: err.message }, 401);
  }
});

// REQUESTS
app.get('**/requests', async (c) => {
  try {
    const siteData = await graphFetch('/sites/publiclogic978.sharepoint.com:/sites/PL', c);
    const siteId = siteData.id;
    
    const lists = await graphFetch(`/sites/${siteId}/lists?$filter=displayName eq 'ARCHIEVE'`, c);
    const listId = lists.value?.[0]?.id;
    
    if (!listId) return c.json([]);

    const items = await graphFetch(`/sites/${siteId}/lists/${listId}/items?expand=fields`, c);
    
    return c.json((items.value || []).map((i: any) => ({
      id: i.fields.Title?.split(' - ')[0] || i.id,
      name: i.fields.Title?.split(' - ')[1] || 'Unknown',
      status: i.fields.Status || 'Active',
      description: i.fields.Summary || '',
      timestamp: i.createdDateTime,
      dueDate: i.fields.DueDate || new Date().toISOString(),
    })));
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

// SUBMIT (POST)
app.post('**/requests', async (c) => {
  try {
    const body = await c.req.json();
    const siteData = await graphFetch('/sites/publiclogic978.sharepoint.com:/sites/PL', c);
    const siteId = siteData.id;
    
    const lists = await graphFetch(`/sites/${siteId}/lists?$filter=displayName eq 'ARCHIEVE'`, c);
    const listId = lists.value?.[0]?.id;
    
    const res = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.req.header('authorization')?.split(' ')[1]}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Title: `${body.id} - ${body.name}`,
          Status: body.status || "Active",
          Summary: body.description || "",
          DueDate: body.dueDate
        }
      })
    });

    if (!res.ok) throw new Error(await res.text());
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);
