"use client";

import React, { useState, useRef } from "react";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import useStorage from "@/app/hooks/state/useStorage";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type SearchFormValues = {
  searchQuery: string;
};

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search mobiles, sarees, boAt...",
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<SearchFormValues>(
    {
      defaultValues: {
        searchQuery: "",
      },
    }
  );

  const [recentQueries, setRecentQueries] = useStorage<string[]>(
    "recentQueries",
    []
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchQuery = watch("searchQuery");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleSearch = (data: SearchFormValues) => {
    const query = data.searchQuery.trim();
    if (query) {
      if (!recentQueries.includes(query)) {
        setRecentQueries([query, ...recentQueries.slice(0, 4)]);
      }
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    }
    setIsFocused(false);
  };

  const handleSelectRecentQuery = (query: string) => {
    setValue("searchQuery", query);
    setTimeout(() => handleSubmit(handleSearch)(), 100);
  };

  const clearSearch = () => {
    setValue("searchQuery", "");
    if (inputRef.current) inputRef.current.focus();
  };

  const removeRecentQuery = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newQueries = [...recentQueries];
    newQueries.splice(index, 1);
    setRecentQueries(newQueries);
  };

  const showSearchResults = isFocused || isHoveringDropdown;

  return (
    <div className="relative w-full max-w-xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleSearch)}
        className="relative"
      >
        <div className="flex items-center">
          <div className="relative flex items-center w-full">
            <span className="absolute left-3.5 text-amber-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={placeholder}
              className="w-full py-2.5 pl-10 pr-12 bg-white/[0.06] rounded-full text-white placeholder-slate-400 border border-white/15 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-xs sm:text-sm transition-all duration-200"
              {...register("searchQuery")}
              onFocus={() => setIsFocused(true)}
              ref={(e) => {
                inputRef.current = e;
                const { ref } = register("searchQuery");
                if (typeof ref === "function") ref(e);
              }}
              autoComplete="off"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-11 p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X size={12} />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="absolute right-1.5 p-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:scale-105 transition-all shadow-sm"
              aria-label="Search"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute w-full mt-2 bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-2xl shadow-2xl z-[1000] border border-white/10 overflow-hidden"
            onMouseEnter={() => setIsHoveringDropdown(true)}
            onMouseLeave={() => setIsHoveringDropdown(false)}
          >
            {/* Recent searches section */}
            {recentQueries.length > 0 && (
              <div className="p-3 text-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center text-slate-400">
                    <Clock size={12} className="mr-1.5" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    className="text-xs text-amber-400 font-medium hover:underline"
                    onClick={() => setRecentQueries([])}
                  >
                    Clear all
                  </button>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {recentQueries.map((query, index) => (
                    <li
                      key={index}
                      className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-slate-200 cursor-pointer transition-colors"
                      onClick={() => handleSelectRecentQuery(query)}
                    >
                      <span>{query}</span>
                      <button
                        onClick={(e) => removeRecentQuery(index, e)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X size={10} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
