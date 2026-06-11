import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import AuraCommandCenter from "./pages/AuraCommandCenter";
import SessionsPage from "./pages/SessionsPage";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import {
  OrganizationProvider,
} from "./context/OrganizationContext";

function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />

      <Route
  path="/sessions"
  element={
    <ProtectedRoute>
      <SessionsPage />
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

      {/* AURA COMMAND CENTER */}
      <Route
        path="/intelligence"
        element={
          <ProtectedRoute>
            <AuraCommandCenter />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>

      <OrganizationProvider>

        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>

      </OrganizationProvider>

    </AuthProvider>
  );
}