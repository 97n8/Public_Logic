import { getConfig } from "./config.js";
import { graphGet, graphPost } from "./graph.js";

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

    const site = await graphGet(
      auth,
      `/sites/${cfg.sharepoint.hostname}:${cfg.sharepoint.sitePath}`
    );

    cache.site = site;
    return site;
  }

  /* ================= LIST DISCOVERY ================= */

  async function findListByName(displayName) {
    const site = await getSite();
    const safe = encodeODataStringLiteral(displayName);

    const res = await graphGet(
      auth,
      `/sites/${site.id}/lists?$filter=displayName eq '${safe}'`
    );

    return res?.value?.[0] || null;
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
    await graphPost(
      auth,
      `/sites/${site.id}/lists/${listId}/columns`,
      column
    );
  }

  /* ================= ITEMS ================= */

  async function listItems(displayName) {
    const site = await getSite();
    const list =
      cache.listsByName.get(displayName) ||
      (await findListByName(displayName));

    if (!list) throw new Error(`List not found: ${displayName}`);

    cache.listsByName.set(displayName, list);

    const res = await graphGet(
      auth,
      `/sites/${site.id}/lists/${list.id}/items?$expand=fields`
    );

    return (res?.value || []).map((it) => ({
      itemId: it.id,
      ...(it.fields || {})
    }));
  }

  async function createItem(displayName, fields) {
    const site = await getSite();
    const list =
      cache.listsByName.get(displayName) ||
      (await findListByName(displayName));

    if (!list) throw new Error(`List not found: ${displayName}`);

    const res = await graphPost(
      auth,
      `/sites/${site.id}/lists/${list.id}/items`,
      { fields }
    );

    return res;
  }

  return {
    getSite,
    findListByName,
    createList,
    createColumn,
    listItems,
    createItem
  };
}
