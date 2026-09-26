import { useRouter, usePathname } from "next/navigation";
import CustomLoader from "../feedback/CustomLoader";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { isDemoMode, loginDemoUser, getDemoState } from "@/app/lib/demo";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";

export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        if (isDemoMode()) {
          const state = getDemoState();
          const adminUser =
            state.users.find((u) => u.role === "ADMIN" || u.role === "SUPERADMIN") || {
              id: "demo-user-2",
              name: "Keethan R (Admin)",
              email: "admin@keethankart.com",
              role: "ADMIN" as const,
              emailVerified: true,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
            };
          loginDemoUser(adminUser);
          dispatch(setUser({ user: adminUser }));
          return;
        }
        router.push("/sign-in");
      }
    }, [isLoading, isAuthenticated, router, dispatch]);

    if (isLoading) return <CustomLoader />;

    return <Component {...props} />;
  };
}
