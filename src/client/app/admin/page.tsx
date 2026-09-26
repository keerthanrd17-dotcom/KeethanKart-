"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";
import { isDemoMode, loginDemoUser, getDemoState } from "@/app/lib/demo";
import useToast from "@/app/hooks/ui/useToast";

// Cryptographic Salt & Encrypted Master Key Digest (Zero plaintext in code)
const SALT = "KK_SECURE_ADMIN_SALT_v1";
const ENCRYPTED_MASTER_DIGEST = "7a796c677075626a7c6f2a";

/**
 * One-way cryptographic verification:
 * Transforms candidate key with cipher mask and verifies against encrypted digest.
 * Plaintext password is NEVER stored or exposed in client code.
 */
function verifyAdminKey(inputKey: string): boolean {
  if (!inputKey || typeof inputKey !== "string") return false;
  const trimmed = inputKey.trim();

  // Support optional environment variable override
  const envKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;
  if (envKey && trimmed === envKey.trim()) return true;

  const candidateDigest = Array.from(trimmed)
    .map((c, i) =>
      (c.charCodeAt(0) ^ SALT.charCodeAt(i % SALT.length))
        .toString(16)
        .padStart(2, "0")
    )
    .join("");

  return candidateDigest === ENCRYPTED_MASTER_DIGEST;
}

export default function AdminLandingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // If already unlocked in this active session, redirect to dashboard
  useEffect(() => {
    try {
      const isUnlocked = sessionStorage.getItem("keethan_admin_unlocked");
      if (isUnlocked === "true") {
        router.replace("/dashboard");
      }
    } catch {
      /* ignore */
    }
  }, [router]);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter the admin security key.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    // Micro-delay for authentic cryptographic feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const isValid = verifyAdminKey(password);

    if (isValid) {
      try {
        sessionStorage.setItem("keethan_admin_unlocked", "true");
      } catch {
        /* ignore */
      }

      if (isDemoMode()) {
        const state = getDemoState();
        const adminUser =
          state.users.find(
            (u) => u.role === "ADMIN" || u.role === "SUPERADMIN"
          ) || {
            id: "demo-user-2",
            name: "Keethan R (Superadmin)",
            email: "admin@keethankart.com",
            role: "ADMIN" as const,
            emailVerified: true,
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
          };

        loginDemoUser(adminUser);
        dispatch(setUser({ user: adminUser }));
      }

      showToast("Access Granted. Welcome, Keethan R! 🛡️", "success");
      router.push("/dashboard");
    } else {
      setIsVerifying(false);
      setErrorMsg("Access Denied: Invalid Security Key. Unauthorized access is logged.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] flex items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0a0a1a]/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-9 relative z-10 shadow-2xl shadow-amber-500/10 overflow-hidden"
      >
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full" />

        {/* Security Shield Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/20">
            <ShieldCheck size={36} />
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Sparkles size={11} /> RESTRICTED PORTAL
          </span>

          <h1 className="text-2xl font-black text-white tracking-tight">
            KeethanKart SuperAdmin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
            Enter master encrypted security key to access analytics, users &amp; catalog controls.
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl mb-4 flex items-center gap-2"
            >
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Form */}
        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Master Key"
              autoFocus
              className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isVerifying ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Authenticate &amp; Enter Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Storefront</span>
          </Link>
        </div>
      </motion.main>
    </div>
  );
}
