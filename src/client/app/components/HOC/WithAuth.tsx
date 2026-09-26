"use client";

import { useRouter, usePathname } from "next/navigation";
import CustomLoader from "../feedback/CustomLoader";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";

export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (isLoading) return;

      const isDashboardRoute = pathname.startsWith("/dashboard");

      if (isDashboardRoute) {
        // Enforce admin security gate
        const isUnlocked =
          typeof window !== "undefined" &&
          sessionStorage.getItem("keethan_admin_unlocked") === "true";
        const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

        if (!isUnlocked || !isAdmin) {
          router.replace("/admin");
          return;
        }
      }

      if (!isAuthenticated) {
        router.push("/sign-in");
      }
    }, [isLoading, isAuthenticated, user, pathname, router]);

    if (isLoading) return <CustomLoader />;

    return <Component {...props} />;
  };
}
