"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface TableHeaderProps {
  title?: string;
  subtitle?: string;
  totalResults?: number;
  currentPage?: number;
  resultsPerPage?: number;
  onRefresh?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  subtitle,
  totalResults,
  currentPage,
  resultsPerPage,
  onRefresh,
}) => {
  return (
    <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="font-bold text-lg text-slate-100">{title}</h2>
          )}
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <p className="text-xs sm:text-sm text-slate-400">
        Showing {totalResults !== undefined ? totalResults : 0} results
        {currentPage ? ` (Page ${currentPage})` : ""}
        {totalResults !== undefined && totalResults > 0 && resultsPerPage
          ? `, ${resultsPerPage} per page`
          : ""}
      </p>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-400 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
