"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Home } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
            <CheckCircle2 className="w-12 h-12 animate-in zoom-in duration-500 delay-300" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-xl text-muted-foreground">
            Cảm ơn bạn đã tin tưởng Shoppee. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-2xl border border-dashed border-muted-foreground/20 text-sm text-muted-foreground">
          Một email xác nhận đã được gửi đến địa chỉ của bạn với đầy đủ chi tiết hóa đơn và thông tin theo dõi.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20 group"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 rounded-xl font-bold hover:bg-secondary/80 transition-all group"
          >
            Tiếp Tục Mua Sắm
            <ShoppingBag className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="pt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          Đang chuẩn bị hàng cho bạn...
        </div>
      </div>
    </div>
  );
}
