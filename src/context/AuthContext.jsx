import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // IMPORTANT
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("aura_token");

    async function restore() {
      if (!storedToken) { setLoading(false); return; }
      try {
        await api.get("/auth/me");
        setToken(storedToken);
      } catch {
        localStorage.removeItem("aura_token");
      } finally { setLoading(false); }
    }

    restore();
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem(
      "aura_token",
      jwtToken
    );

    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("aura_token");
    sessionStorage.removeItem("aura_session");
    sessionStorage.removeItem("aura_organization");
    sessionStorage.removeItem("aura_workspace");

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Context hooks intentionally share this module with their provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
