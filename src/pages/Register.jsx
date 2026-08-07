import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";

const ACCOUNT_TYPES = [
  ["personal", "Personal", "For individuals using Aura OS for personal work, research, planning, or professional projects."],
  ["business", "Business", "For a business and its first intelligence workspace."],
  ["enterprise", "Enterprise", "For an enterprise organization with a supported initial workspace."],
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", terms: false, accountType: "business", organizationName: "", industry: "", companySize: "", workspaceName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length, [form.password]);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  async function submit(event) {
    event.preventDefault(); setError("");
    if (!form.terms) return setError("You must accept the terms to continue.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    setLoading(true);
    try {
      const payload = { email: form.email, password: form.password, full_name: form.fullName.trim(), account_type: form.accountType };
      if (form.accountType !== "personal") Object.assign(payload, { organization_name: form.organizationName.trim() || undefined, industry: form.industry.trim() || undefined, company_size: form.companySize.trim() || undefined, workspace_name: form.workspaceName.trim() || undefined });
      const { data } = await api.post("/auth/register", payload);
      login(data.access_token); navigate("/dashboard", { replace: true });
    } catch (requestError) { setError(requestError.response?.data?.detail || "Unable to create your account."); }
    finally { setLoading(false); }
  }

  return <AuthLayout title="Build with clarity." subtitle="Choose the Aura OS foundation that matches how you work."><form onSubmit={submit}>
    <AuthInput label="Full name" value={form.fullName} onChange={update("fullName")} required />
    <AuthInput label="Work email" type="email" value={form.email} onChange={update("email")} required />
    <fieldset className="mt-5"><legend className="text-sm font-medium text-slate-200">Account type</legend><div className="mt-3 grid gap-2">{ACCOUNT_TYPES.map(([value, title, copy]) => <label key={value} className={`rounded-xl border p-3 text-sm ${form.accountType === value ? "border-blue-400 bg-blue-400/10" : "border-white/10"}`}><input className="mr-2" type="radio" name="accountType" value={value} checked={form.accountType === value} onChange={update("accountType")} /><strong>{title}</strong><span className="mt-1 block text-xs text-slate-400">{copy}</span></label>)}</div></fieldset>
    {form.accountType !== "personal" && <div className="mt-5 space-y-3"><AuthInput label={form.accountType === "enterprise" ? "Enterprise name" : "Business name"} value={form.organizationName} onChange={update("organizationName")} /><AuthInput label="Industry" value={form.industry} onChange={update("industry")} /><AuthInput label="Company size" value={form.companySize} onChange={update("companySize")} /><AuthInput label="First workspace name" value={form.workspaceName} onChange={update("workspaceName")} /></div>}
    <PasswordInput label="Password" value={form.password} onChange={update("password")} required /><div className="mt-3"><div className="flex gap-1.5">{[1, 2, 3, 4].map((step) => <span key={step} className={`h-1 flex-1 rounded-full ${strength >= step ? "bg-blue-400" : "bg-white/10"}`} />)}</div></div><PasswordInput label="Confirm password" value={form.confirmPassword} onChange={update("confirmPassword")} required />
    {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<label className="mt-5 flex gap-2 text-sm text-slate-400"><input className="mt-1" type="checkbox" checked={form.terms} onChange={update("terms")} />I accept the terms of service and privacy policy.</label><button disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-blue-500 font-semibold transition hover:bg-blue-400 disabled:opacity-60">{loading ? "Creating account…" : "Create Account"}</button><p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link className="font-medium text-blue-300 hover:text-blue-200" to="/login">Sign in</Link></p>
  </form></AuthLayout>;
}
