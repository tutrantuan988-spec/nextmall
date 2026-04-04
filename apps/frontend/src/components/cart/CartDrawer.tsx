"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Giỏ hàng ({getTotalItems()})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button
                    onClick={onClose}
                    className="text-primary font-medium hover:underline"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border rounded-xl bg-muted/5">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      {/* Using a placeholder-like div if image is local or external */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-cta font-bold mt-1">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-muted/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng cộng</span>
                  <span className="text-xl font-bold text-cta">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getTotalPrice())}
                  </span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Thanh Toán Ngay
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Xem chi tiết giỏ hàng
                </Link>
                <p className="text-[10px] text-center text-muted-foreground">
                  Phí vận chuyển và thuế được tính khi thanh toán
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
