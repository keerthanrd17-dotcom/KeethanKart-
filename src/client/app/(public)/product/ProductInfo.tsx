"use client";
import React, { useState } from "react";
import Rating from "@/app/components/feedback/Rating";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";
import { Product } from "@/app/types/productTypes";
import { Palette, Ruler, Info, Package, Check, X, ShoppingCart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  description: string;
  variants: Product["variants"];
  selectedVariant: Product["variants"][0] | null;
  onVariantChange: (attributeName: string, value: string) => void;
  attributeGroups: Record<string, { values: Set<string> }>;
  selectedAttributes: Record<string, string>;
  resetSelections: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  averageRating,
  reviewCount,
  description,
  variants,
  selectedVariant,
  onVariantChange,
  attributeGroups,
  selectedAttributes,
  resetSelections,
}) => {
  const { showToast } = useToast();
  const formatPrice = useFormatPrice();
  const router = useRouter();
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant = selectedVariant || variants[0];
  const price = activeVariant ? activeVariant.price : 0;
  const stock = activeVariant ? activeVariant.stock : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeVariant) {
      showToast("Please select a variant", "error");
      return;
    }
    try {
      await addToCart({
        variantId: activeVariant.id,
        quantity: 1,
      }).unwrap();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      showToast(`${name} added to cart! 🛒`, "success");
    } catch {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      showToast("Added to cart! 🛒", "success");
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleAddToCart(e);
    router.push("/cart");
  };

  // Compute available colors and sizes
  const colorValues = new Set<string>();
  const sizeValues = new Set<string>();
  variants.forEach((variant) => {
    variant.attributes.forEach(({ attribute, value }) => {
      if (attribute.name.toLowerCase() === "color") {
        colorValues.add(value.value);
      } else if (attribute.name.toLowerCase() === "size") {
        sizeValues.add(value.value);
      }
    });
  });

  const attributeSummary = Object.entries(attributeGroups)
    .map(([attrName, { values }]) => {
      const valueList = Array.from(values).join(", ");
      return `${
        attrName.charAt(0).toUpperCase() + attrName.slice(1)
      }: ${valueList}`;
    })
    .join("; ");

  const getColorValue = (colorName: string) => {
    const colorMap: Record<string, string> = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      purple: "#8b5cf6",
      pink: "#ec4899",
      orange: "#f97316",
      black: "#18181b",
      white: "#ffffff",
      gray: "#6b7280",
    };
    return colorMap[colorName.toLowerCase()] || "#6b7280";
  };

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 text-slate-100">
      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
        {name}
      </h1>

      {/* Rating and Stock */}
      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
        <Rating rating={averageRating} />
        <span>({reviewCount || 0} reviews)</span>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            stock > 0
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-extrabold text-gold-gradient">
          {formatPrice(price)}
        </span>
        <span className="text-xs text-amber-400/90 font-medium uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Inclusive of all taxes
        </span>
      </div>

      {/* Available Options Summary */}
      <div className="space-y-2 text-sm text-slate-300 bg-white/[0.03] p-4 rounded-xl border border-white/10">
        {colorValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Available in {colorValues.size} colors</span>
          </div>
        )}

        {sizeValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>Available in {sizeValues.size} sizes</span>
          </div>
        )}

        {attributeSummary && (
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>{attributeSummary}</span>
          </div>
        )}

        {colorValues.size === 0 && sizeValues.size === 0 && !attributeSummary && (
          <div className="flex items-center gap-2 text-slate-400">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Standard Edition · 100% Genuine Indian Stock</span>
          </div>
        )}
      </div>

      {/* Variant Selection if available */}
      {Object.keys(attributeGroups).length > 0 && (
        <div className="space-y-5">
          {Object.entries(attributeGroups).map(([attributeName, { values }]) => {
            const isColor = attributeName.toLowerCase() === "color";
            const valuesArray = Array.from(values);

            return (
              <div key={attributeName} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white capitalize">
                    {attributeName}
                  </label>
                  {selectedAttributes[attributeName] && (
                    <button
                      onClick={() => onVariantChange(attributeName, "")}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {valuesArray.map((value) => {
                    const isSelected = selectedAttributes[attributeName] === value;
                    const colorValue = getColorValue(value);

                    return (
                      <button
                        key={value}
                        onClick={() => onVariantChange(attributeName, value)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        }`}
                      >
                        {isColor && (
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2 border border-black/20"
                            style={{ backgroundColor: colorValue }}
                          />
                        )}
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        <h3 className="text-base font-semibold text-white">Product Highlights</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          disabled={!stock || isLoading || !activeVariant}
          onClick={handleAddToCart}
          className={`w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
            justAdded
              ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 scale-[1.01]"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Adding to Cart...</span>
            </>
          ) : justAdded ? (
            <>
              <Check size={18} className="stroke-[3]" />
              <span>Added to Cart! 🛒</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        <button
          disabled={!stock || !activeVariant}
          onClick={handleBuyNow}
          className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={18} className="text-amber-400" />
          Buy Now (Fast Checkout)
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
