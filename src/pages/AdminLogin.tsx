import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

export function AdminLogin() {
  const navigate = useNavigate();
  const login = useAdminStore((s) => s.login);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate brief async delay for UX
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-lors-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 hero-bg-gradient opacity-60" />
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-30" />

      {/* Animated corner accents */}
      <span className="absolute top-8 left-8 block w-8 h-8 border-t border-l border-lors-accent/30" />
      <span className="absolute top-8 right-8 block w-8 h-8 border-t border-r border-lors-accent/30" />
      <span className="absolute bottom-8 left-8 block w-8 h-8 border-b border-l border-lors-accent/30" />
      <span className="absolute bottom-8 right-8 block w-8 h-8 border-b border-r border-lors-accent/30" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, rgba(0,221,255,0.06) 0%, rgba(8,14,33,0.96) 60%)",
            border: "1px solid rgba(0,221,255,0.18)",
            boxShadow: "0 0 80px rgba(0,221,255,0.08), 0 0 160px rgba(0,221,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-[8%] right-[8%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,221,255,0.9), transparent)" }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lors-accent opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lors-accent" />
              </span>
              <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-lors-glow transition-colors">
                LORS Nexus
              </span>
            </a>

            <div className="inline-flex items-center gap-2 rounded-full border border-lors-accent/25 bg-lors-accent/8 px-4 py-1.5 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-lors-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-lors-accent">
                Admin Portal
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold text-white leading-tight">
              Sign in to continue
            </h1>
            <p className="mt-1.5 text-sm text-white/45">
              Restricted access — authorised personnel only
            </p>
          </div>

          {/* Divider */}
          <div
            className="mb-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,221,255,0.2), transparent)" }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lors-accent/80">
                Username
              </label>
              <input
                id="admin-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lorsnexus"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,221,255,0.18)",
                  boxShadow: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(0,221,255,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,221,255,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(0,221,255,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lors-accent/80">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,221,255,0.18)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(0,221,255,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,221,255,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(0,221,255,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent mt-1 w-full justify-center text-sm"
              style={{ "--pa": "#00ddff", "--pr": "0", "--pg": "221", "--pb": "255" } as React.CSSProperties}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-lors-navy/40 border-t-lors-navy animate-spin" />
                  Authenticating…
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[10px] text-white/25">
            LORS Nexus Admin · Internal use only
          </p>
        </div>

        <a
          href="/"
          className="mt-5 flex justify-center text-[11px] text-white/35 hover:text-white/60 transition-colors"
        >
          ← Back to lorsnexus.com
        </a>
      </div>
    </div>
  );
}
