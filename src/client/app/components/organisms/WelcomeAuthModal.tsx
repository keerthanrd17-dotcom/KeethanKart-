"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";
import { performGoogleSignIn, formatFirebaseAuthError } from "@/app/lib/firebase";
import { useSignInMutation } from "@/app/store/apis/AuthApi";
import { loginDemoUser, setDemoState, getDemoState } from "@/app/lib/demo";
import useToast from "@/app/hooks/ui/useToast";

export default function WelcomeAuthModal() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [signInMutation, { isLoading: isEmailLoading }] = useSignInMutation();

  useEffect(() => {
    // Do not show if already logged in or checking auth
    if (authLoading || isAuthenticated) {
      setIsOpen(false);
      return;
    }

    // Do not show on auth pages or admin portal
    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/password-reset") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard")
    ) {
      setIsOpen(false);
      return;
    }

    // Check if user dismissed prompt during this session
    try {
      const dismissed = sessionStorage.getItem("keethan_welcome_auth_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage access errors in private mode
    }
  }, [isAuthenticated, authLoading, pathname]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("keethan_welcome_auth_dismissed", "true");
    } catch {
      /* ignore */
    }
    setIsOpen(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const googleUser = await performGoogleSignIn();
      dispatch(setUser({ user: googleUser }));
      handleDismiss();
      showToast(
        `Namaste, ${googleUser.name.split(" ")[0]}! Welcome to KeethanKart. 🇮🇳`,
        "success"
      );
    } catch (err: any) {
      console.error("Google sign in error:", err);
      const message = formatFirebaseAuthError(err);
      setErrorMsg(message);
      showToast(message, "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setErrorMsg(null);
    try {
      await signInMutation({ email, password }).unwrap();
      handleDismiss();
      showToast("Signed in successfully!", "success");
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setErrorMsg("Invalid credentials. Try quick demo login below!");
    }
  };

  const handleQuickDemoCustomer = () => {
    const state = getDemoState();
    const demoUser =
      state.users.find((u) => u.email === "user@keethankart.com") || {
        id: "demo-user-1",
        name: "Keethan Customer",
        email: "user@keethankart.com",
        role: "USER" as const,
        emailVerified: true,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      };

    loginDemoUser(demoUser);
    dispatch(setUser({ user: demoUser }));
    handleDismiss();
    showToast("Signed in as Keethan Customer! 🛒", "success");
  };

  const handleContinueAsGuest = () => {
    handleDismiss();
    showToast("Browsing KeethanKart as Guest! 🇮🇳", "info");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-md bg-[#0a0a1a]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 z-10 overflow-hidden text-slate-100"
          >
            {/* Top ambient glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles size={12} /> BHARAT&apos;S PREMIER STORE
              </span>
              <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
                Welcome to KeethanKart 🛒
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Sign in to unlock exclusive festive discounts, real-time tracking &amp; 1-click checkout.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                <ShieldAlert size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-lg active:scale-[0.99] mb-3 group"
            >
              {isGoogleLoading ? (
                <Loader2 className="animate-spin text-amber-400" size={18} />
              ) : (
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Login */}
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2 mb-4 active:scale-[0.99]"
            >
              <Zap size={14} />
              <span>One-Click Demo Customer Sign In</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2.5 bg-[#0a0a1a] text-slate-400 uppercase tracking-widest font-bold">
                  Or with Email
                </span>
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isEmailLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Continue as Guest Button */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} className="text-amber-400" />
                <span>Continue Browsing as Guest</span>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <div className="text-center text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  onClick={handleDismiss}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Create one now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
