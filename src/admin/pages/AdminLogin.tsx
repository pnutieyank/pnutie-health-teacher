import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError || !data.user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admin_profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .maybeSingle();

    if (adminError || !admin || !["admin", "editor"].includes(admin.role)) {
      await supabase.auth.signOut();
      setError("This account is not authorized to access the admin portal.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <img src="/punutie-logo.png" alt="PUNUTIE HEALTH TEACHER" />
        </div>

        <p className="admin-eyebrow">PUNUTIE HEALTH TEACHER</p>

        <h1>Admin Portal</h1>

        <p className="admin-login-description">
          Secure access for managing health education content.
        </p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" disabled={loading}>
            <LockKeyhole size={18} />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <a href="/" className="admin-back-link">
          ← Back to public website
        </a>
      </section>
    </main>
  );
}
