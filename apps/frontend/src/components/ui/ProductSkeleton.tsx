"use client";

import React from "react";
import { motion } from "framer-motion";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 bg-slate-200/50 rounded-full" />
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title Skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-full w-full" />
          <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 space-y-4">
          {/* Price Skeleton */}
          <div className="flex items-baseline gap-2">
            <div className="h-6 bg-slate-100 rounded-lg w-1/2" />
            <div className="h-3 bg-slate-50 rounded-lg w-1/4" />
          </div>
          
          {/* Rating/Sold Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-50 rounded-full w-1/3" />
            <div className="h-3 bg-slate-50 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
