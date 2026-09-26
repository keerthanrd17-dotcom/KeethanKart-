"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  User,
  LogOut,
  ShoppingBag,
  ChevronRight,
  HeadphonesIcon,
} from "lucide-react";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import useClickOutside from "@/app/hooks/dom/useClickOutside";
import useEventListener from "@/app/hooks/dom/useEventListener";
import { useAppDispatch } from "@/app/store/hooks";
import { logout } from "@/app/store/slices/AuthSlice";

const UserMenu = ({ menuOpen, closeMenu, user }: any) => {
  const [signout] = useSignOutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => closeMenu());

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
    }
  });

  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(logout());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      routes: [
        {
          href: "/",
          label: "Home",
          icon: <Home size={16} className="text-amber-400" />,
          show: true,
        },
        {
          href: "/shop",
          label: "Shop Store",
          icon: <ShoppingBag size={16} className="text-emerald-400" />,
          show: true,
        },
        {
          href: "/orders",
          label: "My Orders",
          icon: <ShoppingBag size={16} className="text-blue-400" />,
          show: true,
        },
        {
          href: "/profile",
          label: "Profile Settings",
          icon: <User size={16} className="text-purple-400" />,
          show: true,
        },
        {
          href: "/support",
          label: "Customer Support",
          icon: <HeadphonesIcon size={16} className="text-amber-400" />,
          show: true,
        },
      ],
    },
    {
      routes: [
        {
          href: "/admin",
          label: "Admin Dashboard",
          icon: <LayoutDashboard size={16} className="text-amber-400" />,
          show: user?.role === "ADMIN" || user?.role === "SUPERADMIN",
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 w-64 bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-2xl z-50 border border-white/10 shadow-2xl overflow-hidden p-2 text-slate-100"
        >
          {/* User info banner */}
          <div className="px-3.5 py-3 border-b border-white/10 mb-1">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-amber-400 font-medium truncate">
              {user?.email || "Signed in"}
            </p>
          </div>

          <div className="space-y-1">
            {menuItems.map((section, sIndex) => {
              const visibleRoutes = section.routes.filter((r) => r.show);
              return (
                <div key={sIndex} className="space-y-0.5">
                  {visibleRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="flex items-center px-3 py-2 gap-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-colors group"
                      onClick={closeMenu}
                    >
                      <span className="flex-shrink-0">{route.icon}</span>
                      <span className="flex-1">{route.label}</span>
                      <ChevronRight
                        size={14}
                        className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-1 pt-1 border-t border-white/10">
            <button
              onClick={() => {
                handleSignOut();
                closeMenu();
              }}
              className="flex items-center w-full px-3 py-2 gap-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs sm:text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
