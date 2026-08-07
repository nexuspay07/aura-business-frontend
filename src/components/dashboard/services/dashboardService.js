import {

    runIntelligence,

    getDashboard

} from "../../../services/api";

/*
=========================================================

            DASHBOARD SERVICE

Provides dashboard data and executive intelligence.

=========================================================
*/

// =====================================================
// DASHBOARD
// =====================================================

export async function loadDashboard() {

    return await getDashboard();

}

// =====================================================
// EXECUTIVE INTELLIGENCE
// =====================================================

export async function executeIntelligence({

    message,

    sessionId = null,

    organizationId = null,

    workspaceId = null

}) {

    return await runIntelligence({

        message,

        sessionId,

        organizationId,

        workspaceId

    });

}

export default {

    loadDashboard,

    executeIntelligence

};