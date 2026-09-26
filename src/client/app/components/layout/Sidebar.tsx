"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import useStorage from "@/app/hooks/state/useStorage";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Users,
  LogOut,
  PanelsRightBottom,
  Boxes,
  ChartCandlestick,
  ClipboardPlus,
  ClipboardCheck,
  Section,
  ChartArea,
  Store,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useStorage<boolean>(
    "sidebarOpen",
    true,
    "local"
  );
  const pathname = usePathname();
  const router = useRouter();
  const [signout] = useSignOutMutation();

  const sections = useMemo(
    () => [
      {
        title: "Overview",
        links: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        title: "E-Commerce",
        links: [
          { name: "Products", href: "/products", icon: Layers },
          { name: "Inventory", href: "/inventory", icon: Section },
          { name: "Attributes", href: "/attributes", icon: Layers },
          { name: "Categories", href: "/categories", icon: Boxes },
          { name: "Transactions", href: "/transactions", icon: ShoppingCart },
          { name: "Customers", href: "/users", icon: Users },
          { name: "Support Chats", href: "/chats", icon: ChartArea },
        ],
      },
      {
        title: "Analytics & Logs",
        links: [
          { name: "Analytics", href: "/analytics", icon: ChartCandlestick },
          { name: "Reports", href: "/reports", icon: ClipboardPlus },
          { name: "Audit Logs", href: "/logs", icon: ClipboardCheck },
        ],
      },
    ],
    []
  );

  const prependDashboard = (href: string) =>
    href.startsWith("/dashboard") ? href : `/dashboard${href}`;

  const handleSignOut = async () => {
    try {
      await signout().unwrap();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarLink = ({
    name,
    href,
    Icon,
  }: {
    name: string;
    href: string;
    Icon: React.ElementType;
  }) => {
    const fullHref = prependDashboard(href);
    const isActive = pathname === fullHref;

    return (
      <Link
        href={fullHref}
        prefetch={false}
        className={`relative group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 font-semibold border border-amber-500/30 shadow-md shadow-amber-500/10"
            : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
        }`}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <Icon
            className={`h-5 w-5 transition ${
              isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400"
            }`}
          />
        </motion.div>
        {isOpen && <span className="text-xs sm:text-sm tracking-wide truncate">{name}</span>}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{
        width: isOpen ? 260 : 76,
        transition: { duration: 0.25, ease: "easeInOut" },
      }}
      className="bg-[#0a0a1a]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl min-h-screen flex flex-col p-4 justify-between md:sticky md:top-0 z-40"
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
          {isOpen ? (
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-black text-gold-gradient tracking-tight">
                🛒 KeethanKart
              </span>
              <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                ADMIN
              </span>
            </Link>
          ) : (
            <span className="text-lg font-black text-amber-400 mx-auto">🛒</span>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition"
            aria-label="Toggle sidebar"
          >
            <PanelsRightBottom size={18} />
          </button>
        </div>

        {/* Quick Link to Storefront */}
        {isOpen && (
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 mb-4 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 border border-white/5 hover:border-amber-500/20 transition-all"
          >
            <Store size={15} className="text-amber-400" />
            <span>Storefront Frontpage</span>
          </Link>
        )}

        {/* Navigation */}
        <nav className="flex flex-col space-y-3">
          {sections.map((section, idx) => (
            <div key={section.title} className="mb-1">
              {isOpen && (
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400/90 px-3 mb-1.5">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.links.map((link) => (
                  <SidebarLink
                    key={link.name}
                    name={link.name}
                    href={link.href}
                    Icon={link.icon}
                  />
                ))}
              </div>
              {idx < sections.length - 1 && (
                <hr className="my-2.5 border-t border-white/5" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="pt-4 border-t border-white/10 mt-auto">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200 group text-red-400"
        >
          <LogOut className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
          {isOpen && (
            <span className="text-xs font-bold tracking-wide">Sign Out</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
