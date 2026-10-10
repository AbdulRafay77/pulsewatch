import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  signupUser,
  refreshSession,
  logoutUser
} from "../api/authApi.js";

import {
  setAccessToken
} from "../../../lib/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const data =
          await refreshSession();

        setAccessToken(
          data.accessToken
        );

        setUser(data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signup(username, email, password) {
    const data = await signupUser(
      username,
      email,
      password
    );

    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await loginUser(
      email,
      password
    );

    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        authLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}