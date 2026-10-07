import api from "../../../lib/axios.js";

export async function getMonitors() {
  const response = await api.get("/monitors");

  return response.data;
}

export async function createMonitor(monitorData) {
  const response = await api.post("/monitors", monitorData);

  return response.data;
}

export async function runMonitorCheck(monitorId) {
  const response = await api.post(
    `/monitors/${monitorId}/check`
  );

  return response.data;
}

export async function getMonitorById(monitorId) {
  const response = await api.get(`/monitors/${monitorId}`);

  return response.data;
}

export async function getMonitorChecks(monitorId) {
  const response = await api.get(
    `/monitors/${monitorId}/checks`
  );

  return response.data;
}