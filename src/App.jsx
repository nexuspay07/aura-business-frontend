import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IntelligencePage from "./pages/IntelligencePage";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";


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


      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* INTELLIGENCE WORKSPACE */}
      <Route
        path="/intelligence"
        element={
          <ProtectedRoute>
            <IntelligencePage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}