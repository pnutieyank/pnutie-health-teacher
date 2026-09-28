import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_profiles")
        .select("id, role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (mounted) {
        setAuthorized(!error && !!data && ["admin", "editor"].includes(data.role));
        setLoading(false);
      }
    }

    checkAdmin();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(() => {
        checkAdmin();
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Checking administrator access…</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
