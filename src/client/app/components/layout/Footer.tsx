import React from "react";
import Link from "next/link";
import { Github, Mail } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/sign-in", label: "Sign in" },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 mt-16"
      style={{ background: "rgba(10,10,26,0.9)", backdropFilter: "blur(20px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="text-xl font-bold text-gold-gradient inline-block">
              🛒 KeethanKart
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              India&apos;s premium shopping destination. Quality products, delivered fast. 🇮🇳
            </p>
            <p className="text-xs font-semibold" style={{ color: "#f59e0b" }}>
              🏷️ Best Prices · 🚀 Fast Delivery · ✅ 100% Genuine
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer" className="space-y-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Categories
            </p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li>📱 Electronics &amp; Gadgets</li>
              <li>👗 Indian Ethnic &amp; Modern</li>
              <li>👟 Premium Footwear</li>
              <li>🏠 Smart Home &amp; Kitchen</li>
            </ul>
          </div>

          {/* Developer & Contact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Developer &amp; Project
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://github.com/keerthanrd17-dotcom/KeethanKart-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors text-white/80 group"
                >
                  <Github size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:keerthanr.d17@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors text-white/80 group"
                >
                  <Mail size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="break-all">keerthanr.d17@gmail.com</span>
                </a>
              </li>
              <li className="text-xs text-white/40 pt-1">
                Engineered with ❤️ by <span className="text-white/80 font-semibold">Keethan R</span> 🇮🇳
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <p className="text-white/40 text-xs sm:text-sm">
            © {currentYear} KeethanKart. All rights reserved. 🇮🇳 Made in India
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
            <a
              href="https://github.com/keerthanrd17-dotcom/KeethanKart-"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Github size={13} />
              <span>GitHub</span>
            </a>
            <span>·</span>
            <a
              href="mailto:keerthanr.d17@gmail.com"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Mail size={13} />
              <span>Email Author</span>
            </a>
            <span>·</span>
            <span>Prices in ₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
