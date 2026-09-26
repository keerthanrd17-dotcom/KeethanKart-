"use client";
import dynamic from "next/dynamic";
import StatsCard from "@/app/components/organisms/StatsCard";
import Dropdown from "@/app/components/molecules/Dropdown";
import {
  BarChart2,
  IndianRupee,
  LineChart,
  Users,
  Sparkles,
  Radio,
  ShoppingCart,
  CreditCard,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import React, { useMemo } from "react";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useQuery } from "@apollo/client";
import { GET_ANALYTICS_OVERVIEW } from "@/app/gql/Dashboard";
import CustomLoader from "@/app/components/feedback/CustomLoader";
import ListCard from "@/app/components/organisms/ListCard";
import { withAuth } from "@/app/components/HOC/WithAuth";
import { DEMO_PRODUCTS } from "@/app/data/demo/catalog";
import { useRealtimeActivity, ActivityEvent } from "@/app/lib/demo/realtime";
import Image from "next/image";

const AreaChart = dynamic(
  () => import("@/app/components/charts/AreaChartComponent"),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("@/app/components/charts/BarChartComponent"),
  { ssr: false }
);

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange?: boolean;
}

const Dashboard = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
    },
  });
  const formatPrice = useFormatPrice();

  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const { timePeriod } = watch();

  const queryParams = {
    timePeriod: timePeriod || "allTime",
  };

  const { data, loading, error } = useQuery(GET_ANALYTICS_OVERVIEW, {
    variables: { params: queryParams },
  });

  // Real-time inter-tab sync hook
  const { activities, liveOrderCount, liveRevenueBonus } = useRealtimeActivity();

  const baseRevenue = data?.revenueAnalytics?.totalRevenue || 1845290;
  const currentTotalRevenue = baseRevenue + liveRevenueBonus;
  const baseOrders = data?.orderAnalytics?.totalSales || 685;
  const currentTotalOrders = baseOrders + liveOrderCount;
  const currentTotalInteractions =
    (data?.interactionAnalytics?.totalInteractions || 18450) + activities.length;

  const topItems =
    data?.productPerformance?.slice(0, 10).map((p: any) => {
      const prod = DEMO_PRODUCTS.find((dp) => dp.id === p.id);
      return {
        id: p.id,
        name: p.name,
        subtitle: `${p.quantity} units sold`,
        primaryInfo: formatPrice(p.revenue),
        secondaryInfo: "Total Revenue",
        image: prod?.variants?.[0]?.images?.[0] || "",
      };
    }) || [];

  const salesByProduct = {
    categories: data?.productPerformance?.map((p: any) => p.name) || [],
    data: data?.productPerformance?.map((p: any) => p.revenue) || [],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 glass rounded-2xl">
        Error loading dashboard data
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6 min-h-screen space-y-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={11} /> LIVE METRICS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time Indian catalog sales, revenue trends, and cross-tab customer activity
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Controller
            name="timePeriod"
            control={control}
            render={({ field }) => (
              <Dropdown
                onChange={field.onChange}
                options={timePeriodOptions}
                value={field.value}
                label="Time Period"
                className="w-full sm:min-w-[160px] sm:max-w-[220px]"
              />
            )}
          />
        </div>
      </div>

      {/* Stats Cards Grid (Ticking Live!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(currentTotalRevenue)}
          percentage={data?.revenueAnalytics?.changes?.revenue ?? 14.8}
          caption={liveRevenueBonus > 0 ? `+${formatPrice(liveRevenueBonus)} live today` : "since last period"}
          icon={<IndianRupee className="w-5 h-5 text-amber-400" />}
        />
        <StatsCard
          title="Total Orders & Sales"
          value={currentTotalOrders}
          percentage={data?.orderAnalytics?.changes?.sales ?? 12.4}
          caption={liveOrderCount > 0 ? `+${liveOrderCount} new live orders` : "completed deliveries"}
          icon={<BarChart2 className="w-5 h-5 text-emerald-400" />}
        />
        <StatsCard
          title="Total Interactions"
          value={currentTotalInteractions.toLocaleString("en-IN")}
          percentage={18.5}
          caption="views & cart activity"
          icon={<LineChart className="w-5 h-5 text-blue-400" />}
        />
        <StatsCard
          title="Active Customers"
          value={(data?.userAnalytics?.totalUsers || 0).toLocaleString("en-IN")}
          percentage={data?.userAnalytics?.changes?.users ?? 18.2}
          caption="registered accounts"
          icon={<Users className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* 🟢 Real-Time Customer Activity Stream (Cross-Tab Live Sync) */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Real-Time Customer Stream
            </h2>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wider">
              LIVE BROADCAST (0ms LATENCY)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Open the Store in another tab & click &quot;Add to Cart&quot; or &quot;Checkout&quot; to see actions appear instantly!
          </p>
        </div>

        {/* Live Event Cards List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activities.slice(0, 8).map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: -15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  act.type === "ORDER_PLACED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-md shadow-emerald-500/10"
                    : "bg-white/[0.03] border-white/10 text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      act.type === "ORDER_PLACED"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {act.type === "ORDER_PLACED" ? (
                      <CreditCard size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </div>

                  {act.productImage && (
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0 hidden sm:block">
                      <Image
                        src={act.productImage}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">
                      {act.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {act.description} · <span className="text-slate-300 font-medium">{act.customerName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-xs sm:text-sm font-black ${
                      act.type === "ORDER_PLACED"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {formatPrice(act.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock size={10} />
                    <span>{act.timestamp}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Revenue Trends Chart */}
      <div className="rounded-2xl overflow-hidden">
        <AreaChart
          title="Revenue Growth (₹ INR)"
          data={data?.revenueAnalytics?.monthlyTrends?.revenue || []}
          categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
          color="#f59e0b"
          percentageChange={data?.revenueAnalytics?.changes?.revenue}
        />
      </div>

      {/* Bottom Grid: Top Products & Sales by Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard
          title="Top Performing Products"
          viewAllLink="/shop"
          items={topItems}
          itemType="product"
        />
        <div className="rounded-2xl overflow-hidden">
          <BarChart
            title="Sales by Product (₹ INR)"
            data={salesByProduct.data}
            categories={salesByProduct.categories}
            color="#10b981"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default withAuth(Dashboard);
