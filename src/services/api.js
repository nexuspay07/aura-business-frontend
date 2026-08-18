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
export async function requestPasswordReset(email) { return (await API.post("/auth/password-reset/request", { email })).data; }
export async function confirmPasswordReset(token, password) { return (await API.post("/auth/password-reset/confirm", { token, password })).data; }

// =====================================================
// PERSONAL ASK / DECISIONS
// =====================================================
export async function askAura(payload) { return (await API.post("/personal/ask", payload)).data; }
export async function getAuraConversation(sessionId) { return (await API.get(`/personal/ask/${sessionId}`)).data; }
export async function listAuraConversations() { return (await API.get("/personal/conversations")).data; }
export async function listPersonalDecisions(status = null) { return (await API.get("/personal/decisions", { params: status ? { status } : {} })).data; }
export async function getPersonalDecision(decisionId) { return (await API.get(`/personal/decisions/${decisionId}`)).data; }
export async function savePersonalDecision(payload) { return (await API.post("/personal/decisions", payload)).data; }
export async function updatePersonalDecision(decisionId, payload) { return (await API.patch(`/personal/decisions/${decisionId}`, payload)).data; }
export async function deletePersonalDecision(decisionId) { return API.delete(`/personal/decisions/${decisionId}`); }

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

// =====================================================
// MARKETPLACE / SIMULATIONS
// =====================================================
export async function getMarketplaceItems() { return (await API.get("/marketplace/all")).data; }
export async function getMyMarketplaceItems() { return (await API.get("/marketplace/mine")).data; }
export async function getMarketplaceItem(itemId) { return (await API.get(`/marketplace/${itemId}`)).data; }
export async function saveMarketplaceItem(payload) { return (await API.post("/marketplace/save", payload)).data; }
export async function deleteMarketplaceItem(itemId) { return (await API.delete(`/marketplace/${itemId}`)).data; }
export async function runSimulation(payload) { return (await API.post("/lab/simulate", payload)).data; }
export async function getSimulationHistory() { return (await API.get("/lab/history")).data; }

// =====================================================
// COMMERCIAL READ MODELS
// =====================================================
export async function getBillingAccounts() { return (await API.get("/commercial/billing-accounts")).data; }
export async function getSubscriptions() { return (await API.get("/commercial/subscriptions")).data; }
export async function getUsageRecords() { return (await API.get("/commercial/usage")).data; }
export async function getInvoices() { return (await API.get("/commercial/invoices")).data; }
export async function getRefunds() { return (await API.get("/commercial/refunds")).data; }
export async function getCreditNotes() { return (await API.get("/commercial/credit-notes")).data; }

// =====================================================
// ORGANIZATION SETTINGS
// =====================================================
export async function updateOrganization(organizationId, payload) { return (await API.put(`/organizations/${organizationId}`, payload)).data; }
export async function createWorkspace(organizationId, payload) { return (await API.post(`/organizations/${organizationId}/workspaces`, payload)).data; }
export async function updateWorkspace(workspaceId, payload) { return (await API.put(`/organizations/workspaces/${workspaceId}`, payload)).data; }
export async function archiveWorkspace(workspaceId) { return (await API.delete(`/organizations/workspaces/${workspaceId}`)).data; }
export async function getWorkspaceMembers(workspaceId) { return (await API.get(`/organizations/workspaces/${workspaceId}/members`)).data; }
export async function updateWorkspaceMember(workspaceId, userId, payload) { return (await API.put(`/organizations/workspaces/${workspaceId}/members/${userId}`, payload)).data; }

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
