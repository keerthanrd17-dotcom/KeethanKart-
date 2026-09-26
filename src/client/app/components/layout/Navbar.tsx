"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  LogOut,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "../molecules/SearchBar";
import { useGetCartCountQuery } from "@/app/store/apis/CartApi";
import useClickOutside from "@/app/hooks/dom/useClickOutside";
import useEventListener from "@/app/hooks/dom/useEventListener";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppDispatch } from "@/app/store/hooks";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import { logout } from "@/app/store/slices/AuthSlice";
import { generateUserAvatar } from "@/app/utils/placeholderImage";

const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [signout] = useSignOutMutation();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: cartData } = useGetCartCountQuery(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEventListener("scroll", () => {
    setScrolled(window.scrollY > 20);
  });

  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(logout());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a1a]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-2"
            : "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 py-3 sm:py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <span className="text-xl sm:text-2xl font-extrabold text-gold-gradient tracking-tight">
                🛒 KeethanKart
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                <Sparkles size={11} /> INDIA
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar />
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-5 text-sm font-medium text-slate-300">
              <Link href="/shop" className="hover:text-amber-400 transition-colors">
                Shop
              </Link>
              <Link href="/orders" className="hover:text-amber-400 transition-colors">
                Orders
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-amber-400 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-slate-200 hover:text-amber-400 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="text-[22px] sm:text-[24px]" />
                {((cartData?.count ?? cartData?.cartCount ?? 0) > 0) && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg shadow-amber-500/40 animate-in zoom-in-75 duration-200">
                    {(cartData?.count ?? cartData?.cartCount) > 99
                      ? "99+"
                      : (cartData?.count ?? cartData?.cartCount)}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {!isLoading && isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center p-1 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-amber-500/50">
                        <Image
                          src={user.avatar}
                          alt="User Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = generateUserAvatar(user.name);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/50">
                        <Image
                          src={generateUserAvatar(user?.name || "User")}
                          alt="User Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </button>

                  {menuOpen && (
                    <UserMenu
                      user={user}
                      menuOpen={menuOpen}
                      closeMenu={() => setMenuOpen(false)}
                    />
                  )}
                </div>
              ) : (
                pathname !== "/sign-up" &&
                pathname !== "/sign-in" && (
                  <Link
                    href="/sign-in"
                    className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl transition-all"
                  >
                    Sign in
                  </Link>
                )
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-amber-400 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden py-3 border-t border-white/10">
              <SearchBar />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a1a]/95 backdrop-blur-2xl shadow-2xl border-t border-white/10"
            >
              <div className="px-4 py-3 space-y-2">
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/sign-in"
                      className="block px-3 py-2 text-slate-200 hover:bg-white/10 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block px-3 py-2 text-slate-200 hover:bg-white/10 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <Link
                  href="/"
                  className="block px-3 py-2 text-slate-200 hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="block px-3 py-2 text-slate-200 hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-slate-200 hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-amber-400 hover:bg-white/10 rounded-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 gap-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
