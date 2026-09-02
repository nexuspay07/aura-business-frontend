import { Navigate } from "react-router-dom";

import OrganizationWizard from "../components/organization/OrganizationWizard";

import { useSession } from "../context/SessionContext";

export default function OrganizationSetup() {

    const {

        organization,

        workspace,

        loading

    } = useSession();

    // Still loading the session
    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-screen">

                <div className="text-lg">

                    Loading...

                </div>

            </div>

        );

    }

    // User already has an organization
    if (organization && workspace) {

        return <Navigate to="/dashboard" replace />;

    }

    // Registration normally provisions both resources.  If only an
    // organization is present, this is a recovery state—not a request to
    // create another organization.
    if (organization && !workspace) {
        return <div className="flex min-h-screen items-center justify-center bg-[#080a0f] p-6 text-slate-100"><section className="max-w-lg rounded-2xl border border-white/10 bg-white/[.03] p-8"><h1 className="text-2xl font-bold">Workspace recovery needed</h1><p className="mt-3 text-slate-400">Your organization exists, but Aevric AI could not load an accessible workspace. Contact an organization owner to restore workspace access, then refresh this page.</p></section></div>;
    }

    // Genuine recovery: no organization is available.
    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <OrganizationWizard />

        </div>

    );

}
