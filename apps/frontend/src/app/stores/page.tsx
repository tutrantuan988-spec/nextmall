"use client";

import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Store, 
  MapPin, 
  Star, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Layers
} from "lucide-react";
import Link from "next/link";

interface Brand {
  name: string;
  count: number;
}

export default function StoresPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:3001/products/brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <Store className="w-10 h-10 text-primary" />
              Official Stores
            </h1>
            <p className="text-slate-500 font-bold max-w-xl">
              Khám phá và mua sắm tại các gian hàng thương hiệu chính hãng. 
              Cam kết 100% sản phẩm chất lượng cao từ Shoppee Mall.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brands.map((brand) => (
            <div 
              key={brand.name}
              className="bg-white rounded-[32px] border p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden group"
            >
              {/* Brand Banner Preview */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 border-l skew-x-[-15deg] translate-x-12 opacity-50 group-hover:opacity-100 transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Brand Logo Placeholder */}
                  <div className="w-24 h-24 bg-white rounded-3xl border shadow-xl flex items-center justify-center font-black text-2xl text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Layers className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{brand.name}</h3>
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3 h-3" />
                        Official
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3 h-3" />
                        {brand.count} Sản phẩm
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">4.9 (2.4k Đánh giá)</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/?brand=${encodeURIComponent(brand.name)}`}
                  className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group-hover:scale-110"
                >
                  Ghé thăm gian hàng
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mall Perks */}
              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 rounded-xl border border-dashed text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Chính hãng 100%
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 rounded-xl border border-dashed text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Giao hàng 2h
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
