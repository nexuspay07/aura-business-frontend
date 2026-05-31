import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(
  "API URL:",
  import.meta.env.VITE_API_URL
);



/*
|--------------------------------------------------------------------------
| TOKEN HELPERS
|--------------------------------------------------------------------------
*/

export const setToken = (token) => {
  localStorage.setItem("aura_token", token);
};

export const getToken = () => {
  return localStorage.getItem("aura_token");
};

export const removeToken = () => {
  localStorage.removeItem("aura_token");
};



/*
|--------------------------------------------------------------------------
| AXIOS INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



/*
|--------------------------------------------------------------------------
| AUTH APIs
|--------------------------------------------------------------------------
*/

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};



/*
|--------------------------------------------------------------------------
| ORGANIZATION APIs
|--------------------------------------------------------------------------
*/

export const getOrganizations = async () => {
  const response = await api.get("/organizations");

  return response.data;
};

export const createOrganization = async (data) => {
  const response = await api.post("/organizations", data);

  return response.data;
};



/*
|--------------------------------------------------------------------------
| INTELLIGENCE SESSION APIs
|--------------------------------------------------------------------------
*/

export const getWorkspaceSessions = async (workspaceId) => {
  const response = await api.get(
    `/intelligence-sessions/workspace/${workspaceId}`
  );

  return response.data;
};



/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE INTELLIGENCE SESSION
|--------------------------------------------------------------------------
*/

export const createIntelligenceSession = async (data) => {
  const response = await api.post(
    "/intelligence-sessions",
    data
  );

  return response.data;
};

export default api;