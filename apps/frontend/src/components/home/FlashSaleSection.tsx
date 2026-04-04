"use client";

import React, { useState, useEffect } from "react";
import { Zap, ChevronRight, Loader2, FireExtinguisher } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  sold: number;
  stock: number;
}

export function FlashSaleSection() {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 59, s: 59 });

  useEffect(() => {
    // Timer Logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);

    // Mock Flash Sale Data (In real app, fetch from backend)
    const fetchFlashSales = async () => {
      try {
        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        const flashData = data
          .filter((p: any) => p.originalPrice && p.originalPrice > p.price)
          .slice(0, 6)
          .map((p: any) => ({
            ...p,
            image: p.imageUrl,
          }));
        setProducts(flashData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSales();
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-20 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-full" />
            <div className="h-10 w-32 bg-slate-50 animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-slate-50 animate-pulse rounded-[32px] border border-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-4 md:py-8 border-b-8 border-[#f5f5f5]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-6 mb-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-black text-[#EE4D2D] tracking-tight uppercase italic flex items-center gap-2">
              <Zap className="fill-current w-6 h-6" />
              Flash Sale
            </h2>
            
            <div className="flex items-center gap-1">
              <div className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm tabular-nums">{timeLeft.h.toString().padStart(2, '0')}</div>
              <span className="font-bold text-black">:</span>
              <div className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm tabular-nums">{timeLeft.m.toString().padStart(2, '0')}</div>
              <span className="font-bold text-black">:</span>
              <div className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm tabular-nums">{timeLeft.s.toString().padStart(2, '0')}</div>
            </div>
          </div>

          <Link href="/categories" className="flex items-center gap-1 text-[#EE4D2D] font-medium text-xs hover:opacity-80 transition-all">
            Xem tất cả
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {products.map((p) => {
            const percentSold = (p.sold / p.stock) * 100;
            return (
              <Link 
                key={p.id} 
                href={`/product/${p.id}`}
                className="group flex flex-col bg-white border border-transparent hover:border-[#EE4D2D] transition-all relative"
              >
                {/* Image Container 1:1 */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-[#FFDA24] text-[#EE4D2D] text-[10px] font-bold px-1 py-1 flex flex-col items-center leading-none">
                    <span>{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%</span>
                    <span className="text-[9px] text-white font-black drop-shadow-sm">GIẢM</span>
                  </div>
                </div>

                <div className="p-2 space-y-3">
                  <div className="flex flex-col items-center">
                    <span className="text-base font-medium text-[#EE4D2D] tracking-tight">
                      <span className="text-xs underline mr-0.5">đ</span>
                      {p.price.toLocaleString("vi-VN")}
                    </span>
                  </div>

                  {/* Progress Bar (Shopee Style) */}
                  <div className="relative h-4 bg-[#FFBDA6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(percentSold, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-[#EE4D2D] to-[#ff7337]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase text-white drop-shadow-sm">
                      {percentSold > 90 ? "Sắp cháy hàng" : `Đã bán ${p.sold}`}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
