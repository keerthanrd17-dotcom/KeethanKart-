"use client";
import { useState } from "react";
import { Package, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface Item {
  id: number | string;
  name: string;
  subtitle: string;
  primaryInfo: string;
  secondaryInfo: string;
  image: string;
}

interface ListCardProps {
  title?: string;
  viewAllLink?: string;
  items: Item[];
  itemType?: "product" | "user";
}

const ListCard = ({
  title = "Top Items",
  viewAllLink,
  items = [],
  itemType = "product",
}: ListCardProps) => {
  const defaultViewAllLink = itemType === "product" ? "/shop" : "/dashboard/users";
  const finalViewAllLink = viewAllLink || defaultViewAllLink;

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-100">{title}</h3>
          <Link
            href={finalViewAllLink}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <span>View All</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-3 text-slate-400">
            <Package size={24} />
          </div>
          <p className="text-slate-400 text-sm">No {itemType}s available</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {items.map((item) => (
            <ListItem key={item.id} item={item} itemType={itemType} />
          ))}
        </div>
      )}
    </div>
  );
};

const ListItem = ({
  item,
  itemType,
}: {
  item: Item;
  itemType: "product" | "user";
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const detailUrl =
    itemType === "product"
      ? `/shop`
      : `/dashboard/users/${item.id}`;

  return (
    <Link
      href={detailUrl}
      className="block transition-all hover:bg-white/5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800/80 border border-white/10 flex items-center justify-center shadow-md">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <Package size={22} className="text-slate-400" />
              )}
            </div>
            {itemType === "user" && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
              {item.name}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs sm:text-sm font-black text-gold-gradient">
              {item.primaryInfo}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{item.secondaryInfo}</p>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-colors ${
              isHovered ? "text-amber-400 translate-x-0.5" : "text-slate-400"
            }`}
          />
        </div>
      </div>
    </Link>
  );
};

export default ListCard;
