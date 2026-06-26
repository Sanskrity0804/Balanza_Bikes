import React, { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminLogin() {
  const { setIsAdminAuthorized } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login fail. Please check coordinates.");
      }

      // Save token & user
      localStorage.setItem("balanza_admin_jwt", data.token);
      localStorage.setItem("balanza_admin_user", JSON.stringify(data.user));
      localStorage.setItem("balanza_admin_authorized", "true");
      setIsAdminAuthorized(true);

      // Redirect to /admin
      window.history.pushState({}, "", "/admin");
      window.dispatchEvent(new Event("popstate"));
    } catch (err: any) {
      setError(err.message || "Unable to authorize. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06080F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none antialiased overflow-hidden">
      
      {/* Premium Ambient Radial Glow Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lime-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#1e293b]/30 blur-[130px] pointer-events-none" />
      
      {/* Decorative subtle matrix/grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      <div className="absolute top-6 left-6 z-15">
        <button
          onClick={() => {
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new Event("popstate"));
          }}
          className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-all cursor-pointer uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-3.5 py-2 rounded-xl backdrop-blur-md"
        >
          <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[#A7E22E]/10 border border-[#A7E22E]/25 rounded-2xl flex items-center justify-center text-[#A7E22E] shadow-[0_0_20px_rgba(167,226,46,0.15)] animate-pulse">
            <Shield className="h-8 w-8 stroke-[1.5]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-black text-white uppercase tracking-widest font-mono">
          SYSTEM AUTHENTICATION
        </h2>
        <p className="mt-2 text-center text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed uppercase tracking-wider font-semibold">
          Clearance required to access Balanza Bikes administrative suite & CMS database manager.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md p-2 z-10 relative">
        <div className="bg-[#0D111A]/90 py-8 px-6 sm:px-10 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl backdrop-blur-xl relative">
          
          {/* Top subtle border highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#A7E22E]/30 to-transparent" />

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3.5 mb-6 flex items-start gap-3 text-left animate-slide-down">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-rose-400 leading-relaxed uppercase tracking-wide">
                {error}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Administrator Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@balanza.com"
                  className="block w-full pl-10 pr-4 py-3 bg-[#06080F]/80 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-[#A7E22E] focus:ring-1 focus:ring-[#A7E22E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-[#06080F]/80 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-[#A7E22E] focus:ring-1 focus:ring-[#A7E22E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 bg-[#A7E22E] hover:bg-[#bbf045] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_4px_20px_rgba(167,226,46,0.25)] hover:shadow-[0_4px_25px_rgba(167,226,46,0.35)] active:scale-[0.98] transition-all cursor-pointer font-sans"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4.5 w-4.5 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Establishing Secure Link...</span>
                  </span>
                ) : (
                  <span>Request Owner Credentials Verification</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
          SECURE AES-256 HOST / SHIELD PROTECTION ACTIVE / BALANZA OWNER CONSOLE
        </p>
      </div>
    </div>
  );
}
