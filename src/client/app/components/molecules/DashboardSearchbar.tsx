"use client";
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
import { useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";
import { SEARCH_DASHBOARD } from "@/app/gql/Dashboard";

// Code split the SearchModal component
const SearchModal = lazy(() => import("./SearchModal"));

interface DashboardSearchBarProps {
  placeholder?: string;
  className?: string;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  placeholder = "Search Dashboard",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // GraphQL Lazy Query
  const [searchDashboard, { data, loading, error }] =
    useLazyQuery(SEARCH_DASHBOARD);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery) {
        setIsLoading(true);
        searchDashboard({
          variables: {
            params: {
              searchQuery,
            },
          },
        }).finally(() => setIsLoading(false));
      }
    }, 300),
    [searchDashboard] // Add searchDashboard as a dependency
  );

  // Trigger search when query changes
  useEffect(() => {
    if (isOpen) {
      debouncedSearch(query);
    }
    return () => debouncedSearch.cancel();
  }, [query, isOpen, debouncedSearch]);

  // Ctrl + K shortcut
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if ((e.ctrlKey || e.metaKey) && e.key === "k") {
  //       e.preventDefault();
  //       setIsOpen((prev) => !prev);
  //       if (!isOpen) setQuery("");
  //     } else if (e.key === "Escape" && isOpen) {
  //       setIsOpen(false);
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [isOpen]);

  // Clear query when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10
           hover:border-amber-500/40 transition-all text-slate-300 shadow-sm ${className}`}
        aria-label="Open dashboard search (Ctrl + K)"
      >
        <Search size={16} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
        <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">
          {placeholder}
        </span>
        <kbd className="hidden sm:flex items-center text-[10px] font-bold bg-white/10 border border-white/10 px-1.5 py-0.5 rounded-md text-amber-400 ml-2">
          Ctrl K
        </kbd>
      </button>

      {isOpen && (
        <Suspense fallback={<SearchFallback />}>
          <SearchModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            query={query}
            setQuery={setQuery}
            placeholder={placeholder}
            searchResults={data?.searchDashboard || []}
            isLoading={loading || isLoading}
            error={error}
          />
        </Suspense>
      )}
    </>
  );
};

const SearchFallback = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 flex items-center justify-center py-10">
      <Loader2 className="animate-spin text-amber-400" size={32} />
    </div>
  </div>
);

export default DashboardSearchBar;
