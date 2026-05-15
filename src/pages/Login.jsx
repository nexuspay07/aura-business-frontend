import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid login credentials");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 70%)",
        overflow: "hidden",
        position: "relative",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "rgba(59,130,246,0.12)",
          filter: "blur(120px)",
          top: "-200px",
          left: "-150px",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "28px",
          padding: "50px 40px",
          backdropFilter: "blur(25px)",
          boxShadow: "0 0 50px rgba(37,99,235,0.18)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "45px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "72px",
              lineHeight: "72px",
              margin: 0,
              fontWeight: "800",
              letterSpacing: "-4px",
            }}
          >
            AURA
          </h1>

          <div
            style={{
              color: "#60a5fa",
              fontSize: "34px",
              fontWeight: "300",
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            Business
          </div>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "15px",
              marginTop: "16px",
            }}
          >
            AI-Powered Business Intelligence
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: "10px",
                fontSize: "14px",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: "10px",
                fontSize: "14px",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#ef4444",
                marginBottom: "10px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              marginTop: "20px",
              background:
                "linear-gradient(to right, #7c3aed, #2563eb)",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}