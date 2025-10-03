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

      // Check if user is in admin whitelist
      const { data, error } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", user.email)
        .single();

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
