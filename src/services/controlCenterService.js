import API from "./api";

/** @typedef {"24h" | "7d" | "30d"} ControlCenterWindow */

/** @param {ControlCenterWindow} window */
export async function getControlCenterOverview(window) {
  return (await API.get("/admin/control-center/overview", { params: { window } })).data;
}

/** @param {{window: ControlCenterWindow, pageSize?: number, cursor?: string}} options */
export async function getControlCenterUsers({ window, pageSize = 25, cursor }) {
  const params = { window, page_size: pageSize };
  if (cursor) params.cursor = cursor;
  return (await API.get("/admin/control-center/users", { params })).data;
}

/** @param {ControlCenterWindow} window */
export async function getControlCenterIntelligence(window) {
  return (await API.get("/admin/control-center/intelligence", { params: { window } })).data;
}
