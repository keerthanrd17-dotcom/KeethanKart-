"use client";

import React from "react";
import { useGetUserOrdersQuery } from "@/app/store/apis/OrderApi";
import MainLayout from "@/app/components/templates/MainLayout";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { withAuth } from "@/app/components/HOC/WithAuth";
import OrderCardSkeleton from "@/app/components/feedback/OrderCardSkeleton";
import OrderFilters from "@/app/components/molecules/OrderFilters";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { color: "bg-amber-500/20 text-amber-300 border border-amber-500/30", icon: Clock },
      PROCESSING: { color: "bg-blue-500/20 text-blue-300 border border-blue-500/30", icon: Clock },
      SHIPPED: { color: "bg-purple-500/20 text-purple-300 border border-purple-500/30", icon: Truck },
      IN_TRANSIT: { color: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30", icon: Truck },
      DELIVERED: { color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", icon: CheckCircle },
      CANCELED: { color: "bg-red-500/20 text-red-300 border border-red-500/30", icon: XCircle },
      RETURNED: { color: "bg-orange-500/20 text-orange-300 border border-orange-500/30", icon: XCircle },
      REFUNDED: { color: "bg-slate-500/20 text-slate-300 border border-slate-500/30", icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      <IconComponent size={12} className="sm:w-3 sm:h-3 mr-1" />
      <span>{status.replace("_", " ")}</span>
    </div>
  );
};

// Order card component
const OrderCard = ({ order }: { order: any }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getItemCount = (orderItems: any[]) => {
    return (
      orderItems?.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      ) || 0
    );
  };

  const truncateId = (id: string) => {
    return id.length > 10 ? `${id.substring(0, 10)}...` : id;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card hover:border-amber-500/30 transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <Package size={14} className="text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-slate-200 font-bold truncate">
                Order #{truncateId(order.id)}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar size={12} className="text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 truncate">
                {formatDate(order.orderDate)}
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Receipt size={16} className="text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">Total Amount</p>
              <p className="text-sm sm:text-base font-bold text-gold-gradient truncate">
                {formatCurrency(order.amount)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShoppingBag size={16} className="text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">Total Items</p>
              <p className="text-sm sm:text-base font-bold text-white">
                {getItemCount(order.orderItems)} items
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/10">
            <div className="space-y-1.5">
              {order.orderItems.slice(0, 2).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs text-slate-300"
                >
                  <span className="truncate flex-1 mr-2">
                    {item.variant?.product?.name || item.productName || "Product"}
                    {item.quantity > 1 && ` (×${item.quantity})`}
                  </span>
                  <span className="font-semibold text-amber-400 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {order.orderItems.length > 2 && (
                <p className="text-[11px] text-slate-400 pt-1">
                  +{order.orderItems.length - 2} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/orders/${order.id}`}
          className="w-full flex items-center justify-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-3 rounded-xl border border-white/15 transition-all group text-xs sm:text-sm"
        >
          <span>Track Order</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </motion.div>
  );
};

const UserOrders = () => {
  const { data, isLoading, error } = useGetUserOrdersQuery({});
  const orders = data?.orders || [];

  const [statusFilter, setStatusFilter] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const filteredAndSortedOrders = React.useMemo(() => {
    let filtered = orders;

    if (statusFilter) {
      filtered = filtered.filter((order: any) => order.status === statusFilter);
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [orders, statusFilter, sortOrder]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-10 text-slate-100">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-2.5 mb-6"
        >
          <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full inline-block" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Orders
          </h1>
        </motion.div>

        {/* Filters */}
        {!isLoading && orders.length > 0 && (
          <OrderFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="glass-card text-center py-12 p-6">
            <p className="text-base text-red-400">
              Error loading orders. Please try again.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card text-center py-16 px-6">
            <Package size={48} className="mx-auto text-amber-400/70 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">You have no orders yet</h2>
            <p className="text-sm text-slate-400 mb-6">
              Start exploring KeethanKart for the best Indian deals.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="glass-card text-center py-12 px-6">
            <Package size={40} className="mx-auto text-slate-400 mb-3" />
            <p className="text-base text-slate-200">
              No orders match your filter
            </p>
            <button
              onClick={() => setStatusFilter("")}
              className="mt-3 text-amber-400 hover:underline font-semibold text-sm"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedOrders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default withAuth(UserOrders);
