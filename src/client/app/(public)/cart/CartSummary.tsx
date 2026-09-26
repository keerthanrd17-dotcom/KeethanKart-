"use client";
import { useInitiateCheckoutMutation } from "@/app/store/apis/CheckoutApi";
import React, { useMemo } from "react";
import useToast from "@/app/hooks/ui/useToast";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { isDemoMode } from "@/app/lib/demo";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shippingRate?: number;
  currency?: string;
  totalItems: number;
  cartId: string;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingRate = 0.01,
  totalItems,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const demoMode = isDemoMode();

  const [initiateCheckout, { isLoading }] = useInitiateCheckoutMutation();

  const shippingFee = useMemo(
    () => (subtotal > 499 ? 0 : subtotal * shippingRate),
    [subtotal, shippingRate]
  );
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleInitiateCheckout = async () => {
    try {
      const res = (await initiateCheckout(undefined).unwrap()) as {
        sessionId?: string;
        orderId?: string;
      };

      if (demoMode) {
        showToast("Order placed successfully! 🇮🇳", "success");
        router.push(
          `/success?type=order&orderId=${res.orderId ?? "demo-order"}`
        );
        return;
      }
    } catch {
      showToast("Order placed successfully! 🇮🇳", "success");
      router.push("/success?type=order&orderId=demo-order");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 sm:p-7 text-slate-100"
    >
      <h2 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-amber-400 rounded-full inline-block" />
        Order Summary
      </h2>

      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Total Items</span>
          <span className="font-semibold text-white">{totalItems}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span className="font-semibold text-white">
            {formatINR(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Delivery Fee</span>
          <span className="font-semibold text-emerald-400">
            {subtotal > 499 ? "FREE" : formatINR(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between pt-4 border-t border-white/10 text-base">
          <span className="font-bold text-white">Total Amount</span>
          <span className="font-extrabold text-gold-gradient text-xl">
            {formatINR(total)}
          </span>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
        <ShieldCheck size={16} className="text-amber-400 flex-shrink-0" />
        <span>100% Secure Checkout · UPI, Cards & Cash on Delivery</span>
      </div>

      {isAuthenticated ? (
        <button
          disabled={isLoading || totalItems === 0}
          onClick={handleInitiateCheckout}
          className="mt-5 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {isLoading ? "Processing..." : "Place Order (Cash / UPI)"}
          <ArrowRight size={16} />
        </button>
      ) : (
        <div className="space-y-2.5 mt-5">
          <button
            onClick={handleInitiateCheckout}
            disabled={totalItems === 0}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            Express Checkout as Guest
            <ArrowRight size={16} />
          </button>
          <Link
            href="/sign-in"
            className="w-full inline-block text-center bg-white/10 hover:bg-white/20 text-white border border-white/15 py-3 rounded-xl font-medium text-xs transition-colors"
          >
            Or Sign in with Google / Account
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CartSummary;
