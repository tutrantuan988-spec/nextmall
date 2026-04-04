"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "sonner";

import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 h-[70vh] flex items-center justify-center">
        <EmptyState 
          icon={ShoppingCart}
          title="Giỏ hàng của bạn đang trống"
          description="Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào. Hãy khám phá những ưu đãi mới nhất ngay!"
          cta="Khám Phá Ngay"
          href="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Giỏ Hàng</h1>
            <p className="text-muted-foreground mt-2">
              Bạn đang có {getTotalItems()} sản phẩm trong giỏ hàng.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục chọn đồ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex items-center gap-6 border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                    <p className="text-primary font-semibold mt-1">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-muted transition-colors border-r"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors border-l"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success(`Đã xóa ${item.name} khỏi giỏ hàng.`);
                      }}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-2xl border shadow-sm p-8 space-y-6 sticky top-24">
              <h2 className="text-2xl font-bold">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-semibold">{getTotalPrice().toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-semibold text-green-500">Miễn phí</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Tổng tiền</span>
                  <span className="text-primary">{getTotalPrice().toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl flex items-center justify-center font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Tiến Hành Thanh Toán
              </Link>
              <p className="text-center text-xs text-muted-foreground italic">
                Miễn phí đổi trả trong vòng 30 ngày.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
