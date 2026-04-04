"use client";

import React, { useEffect, useState } from "react";
import { 
  Laptop, 
  Smartphone, 
  Watch, 
  Camera, 
  Gamepad, 
  Headphones,
  ChevronRight,
  Loader2,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

interface Category {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/products/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("điện thoại") || lower.includes("phone")) return <Smartphone className="w-8 h-8" />;
    if (lower.includes("laptop") || lower.includes("máy tính")) return <Laptop className="w-8 h-8" />;
    if (lower.includes("đồng hồ") || lower.includes("watch")) return <Watch className="w-8 h-8" />;
    if (lower.includes("camera") || lower.includes("máy ảnh")) return <Camera className="w-8 h-8" />;
    if (lower.includes("game") || lower.includes("trò chơi")) return <Gamepad className="w-8 h-8" />;
    if (lower.includes("tai nghe") || lower.includes("headphone")) return <Headphones className="w-8 h-8" />;
    return <LayoutGrid className="w-8 h-8" />;
  };

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
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tất cả danh mục</h1>
            <p className="text-slate-500 font-bold">Khám phá sản phẩm theo nhóm ngành hàng phổ biến.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              href={`/?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-[32px] p-8 border shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border group-hover:border-primary">
                  {getIcon(cat.name)}
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{cat.name}</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{cat.count} Sản phẩm</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-black text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Khám phá ngay
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
