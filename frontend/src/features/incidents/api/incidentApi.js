import api from "../../../lib/axios.js";

export async function getIncidents() {
  const response = await api.get("/incidents");

  return response.data;
}