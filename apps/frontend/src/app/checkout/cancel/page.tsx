"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="container mx-auto py-24 px-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto scale-in-center">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Thanh Toán Đã Hủy</h1>
        <p className="text-muted-foreground text-lg">
          Thanh toán cho đơn hàng <span className="font-bold text-foreground">#{orderId}</span> đã bị hủy. Đừng lo lắng, giỏ hàng của bạn vẫn được lưu lại.
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            href="/checkout"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Thanh Toán Lại
          </Link>
          <Link
            href="/"
            className="border border-primary text-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
