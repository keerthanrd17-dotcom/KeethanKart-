"use client";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import MainLayout from "@/app/components/templates/MainLayout";
import { Trash2, ShoppingCart, ShoppingBag } from "lucide-react";
import React, { useMemo } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import CartSummary from "@/app/(public)/cart/CartSummary";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "@/app/store/apis/CartApi";
import QuantitySelector from "@/app/components/molecules/QuantitySelector";
import { motion } from "framer-motion";
import CartSkeletonLoader from "@/app/components/feedback/CartSkeletonLoader";
import { generateProductPlaceholder } from "@/app/utils/placeholderImage";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import Link from "next/link";

const formatVariantName = (item: any) => {
  const { name } = item.variant.product;
  const sku = item.variant.sku;
  const parts = sku.split("-").slice(1);
  if (!parts.length) return name;
  return `${name} (${parts.join(", ")})`;
};

const Cart = () => {
  const { control } = useForm();
  const formatPrice = useFormatPrice();
  const { data, isLoading } = useGetCartQuery({});
  const [removeFromCart] = useRemoveFromCartMutation();
  const cartItems = data?.cart?.cartItems || [];

  const subtotal = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce(
      (sum: number, item: any) => sum + item.variant.price * item.quantity,
      0
    );
  }, [cartItems]);

  const handleRemoveFromCart = async (id: string) => {
    try {
      await removeFromCart(id).unwrap();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-slate-100">
        <BreadCrumb />

        {/* Cart Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mt-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shopping Cart
            </h1>
            <span className="text-amber-400 font-semibold text-sm bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {cartItems.length} items
            </span>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm text-slate-300 hover:text-amber-400 font-medium transition-colors"
          >
            ← Continue Shopping
          </Link>
        </motion.div>

        {/* Cart Content */}
        {isLoading ? (
          <CartSkeletonLoader />
        ) : cartItems.length === 0 ? (
          <div className="glass-card text-center py-16 px-6">
            <ShoppingCart size={48} className="mx-auto text-amber-400/80 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Looks like you haven&apos;t added any Indian fashion or electronics yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              <ShoppingBag size={18} />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3.5">
              {cartItems.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white/[0.04] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10 relative">
                    <Image
                      src={
                        item?.variant?.images?.[0] ||
                        generateProductPlaceholder(item.variant.product.name)
                      }
                      alt={formatVariantName(item)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 80px"
                      onError={(e) => {
                        e.currentTarget.src = generateProductPlaceholder(
                          item.variant.product.name
                        );
                      }}
                    />
                  </div>

                  {/* Variant Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm sm:text-base leading-snug truncate">
                      {formatVariantName(item)}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-400 font-bold mt-1">
                      {formatPrice(item.variant.price)}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <Controller
                    name={`quantity-${item.variant.id}`}
                    defaultValue={item.quantity}
                    control={control}
                    render={({ field }) => (
                      <QuantitySelector
                        itemId={item.id}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Subtotal and Remove */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <p className="font-bold text-gold-gradient text-sm sm:text-base">
                      {formatPrice(item.variant.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                totalItems={cartItems.length}
                cartId={data?.cart?.id}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
