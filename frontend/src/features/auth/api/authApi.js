import api from "../../../lib/axios.js";

export async function signupUser(username, email, password) {
  const response = await api.post("/auth/signup", {
    username,
    email,
    password
  });

  return response.data;
}

export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data.user;
}

let refreshPromise = null;

export async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}