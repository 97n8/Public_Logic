import { getConfig } from "./config.ts";
import { graphGet, graphPost, graphPatch, graphDelete } from "./graph-base.ts";

function encodeODataStringLiteral(s: string) {
  return String(s).replace(/'/g, "''");
}

export function createSharePointClient(token: string) {
  const cfg = getConfig();
  const cache = {
    site: null as any,
    listsByName: new Map<string, any>(),
    listItemsCache: new Map<string, any[]>(),
    lastFetch: new Map<string, number>()
  };

  async function getSite() {
    if (cache.site) return cache.site;
    const site = await graphGet(token, `/sites/${cfg.sharepoint.hostname}:${cfg.sharepoint.sitePath}`);
    cache.site = site;
    return site;
  }

  async function findListByName(displayName: string) {
    const site = await getSite();
    const safe = encodeODataStringLiteral(displayName);
    const res = await graphGet(token, `/sites/${site.id}/lists?$filter=displayName eq '${safe}'`);
    return res?.value?.[0] || null;
  }

  async function getList(displayName: string) {
    const cached = cache.listsByName.get(displayName);
    if (cached) return cached;
    
    const list = await findListByName(displayName);
    if (!list) throw new Error(`List not found: ${displayName}`);
    
    cache.listsByName.set(displayName, list);
    return list;
  }

  async function createList({ displayName, description }: { displayName: string, description: string }) {
    const site = await getSite();
    const body = {
      displayName,
      description,
      list: { template: "genericList" }
    };
    const list = await graphPost(token, `/sites/${site.id}/lists`, body);
    cache.listsByName.set(displayName, list);
    return list;
  }

  async function createColumn(listId: string, column: any) {
    const site = await getSite();
    await graphPost(token, `/sites/${site.id}/lists/${listId}/columns`, column);
  }

  function invalidateListCache(displayName: string) {
    cache.listItemsCache.delete(displayName);
    cache.lastFetch.delete(displayName);
  }

  function invalidateAllCaches() {
    cache.listItemsCache.clear();
    cache.lastFetch.clear();
  }

  async function listItems(displayName: string, { selectFields, top, forceRefresh = false }: { selectFields?: string[], top?: number, forceRefresh?: boolean } = {}) {
    const site = await getSite();
    const list = await getList(displayName);

    const cacheKey = `${displayName}:${top || "all"}`;
    const lastFetch = cache.lastFetch.get(cacheKey);
    const now = Date.now();
    
    if (!forceRefresh && lastFetch && (now - lastFetch) < 5000) {
      const cached = cache.listItemsCache.get(cacheKey);
      if (cached) return cached;
    }

    let path = `/sites/${site.id}/lists/${list.id}/items?$expand=fields`;
    if (top) path += `&$top=${top}`;

    const res = await graphGet(token, path);

    const items = (res?.value || []).map((it: any) => ({
      itemId: it.id,
      webUrl: it.webUrl,
      ...(it.fields || {})
    }));

    cache.listItemsCache.set(cacheKey, items);
    cache.lastFetch.set(cacheKey, now);

    return items;
  }

  async function createItem(displayName: string, fields: any) {
    const site = await getSite();
    const list = await getList(displayName);
    const result = await graphPost(token, `/sites/${site.id}/lists/${list.id}/items`, { fields });
    invalidateListCache(displayName);
    return result;
  }

  async function updateItemFields(displayName: string, itemId: string, fields: any) {
    const site = await getSite();
    const list = await getList(displayName);
    const result = await graphPatch(token, `/sites/${site.id}/lists/${list.id}/items/${itemId}/fields`, fields);
    invalidateListCache(displayName);
    return result;
  }

  async function deleteItem(displayName: string, itemId: string) {
    const site = await getSite();
    const list = await getList(displayName);
    const result = await graphDelete(token, `/sites/${site.id}/lists/${list.id}/items/${itemId}`);
    invalidateListCache(displayName);
    return result;
  }

  return {
    getSite,
    findListByName,
    createList,
    createColumn,
    listItems,
    createItem,
    updateItemFields,
    deleteItem,
    invalidateListCache,
    invalidateAllCaches
  };
}
