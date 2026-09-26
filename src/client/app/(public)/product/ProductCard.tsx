"use client";
import React, { useState, useEffect } from "react";
import { Eye, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "@/app/components/feedback/Rating";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import { useRouter } from "next/navigation";
import { generateProductPlaceholder } from "@/app/utils/placeholderImage";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useAddToCartMutation, useGetCartQuery } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { trackInteraction } = useTrackInteraction();
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { data: cartData } = useGetCartQuery({});
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    trackInteraction(product.id, "view");
  }, [product.id, trackInteraction]);

  const handleClick = () => {
    trackInteraction(product.id, "click");
    router.push(`/product/${product.slug}`);
  };

  const inCartItem = cartData?.cart?.cartItems?.find(
    (item: any) =>
      item.variant?.product?.id === product.id ||
      item.variant?.id === product.variants[0]?.id
  );
  const quantityInCart = inCartItem?.quantity ?? 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = product.variants[0];
    if (!variant) return;

    try {
      await addToCart({
        variantId: variant.id,
        quantity: 1,
      }).unwrap();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      showToast(`${product.name} added to cart! 🛒`, "success");
    } catch {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      showToast("Added to cart! 🛒", "success");
    }
  };

  // Compute lowest price among in-stock variants
  const inStockVariants = product.variants.filter(
    (variant) => variant.stock > 0
  );
  const lowestPrice =
    inStockVariants.length > 0
      ? Math.min(...inStockVariants.map((variant) => variant.price))
      : product.variants[0]?.price || 0;

  return (
    <div
      className="glass-card overflow-hidden relative h-full flex flex-col cursor-pointer group"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-52 sm:h-56 bg-white/[0.03] flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={
              product.variants[0]?.images[0] ||
              generateProductPlaceholder(product.name)
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 20vw"
            onError={(e) => {
              e.currentTarget.src = generateProductPlaceholder(product.name);
            }}
          />
        </Link>

        {/* Product Flags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              FEATURED
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-1 z-10">
          <Link href={`/product/${product.slug}`} onClick={(e) => e.stopPropagation()}>
            <div
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full p-2 transition-transform hover:scale-110 shadow"
              aria-label="View product details"
            >
              <Eye size={15} />
            </div>
          </Link>
        </div>

        {/* Stock Status */}
        {inStockVariants.length === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          {/* Category */}
          {product.category && (
            <div className="text-xs uppercase tracking-wider text-amber-400/90 font-medium mb-1.5">
              {product.category.name}
            </div>
          )}

          <h3 className="font-semibold text-slate-100 text-sm sm:text-base mb-2 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {inStockVariants.length > 0 ? (
                <span className="text-gold-gradient font-bold text-lg sm:text-xl">
                  {formatPrice(lowestPrice)}
                </span>
              ) : (
                <span className="text-gray-400 font-medium text-sm sm:text-base">
                  Out of stock
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              {product.reviewCount > 0 && (
                <span className="text-slate-400 text-xs ml-1.5">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
          <button
            className={`flex-1 font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 ${
              justAdded
                ? "bg-emerald-500 text-slate-950 scale-[1.02] shadow-emerald-500/30"
                : quantityInCart > 0
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950"
            }`}
            disabled={inStockVariants.length === 0 || isAdding}
            onClick={handleQuickAdd}
          >
            {isAdding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : justAdded ? (
              <>
                <Check size={15} className="stroke-[3]" />
                <span>Added ({quantityInCart || 1})!</span>
              </>
            ) : quantityInCart > 0 ? (
              <>
                <ShoppingCart size={15} />
                <span>In Cart ({quantityInCart}) +</span>
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
          <button
            className="bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
