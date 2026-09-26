"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BreadCrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-xs sm:text-sm text-slate-400 space-x-1.5 sm:space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="hover:text-amber-400 text-slate-400 font-medium transition-colors"
          >
            Dashboard
          </Link>
        </li>

        {pathSegments.slice(1).map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 2).join("/");
          const isLast = index === pathSegments.length - 2;

          return (
            <React.Fragment key={href}>
              <span className="text-white/20">/</span>
              <li>
                {isLast ? (
                  <span className="capitalize font-bold text-amber-400">
                    {decodeURIComponent(segment)}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="capitalize hover:text-amber-400 text-slate-300 font-medium transition-colors"
                  >
                    {decodeURIComponent(segment)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
