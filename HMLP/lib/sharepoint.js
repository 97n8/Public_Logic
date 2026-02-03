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

  /* ---------------- SITE ---------------- */

  async function getSite() {
    if (cache.site) return cache.site;

    const site = await graphGet(
      auth,
      `/sites/${cfg.sharepoint.hostname}:${cfg.sharepoint.sitePath}`
    );

    cache.site = site;
    return site;
  }

  /* ---------------- LISTS ---------------- */

  async function findListByName(displayName) {
    if (cache.listsByName.has(displayName)) {
      return cache.listsByName.get(displayName);
    }

    const site = await getSite();
    const safe = encodeODataStringLiteral(displayName);

    const res = await graphGet(
      auth,
      `/sites/${site.id}/lists?$filter=displayName eq '${safe}'`
    );

    const list = res?.value?.[0] || null;
    if (list) cache.listsByName.set(displayName, list);
    return list;
  }

  async function createList({ displayName, description }) {
    const site = await getSite();

    const list = await graphPost(auth, `/sites/${site.id}/lists`, {
      displayName,
      description,
      list: { template: "genericList" }
    });

    cache.listsByName.set(displayName, list);
    return list;
  }

  async function createColumn(listId, columnDef) {
    const site = await getSite();
    return await graphPost(
      auth,
      `/sites/${site.id}/lists/${listId}/columns`,
      columnDef
    );
  }

  /* ---------------- ITEMS ---------------- */

  async function listItems(displayName, { top = 200 } = {}) {
    const site = await getSite();
    const list = await findListByName(displayName);
    if (!list) throw new Error(`List not found: ${displayName}`);

    const res = await graphGet(
      auth,
      `/sites/${site.id}/lists/${list.id}/items?$expand=fields&$top=${top}`
    );

    return (res?.value || []).map(it => ({
      itemId: it.id,
      webUrl: it.webUrl,
      ...(it.fields || {})
    }));
  }

  async function createItem(displayName, fields) {
    const site = await getSite();
    const list = await findListByName(displayName);
    if (!list) throw new Error(`List not found: ${displayName}`);

    return await graphPost(
      auth,
      `/sites/${site.id}/lists/${list.id}/items`,
      { fields }
    );
  }

  async function updateItemFields(displayName, itemId, fields) {
    const site = await getSite();
    const list = await findListByName(displayName);

    await graphPatch(
      auth,
      `/sites/${site.id}/lists/${list.id}/items/${itemId}/fields`,
      fields
    );
  }

  return {
    getSite,
    findListByName,
    createList,
    createColumn,
    listItems,
    createItem,
    updateItemFields
  };
}
