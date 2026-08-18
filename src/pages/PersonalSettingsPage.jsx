import { useSession } from "../context/SessionContext";
import { personal } from "../components/personal/PersonalUI";

export default function PersonalSettingsPage(){
  const { user }=useSession();
  return <section className={`${personal.page} py-8 sm:py-14`}><p className={personal.eyebrow}>Your account</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Settings</h1><div className="mt-8 max-w-2xl rounded-3xl border border-white/10 bg-[#0d1119] p-6 sm:p-8"><h2 className="text-lg font-semibold text-white">Profile</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">Name</dt><dd className="mt-1 text-slate-200">{user?.full_name || "Not provided"}</dd></div><div><dt className="text-slate-500">Email</dt><dd className="mt-1 break-all text-slate-200">{user?.email}</dd></div></dl><p className="mt-7 border-t border-white/10 pt-5 text-sm leading-6 text-slate-500">Additional Personal settings will appear here only when they are functional and ready.</p></div></section>;
}
