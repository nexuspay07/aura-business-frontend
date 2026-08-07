import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {

    getOrganizations

} from "../services/api";

import {

    useAuth

} from "./AuthContext";

const OrganizationContext =
  createContext();

export function OrganizationProvider({
  children,
}) {

  const {

    isAuthenticated

} = useAuth();
  const [
    organizations,
    setOrganizations,
  ] = useState([]);

  const [
    activeOrganization,
    setActiveOrganization,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadOrganizations = useCallback(async () => {
      try {
        const data =
          await getOrganizations();

        const orgs =
          data.organizations || [];

        setOrganizations(orgs);

        if (
          orgs.length > 0
        ) {
          setActiveOrganization(
            orgs[0]
          );
        }
      } catch (error) {
        console.error(
          "Failed to load organizations",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void Promise.resolve().then(loadOrganizations);
    } else {
      queueMicrotask(() => setLoading(false));
    }
  }, [isAuthenticated, loadOrganizations]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        activeOrganization,
        setActiveOrganization,
        loadOrganizations,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrganization() {
  return useContext(
    OrganizationContext
  );
}
