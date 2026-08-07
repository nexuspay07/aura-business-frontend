import axios from "axios";

/*
=========================================================

                AURA API CLIENT

Central HTTP client used by the frontend.

Responsibilities

• Dashboard
• Intelligence
• Sessions
• Authentication

=========================================================
*/

const API = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000"

});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem(
            "aura_token"
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

// =====================================================
// DASHBOARD
// =====================================================

export async function getDashboard() {

    const response = await API.get(
        "/dashboard"
    );

    return response.data;

}

export async function getWorkspaceSessions(workspaceId) {

    const response = await API.get(
        `/intelligence-sessions/workspace/${workspaceId}`
    );

    return response.data;

}

// =====================================================
// EXECUTIVE INTELLIGENCE
// =====================================================

export async function runIntelligence({

    message,

    sessionId = null,

    organizationId = null,

    workspaceId = null

}) {

    const response = await API.post(

        "/chat",

        {

            message,

            session_id: sessionId,

            organization_id: organizationId,

            workspace_id: workspaceId

        }

    );

    return response.data;

}

// =====================================================
// INTELLIGENCE SESSIONS
// =====================================================

export async function getSessions() {

    const response = await API.get(
        "/sessions"
    );

    return response.data;

}

export async function getSession(sessionId) {

    const response = await API.get(
        `/sessions/${sessionId}`
    );

    return response.data;

}

// =====================================================
// AUTH
// =====================================================

export function getToken() {

    return localStorage.getItem("aura_token");

}

// =====================================================
// ORGANIZATIONS
// =====================================================

export async function getOrganizations() {

    const response = await API.get(
        "/organizations"
    );

    return response.data;

}

export async function getOrganization(organizationId) { return (await API.get(`/organizations/${organizationId}`)).data; }
export async function getOrganizationWorkspaces(organizationId) { return (await API.get(`/organizations/${organizationId}/workspaces`)).data; }
export async function selectActiveWorkspace(workspaceId) { return (await API.post("/auth/context/workspace", { workspace_id: workspaceId })).data; }

// =====================================================
// CURRENT USER / SESSION
// =====================================================

export async function getCurrentSession() {

    const response = await API.get(
        "/auth/me"
    );

    return response.data;

}

API.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            localStorage.getItem("aura_token")
        ) {

            localStorage.removeItem("aura_token");

            window.location.href = "/login";

        }

        return Promise.reject(error);

    }

);

export default API;
