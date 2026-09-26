'use client'
import { cn } from "@/app/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  percentage: number;
  caption?: string;
  icon?: React.ReactNode;
};

const StatsCard = ({
  title,
  value,
  percentage,
  caption,
  icon,
}: StatsCardProps) => {
  const isPositive = percentage >= 0;

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl w-full flex flex-col justify-between gap-3 hover:border-amber-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h3>
        {icon && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 shadow-inner group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors">
        {value}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div
          className={cn(
            "flex items-center justify-center px-2 py-0.5 rounded-full font-bold",
            isPositive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {Math.abs(percentage)}%
        </div>
        {caption && (
          <span className="text-slate-400 truncate">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
