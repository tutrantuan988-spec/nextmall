"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface SearchDropdownProps {
  suggestions: Product[];
  isLoading: boolean;
  onSelect: (product: Product) => void;
}

export function SearchDropdown({ suggestions, isLoading, onSelect }: SearchDropdownProps) {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-white p-4 shadow-xl z-[100]">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-xl z-[100]"
    >
      <div className="p-2">
        <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Gợi ý sản phẩm
        </p>
        <div className="space-y-1">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={() => onSelect(product)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-all duration-300 group/item"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border">
                <Image
                  src={product.imageUrl || "/placeholder-product.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground line-clamp-1">
                  {product.name}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-muted/50 p-2 text-center text-xs text-muted-foreground">
        Nhấn <span className="font-bold">Enter</span> để tìm kiếm tất cả
      </div>
    </motion.div>
  );
}
