import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length, [form.password]);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.terms) return setError("You must accept the terms to continue.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        full_name: form.fullName.trim(),
        account_type: "personal",
      });
      login(data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return <AuthLayout title="Start your Personal Space." subtitle="Create a private space for the decisions and goals that matter to you."><form onSubmit={submit}>
    <div className="border-b border-white/10 pb-5"><p className="text-xs font-semibold tracking-[.14em] text-blue-300">STEP 1 · IDENTITY</p><AuthInput label="Full name" value={form.fullName} onChange={update("fullName")} required /><AuthInput label="Work email" type="email" value={form.email} onChange={update("email")} required /></div>
    <div className="pt-6"><p className="text-xs font-semibold tracking-[.14em] text-blue-300">STEP 2 · SECURITY</p><PasswordInput label="Password" value={form.password} onChange={update("password")} required /><div className="mt-3"><div className="flex gap-1.5" aria-label={`Password strength: ${strength} of 4`}>{[1, 2, 3, 4].map((step) => <span key={step} className={`h-1 flex-1 rounded-full ${strength >= step ? "bg-blue-400" : "bg-white/10"}`} />)}</div></div><PasswordInput label="Confirm password" value={form.confirmPassword} onChange={update("confirmPassword")} required /></div>
    {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<label className="mt-5 flex gap-2 text-sm text-slate-400"><input className="mt-1" type="checkbox" checked={form.terms} onChange={update("terms")} />I accept the terms of service and privacy policy.</label><button disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-blue-500 font-semibold transition hover:bg-blue-400 disabled:opacity-60">{loading ? "Creating account…" : "Create Account"}</button><p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link className="font-medium text-blue-300 hover:text-blue-200" to="/login">Sign in</Link></p>
  </form></AuthLayout>;
}
