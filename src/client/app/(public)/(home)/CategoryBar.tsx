"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCatalogCategories } from "@/app/hooks/catalog/useCatalogCategories";
import {
  Smartphone,
  Sparkles,
  Footprints,
  CookingPot,
  Package,
} from "lucide-react";

// Category icon mapping
const categoryIcons: Record<string, React.ElementType> = {
  electronics: Smartphone,
  "indian-fashion": Sparkles,
  footwear: Footprints,
  "home-kitchen": CookingPot,
};

const CategoryBar = () => {
  const { categories, loading: isLoading, error } = useCatalogCategories();

  const getCategoryIcon = (slug: string) => {
    return categoryIcons[slug] || Package;
  };

  if (isLoading) {
    return (
      <section className="pt-8 sm:pt-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-6 overflow-x-auto">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-36 h-28 glass-card animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories.length) {
    return null;
  }

  return (
    <section className="pt-8 sm:pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white capitalize tracking-tight flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full inline-block" />
            Explore Categories
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.slug);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <Link
                  href={`/shop?categoryId=${category.id}`}
                  className="block h-full"
                >
                  <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-amber-500/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-all">
                      <Icon className="w-7 h-7 text-amber-400" />
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
