"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, ShoppingBag, CreditCard, Truck, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import { getDemoState } from "@/app/lib/demo";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("orderId") || "";

  const order = useMemo(() => {
    try {
      const state = getDemoState();
      return (
        state.orders.find((o) => o.id === rawOrderId) ||
        state.orders[0] ||
        null
      );
    } catch {
      return null;
    }
  }, [rawOrderId]);

  const displayOrderId =
    order?.id ? order.id.slice(-8).toUpperCase() : (rawOrderId || "KK-" + Math.floor(100000 + Math.random() * 900000));

  const totalAmount = order?.amount ?? 1299;

  const estimatedDeliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-10 text-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card max-w-xl w-full p-6 sm:p-9 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Top Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 blur-sm rounded-full" />

          {/* Success Checkmark Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>

          <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Order Confirmed · 🇮🇳 KeethanKart
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2 tracking-tight">
            Dhanyawad! Order Placed! 🎉
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Your order is confirmed and has been broadcast to our Indian fulfillment hub.
          </p>

          {/* Order Receipt Card */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Order ID
                </p>
                <p className="text-sm sm:text-base font-mono font-bold text-gold-gradient mt-0.5">
                  #{displayOrderId}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                <CreditCard size={13} />
                <span>Paid via Card / UPI</span>
              </div>
            </div>

            {/* Order Items Summary */}
            {order?.orderItems && order.orderItems.length > 0 ? (
              <div className="space-y-2 py-1 border-b border-white/10">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Items Ordered
                </p>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-200 truncate pr-2">
                      <span className="text-amber-400 font-bold">{item.quantity}x</span> {item.productName}
                    </span>
                    <span className="text-slate-300 font-medium flex-shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Total Paid & Delivery Estimate */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-slate-400">Total Paid</p>
                <p className="text-lg sm:text-xl font-extrabold text-white">
                  {formatINR(totalAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                  <Truck size={12} className="text-amber-400" /> Estimated Delivery
                </p>
                <p className="text-xs sm:text-sm font-semibold text-amber-300">
                  {estimatedDeliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Security Assurances */}
          <div className="text-left space-y-2 mb-6 bg-white/[0.02] p-3.5 rounded-xl border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span>Free Express Delivery across all Indian pin codes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span>Real-time SMS &amp; WhatsApp dispatch tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-purple-400 flex-shrink-0" />
              <span>Protected by KeethanKart 7-Day Hassle-Free Replacement</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
            <Link
              href="/admin"
              className="bg-white/10 hover:bg-white/15 text-white font-medium py-3.5 px-6 rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
            >
              <Home size={18} />
              View Admin Stream
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};
 
const SuccessPage = () => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#060814] text-white flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-amber-400 font-medium text-sm">Loading Order Details...</span>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </React.Suspense>
  );
};

export default SuccessPage;
