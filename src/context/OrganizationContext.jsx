import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getOrganizations,
  getToken,
} from "../services/api";

const OrganizationContext =
  createContext();

export function OrganizationProvider({
  children,
}) {
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

  useEffect(() => {

  const token =
    getToken();

  if (token) {
    loadOrganizations();
  } else {
    setLoading(false);
  }

}, []);

  const loadOrganizations =
    async () => {
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
    };

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

export function useOrganization() {
  return useContext(
    OrganizationContext
  );
}