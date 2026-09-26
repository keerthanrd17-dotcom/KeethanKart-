"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X, SlidersHorizontal } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import CheckBox from "@/app/components/atoms/CheckBox";
import { debounce } from "lodash";

export interface FilterValues {
  search: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

interface ProductFiltersProps {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  categories: Array<{ id: string; name: string }>;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  initialFilters,
  onFilterChange,
  categories,
  isMobile = false,
  onCloseMobile,
}) => {
  const { control, watch, reset, handleSubmit } = useForm<FilterValues>({
    defaultValues: initialFilters,
  });

  const formValues = watch();

  const debouncedSearch = debounce((searchValue: string) => {
    onFilterChange({ ...formValues, search: searchValue });
  }, 500);

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const onSubmit = (data: FilterValues) => {
    onFilterChange(data);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  const handleReset = () => {
    reset({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    onFilterChange({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const activeFilterCount = Object.values(formValues).filter(
    (value) => value !== undefined && value !== "" && value !== false
  ).length;

  return (
    <aside
      className={`glass-card text-slate-100 ${
        isMobile
          ? "fixed inset-0 z-50 overflow-y-auto bg-[#0a0a1a]"
          : "sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
      }`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-white/10 ${
            isMobile ? "p-4" : "p-6 pb-4"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-amber-400" />
            <h2 className="font-bold text-white text-base">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full px-2 py-0.5 border border-amber-500/30">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Content */}
        <div
          className={`flex-1 space-y-5 ${
            isMobile ? "p-4" : "p-6 pt-4"
          } overflow-y-auto`}
        >
          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Search Products
            </label>
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Search brand, phone, saree..."
                  className="w-full border border-white/15 rounded-xl p-3 text-sm focus:border-amber-400 transition-all bg-white/[0.04] text-white placeholder-slate-400"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSearchChange(e.target.value);
                  }}
                />
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={categoryOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val || undefined)}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Price Range in INR */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Price Range (₹ INR)
            </label>
            <div className="flex items-center space-x-2">
              <Controller
                name="minPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Min ₹"
                    className="border border-white/15 rounded-xl p-2.5 text-sm focus:border-amber-400 transition-all bg-white/[0.04] text-white placeholder-slate-400 w-1/2"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Max ₹"
                    className="border border-white/15 rounded-xl p-2.5 text-sm focus:border-amber-400 transition-all bg-white/[0.04] text-white placeholder-slate-400 w-1/2"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Product Flags */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Product Badges
            </label>
            <div className="space-y-3 pl-1 text-sm text-slate-200">
              <CheckBox name="isNew" control={control} label="New Arrivals" />
              <CheckBox
                name="isFeatured"
                control={control}
                label="Featured Products"
              />
              <CheckBox
                name="isTrending"
                control={control}
                label="Trending Now"
              />
              <CheckBox
                name="isBestSeller"
                control={control}
                label="Best Sellers"
              />
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div
          className={`border-t border-white/10 ${
            isMobile ? "p-4" : "p-6 pt-4"
          }`}
        >
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ProductFilters;
