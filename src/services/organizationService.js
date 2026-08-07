import API from "./api";

/*
=========================================================

            ORGANIZATION SERVICE

Handles all organization-related API calls.

Responsibilities

• Create Organization
• List Organizations
• Get Organization
• Update Organization
• Delete Organization

=========================================================
*/

// =====================================================
// CREATE ORGANIZATION
// =====================================================

export async function createOrganization({

    name,

    industry,

    company_size

}) {

    const response = await API.post(

        "/organizations",

        {

            name,

            industry,

            company_size

        }

    );

    return response.data;

}

// =====================================================
// LIST ORGANIZATIONS
// =====================================================

export async function getOrganizations() {

    const response = await API.get(

        "/organizations"

    );

    return response.data;

}

// =====================================================
// GET ORGANIZATION
// =====================================================

export async function getOrganization(

    organizationId

) {

    const response = await API.get(

        `/organizations/${organizationId}`

    );

    return response.data;

}

// =====================================================
// UPDATE ORGANIZATION
// =====================================================

export async function updateOrganization(

    organizationId,

    payload

) {

    const response = await API.put(

        `/organizations/${organizationId}`,

        payload

    );

    return response.data;

}

// =====================================================
// DELETE ORGANIZATION
// =====================================================

export async function deleteOrganization(

    organizationId

) {

    const response = await API.delete(

        `/organizations/${organizationId}`

    );

    return response.data;

}
