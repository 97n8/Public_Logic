// lib/sharepoint.js
import { getConfig } from "./config.js";
import { graphGet, graphPost, graphPatch } from "./graph.js";

function encodeODataStringLiteral(s) {
  return String(s).replace(/'/g, "''");
}

export function createSharePointClient(auth) {
  const cfg = getConfig();
  const cache = {
    site: null,
    listsByName: new Map()
  };

  async function getSite() {
    if (cache.site) return cache.site;
    const site = await graphGet(auth, `/sites/${cfg.sharepoint.hostname}:${cfg.sharepoint.sitePath}`);
    cache.site = site;
    return site;
  }

  async function findListByName(displayName) {
    const site = await getSite();
    const safe = encodeODataStringLiteral(displayName);
    const res = await graphGet(auth, `/sites/${site.id}/lists?$filter=displayName eq '${safe}'`);
    return res?.value?.[0] || null;
  }

  async function getList(displayName) {
    const cached = cache.listsByName.get(displayName);
    if (cached) return cached;
    
    const list = await findListByName(displayName);
    if (!list) throw new Error(`List not found: ${displayName}`);
    
    cache.listsByName.set(displayName, list);
    return list;
  }

  async function createList({ displayName, description }) {
    const site = await getSite();
    const body = {
      displayName,
      description,
      list: { template: "genericList" }
    };
    const list = await graphPost(auth, `/sites/${site.id}/lists`, body);
    cache.listsByName.set(displayName, list);
    return list;
  }

  async function createColumn(listId, column) {
    const site = await getSite();
    await graphPost(auth, `/sites/${site.id}/lists/${listId}/columns`, column);
  }

  async function listItems(displayName, { selectFields, top } = {}) {
    const site = await getSite();
    const list = await getList(displayName);

    let path = `/sites/${site.id}/lists/${list.id}/items?$expand=fields`;
    if (top) path += `&$top=${top}`;

    const res = await graphGet(auth, path);

    return (res?.value || []).map((it) => ({
      itemId: it.id,
      webUrl: it.webUrl,
      ...(it.fields || {})
    }));
  }

  async function createItem(displayName, fields) {
    const site = await getSite();
    const list = await getList(displayName);
    return graphPost(auth, `/sites/${site.id}/lists/${list.id}/items`, { fields });
  }

  async function updateItemFields(displayName, itemId, fields) {
    const site = await getSite();
    const list = await getList(displayName);
    return graphPatch(auth, `/sites/${site.id}/lists/${list.id}/items/${itemId}/fields`, fields);
  }

  async function deleteItem(displayName, itemId) {
    const site = await getSite();
    const list = await getList(displayName);
    return graphDelete(auth, `/sites/${site.id}/lists/${list.id}/items/${itemId}`);
  }

  return {
    getSite,
    findListByName,
    createList,
    createColumn,
    listItems,
    createItem,
    updateItemFields,
    deleteItem
  };
}
