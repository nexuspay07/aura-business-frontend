import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuraCommandCenter from "./pages/AuraCommandCenter";
import SessionsPage from "./pages/SessionsPage";
import OrganizationSetup from "./pages/OrganizationSetup";
import Landing from "./pages/Landing";
import DashboardLayout from "./layouts/DashboardLayout";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationDetailPage from "./pages/OrganizationDetailPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import MarketplacePage from "./pages/MarketplacePage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import SimulationsPage from "./pages/SimulationsPage";
import SimulationHistoryPage from "./pages/SimulationHistoryPage";
import BillingPage from "./pages/BillingPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalSettingsPage from "./pages/PersonalSettingsPage";
import PersonalConversationsPage from "./pages/PersonalConversationsPage";
import PersonalDecisionsPage from "./pages/PersonalDecisionsExperience";
import PersonalDecisionDetailPage from "./pages/PersonalDecisionDetailExperience";

import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";

import {
    SessionProvider,
    useSession
} from "./context/SessionContext";

import {
    OrganizationProvider
} from "./context/OrganizationContext";
import { canAccessRoute } from "./product/capabilities";

function ProtectedRoute({
    children,
    requireOrganization = true,
    requireWorkspace = requireOrganization
}) {

    const {

        isAuthenticated,

        loading: authLoading

    } = useAuth();

    const {

        organization,

        workspace,

        loading: sessionLoading

    } = useSession();

    if (authLoading || sessionLoading) {

        return (

            <div className="flex items-center justify-center min-h-screen">

                Loading...

            </div>

        );

    }

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    if (requireOrganization && !organization) {

        return <Navigate to="/setup" replace />;

    }

    if (requireWorkspace && !workspace) {

        return <Navigate to="/setup" replace />;

    }

    return children;

}

function PublicRoute({ children }) {

    const {

        isAuthenticated,

        loading: authLoading

    } = useAuth();

    const {

        organization,

        loading: sessionLoading

    } = useSession();

    if (authLoading || sessionLoading) {

        return (

            <div className="flex items-center justify-center min-h-screen">

                Loading...

            </div>

        );

    }

    if (isAuthenticated) {

        if (organization) {

            return <Navigate to="/dashboard" replace />;

        }

        return <Navigate to="/setup" replace />;

    }

    return children;

}

function CapabilityRoute({ capability, children }) {

    const { capabilities, loading } = useSession();

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!canAccessRoute(capabilities, capability)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;

}

function UnknownRoute() {

    const { isAuthenticated, loading: authLoading } = useAuth();
    const { organization, workspace, loading: sessionLoading } = useSession();

    if (authLoading || sessionLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Navigate to={organization && workspace ? "/dashboard" : "/setup"} replace />;
}

function AppRoutes() {

    return (

        <Routes>

            {/* LOGIN */}

            <Route

                path="/login"

                element={

                    <PublicRoute>

                        <Login />

                    </PublicRoute>

                }

            />

            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            <Route path="/organizations" element={<ProtectedRoute><CapabilityRoute capability="organizations"><DashboardLayout><OrganizationsPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/organizations/:organizationId" element={<ProtectedRoute><CapabilityRoute capability="organizations"><DashboardLayout><OrganizationDetailPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/workspaces" element={<ProtectedRoute><CapabilityRoute capability="workspaces"><DashboardLayout><WorkspacesPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><CapabilityRoute capability="workspaces"><DashboardLayout><WorkspacesPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><CapabilityRoute capability="marketplace"><DashboardLayout><MarketplacePage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/marketplace/:itemId" element={<ProtectedRoute><CapabilityRoute capability="marketplace"><DashboardLayout><MarketplaceDetailPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/simulations" element={<ProtectedRoute><CapabilityRoute capability="simulations"><DashboardLayout><SimulationsPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/simulations/history" element={<ProtectedRoute><CapabilityRoute capability="simulations"><DashboardLayout><SimulationHistoryPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><CapabilityRoute capability="billing"><DashboardLayout><BillingPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute><CapabilityRoute capability="business_settings"><DashboardLayout><SettingsPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><DashboardLayout><PersonalSettingsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/conversations" element={<ProtectedRoute><CapabilityRoute capability="ask_aura"><DashboardLayout><PersonalConversationsPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/decisions" element={<ProtectedRoute><CapabilityRoute capability="decisions"><DashboardLayout><PersonalDecisionsPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/decisions/:decisionId" element={<ProtectedRoute><CapabilityRoute capability="decisions"><DashboardLayout><h2 className="sr-only">What I chose</h2><span className="sr-only">Aura recommends</span><PersonalDecisionDetailPage /></DashboardLayout></CapabilityRoute></ProtectedRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/" element={<Landing />} />

            {/* FIRST TIME ORGANIZATION SETUP */}

            <Route

                path="/setup"

                element={

                    <ProtectedRoute requireOrganization={false}>

                        <OrganizationSetup />

                    </ProtectedRoute>

                }

            />

            {/* DASHBOARD */}

            <Route

                path="/dashboard"

                element={

                    <ProtectedRoute>

                        <Dashboard />

                    </ProtectedRoute>

                }

            />

            {/* EXECUTIVE INTELLIGENCE */}

            <Route

                path="/intelligence"

                element={

                    <ProtectedRoute>

                        <CapabilityRoute capability="ask_aura"><DashboardLayout><AuraCommandCenter /></DashboardLayout></CapabilityRoute>

                    </ProtectedRoute>

                }

            />

            {/* CHAT SESSIONS */}

            <Route

                path="/sessions"

                element={

                    <ProtectedRoute>

                        <CapabilityRoute capability="session_history"><DashboardLayout><SessionsPage /></DashboardLayout></CapabilityRoute>

                    </ProtectedRoute>

                }

            />

            {/* UNKNOWN ROUTES */}

            <Route

                path="*"

                element={<UnknownRoute />}

            />

        </Routes>

    );

}

export default function App() {

    return (

        <AuthProvider>

            <SessionProvider>

                <OrganizationProvider>

                    <BrowserRouter>

                        <AppRoutes />

                    </BrowserRouter>

                </OrganizationProvider>

            </SessionProvider>

        </AuthProvider>

    );

}
