import api from "../../../lib/axios.js";

export async function getPreferences() {
  const response =
    await api.get("/users/me/preferences");

  return response.data;
}

export async function updatePreferences(data) {
  const response =
    await api.patch(
      "/users/me/preferences",
      data
    );

  return response.data;
}