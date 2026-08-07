// Production Login.jsx template

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import SocialLogin from "../components/auth/SocialLogin";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [rememberMe,setRememberMe]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function handleLogin(e){
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const response=await api.post("/auth/login",{email,password});
      login(response.data.access_token);

      if(rememberMe){
        localStorage.setItem("remember_email",email);
      }else{
        localStorage.removeItem("remember_email");
      }

      // SessionProvider refreshes from /auth/me after AuthContext receives the
      // verified token.  Calling its pre-render callback here would still see
      // the old anonymous state and could incorrectly send a member to setup.
      navigate("/dashboard", { replace: true });

    }catch(err){
      setError(err?.response?.data?.detail || "Invalid login credentials.");
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to continue using Aura OS."
    >
      <form onSubmit={handleLogin}>

        <AuthInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        {error && <p role="alert" className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}

        <div className="my-5 flex items-center justify-between text-sm text-slate-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e)=>setRememberMe(e.target.checked)}
            />
            {" "}Remember me
          </label>

          <Link className="text-blue-300 hover:text-blue-200" to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-blue-500 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <SocialLogin
          loading={loading}
          onGoogle={()=>console.log("Google")}
          onMicrosoft={()=>console.log("Microsoft")}
        />

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link className="font-medium text-blue-300 hover:text-blue-200" to="/register">Create Account</Link>
        </div>

      </form>
    </AuthLayout>
  );
}
