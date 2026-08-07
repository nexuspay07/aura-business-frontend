import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
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

            <Route path="/organizations" element={<ProtectedRoute><DashboardLayout><OrganizationsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/organizations/:organizationId" element={<ProtectedRoute><DashboardLayout><OrganizationDetailPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/workspaces" element={<ProtectedRoute><DashboardLayout><WorkspacesPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><DashboardLayout><WorkspacesPage /></DashboardLayout></ProtectedRoute>} />
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

                        <DashboardLayout><AuraCommandCenter /></DashboardLayout>

                    </ProtectedRoute>

                }

            />

            {/* CHAT SESSIONS */}

            <Route

                path="/sessions"

                element={

                    <ProtectedRoute>

                        <DashboardLayout><SessionsPage /></DashboardLayout>

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
