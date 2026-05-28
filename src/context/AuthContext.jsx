import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // IMPORTANT
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("aura_token");

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
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

export function useAuth() {
  return useContext(AuthContext);
}