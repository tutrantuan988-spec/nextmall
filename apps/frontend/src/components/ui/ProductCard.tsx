"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category?: string;
  brand?: string;
  rating?: number;
  sold?: number;
}

export function ProductCard({ id, name, price, originalPrice, image, category, brand, rating = 4.8, sold = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Mall branding logic
  const mallBrands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Zara', 'IKEA', 'Dell', 'HP', 'ASUS', 'Logitech'];
  const isMall = brand && mallBrands.includes(brand);
  const isFavorite = !isMall && Math.random() > 0.7; // Simulating favorite badge for others

  const discountPercent = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image });
    toast.success(`Đã thêm ${name} vào giỏ hàng`);
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:z-10"
    >
      <Link href={`/product/${id}`} className="flex flex-col h-full">
        {/* Image Container 1:1 */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-0 left-0 flex flex-col">
            {isMall && (
              <div className="bg-[#D0011B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-sm shadow-sm flex items-center gap-1">
                <span className="leading-none">Mall</span>
              </div>
            )}
            {isFavorite && (
              <div className="bg-[#F69113] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-sm shadow-sm flex items-center gap-1">
                <span className="leading-none">Yêu thích+</span>
              </div>
            )}
          </div>

          {/* Discount Tag (Top Right) */}
          {discountPercent > 0 && (
             <div className="absolute top-0 right-0">
                <div className="bg-[#FFDA24] text-[#EE4D2D] text-[10px] font-bold px-1 py-1 flex flex-col items-center leading-none">
                  <span>{discountPercent}%</span>
                  <span className="text-[9px] text-white font-black drop-shadow-sm">GIẢM</span>
                </div>
                {/* Ribbon effect bottom notch (CSS pseudo-like triangle) */}
                <div className="w-full h-1 bg-[#FFDA24] [clip-path:polygon(0_0,100%_0,50%_100%)] opacity-80" />
             </div>
          )}
        </div>

        {/* Info Container */}
        <div className="p-2 flex flex-col flex-grow space-y-2">
          {/* Title 2-line clamp */}
          <h3 className="text-xs font-normal text-slate-800 line-clamp-2 leading-relaxed min-h-[32px]">
            {name}
          </h3>
          
          {/* Pricing & Sales Metrics */}
          <div className="flex flex-col mt-auto">
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-sm font-medium text-[#EE4D2D] tracking-tight">
                <span className="text-[10px] underline mr-0.5">đ</span>
                {price.toLocaleString("vi-VN")}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[10px] text-slate-400 font-normal line-through">
                  ₫{originalPrice.toLocaleString("vi-VN")}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-1 mb-1">
               <div className="flex items-center gap-0.5">
                  <div className="flex text-[#FFD211] text-[8px]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
               </div>
               <span className="text-[10px] text-slate-500 font-normal border-l pl-2 border-slate-200">
                Đã bán {sold >= 1000 ? `${(sold/1000).toFixed(1)}k` : sold}
               </span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Quick Add Button (Bottom appearing) */}
      <button 
        onClick={handleAddToCart}
        className="absolute bottom-2 right-2 p-1.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-full transition-all border border-primary/20 opacity-0 group-hover:opacity-100"
      >
        <ShoppingCart className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
