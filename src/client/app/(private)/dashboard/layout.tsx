"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ExternalLink, ShieldCheck } from "lucide-react";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import Sidebar from "../../components/layout/Sidebar";
import DashboardSearchBar from "@/app/components/molecules/DashboardSearchbar";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    try {
      const isUnlocked = sessionStorage.getItem("keethan_admin_unlocked") === "true";
      const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
      if (!isUnlocked || !isAdmin) {
        router.replace("/admin");
      }
    } catch {
      /* ignore */
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#060814] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-2xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <BreadCrumb />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <DashboardSearchBar />

            {/* View Storefront Quick Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all shadow-sm"
              title="Open storefront in new tab"
            >
              <span>View Storefront</span>
              <ExternalLink size={13} />
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/30 to-purple-500/30 border border-amber-500/30 overflow-hidden shadow-inner">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "Admin"}
                    fill
                    sizes="36px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200 leading-tight flex items-center gap-1">
                  {user?.name || "Keethan R"}
                  <ShieldCheck size={12} className="text-emerald-400 inline" />
                </span>
                <span className="text-[10px] font-semibold text-amber-400 tracking-wider">
                  SUPERADMIN
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-[#060814] via-[#090b1c] to-[#060814]">
          {children}
        </main>
      </div>
    </div>
  );
}
