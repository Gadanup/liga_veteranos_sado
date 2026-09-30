import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export const useIsAdmin = (requireAuth = false) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        if (requireAuth) {
          router.push("/admin/login");
        }
        return;
      }

      setUser(user);

      // Check if user is in admin whitelist.
      // The read_own_admin_row policy already restricts this to the caller's
      // own row, matching on lower(email) at both ends, so no client-side
      // filter is needed — and the .eq("email", user.email) that used to be
      // here failed whenever the stored email differed in case.
      const { data, error } = await supabase
        .from("admin_users")
        .select("email")
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if (requireAuth) {
          await supabase.auth.signOut();
          router.push("/admin/login");
        }
      }

      setLoading(false);
    };

    checkAdmin();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [requireAuth, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
    router.push("/");
  };

  return { isAdmin, loading, user, logout };
};
