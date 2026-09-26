"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";
import { isDemoMode, loginDemoUser, getDemoState } from "@/app/lib/demo";
import CustomLoader from "@/app/components/feedback/CustomLoader";

export default function AdminLandingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    }
    router.replace("/dashboard");
  }, [router, dispatch]);

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center text-slate-200">
      <CustomLoader />
      <p className="mt-4 text-sm font-medium text-amber-400/90 tracking-wide animate-pulse">
        Entering KeethanKart Admin Portal...
      </p>
    </div>
  );
}
