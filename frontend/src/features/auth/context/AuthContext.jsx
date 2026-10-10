import {
  createContext,
  useContext,
  useState
} from "react";

import {
  loginUser,
  signupUser,
} from "../api/authApi.js";

import {
  setAccessToken
} from "../../../lib/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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

  function logout() {
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}