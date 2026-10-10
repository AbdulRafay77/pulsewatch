import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true
});

let currentAccessToken = null;

let refreshPromise = null;

let authFailureHandler = null;

export function setAccessToken(token) {
  currentAccessToken = token;
}

export function setAuthFailureHandler(handler) {
  authFailureHandler = handler;
}

// Attach access token to normal API requests
api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization =
      `Bearer ${currentAccessToken}`;
  }

  return config;
});

async function refreshAccessToken() {
  // Prevent several simultaneous 401s from
  // rotating the same refresh token multiple times
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true
        }
      )
      .then((response) => {
        const accessToken =
          response.data.accessToken;

        setAccessToken(accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const status =
      error.response?.status;

    const requestUrl =
      originalRequest?.url || "";

    // Not an authentication error
    if (
      status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Never retry the same request forever
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Do NOT attempt automatic refresh for
    // authentication endpoints themselves
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/signup") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original failed request
      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);

      if (authFailureHandler) {
        authFailureHandler();
      }

      return Promise.reject(
        refreshError
      );
    }
  }
);

export default api;