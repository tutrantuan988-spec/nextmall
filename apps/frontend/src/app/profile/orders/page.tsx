"use client";

import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Package,
  ExternalLink,
  Loader2,
  Calendar
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrderHistoryPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3001/orders/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Could not fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] border p-20 flex flex-col items-center justify-center gap-6 shadow-sm">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <ShoppingBag className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50" />
        </div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">Đang truy xuất lịch sử đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState 
        icon={ShoppingBag}
        title="Bạn chưa có đơn hàng nào"
        description="Hãy bắt đầu mua sắm để lấp đầy lịch sử đơn hàng của bạn với những sản phẩm tuyệt vời nhé!"
        cta="Khám phá ngay"
        href="/"
      />
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-4 h-4 text-amber-500" />;
      case "SHIPPING": return <Truck className="w-4 h-4 text-blue-500" />;
      case "DELIVERED": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "CANCELLED": return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Package className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "SHIPPING": return "bg-blue-50 text-blue-600 border-blue-100";
      case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Lịch sử đơn hàng</h1>
          <p className="text-slate-400 font-bold mt-1">Danh sách {orders.length} lần mua sắm gần đây.</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="group bg-white rounded-[32px] border p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
          >
            {/* Order status stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              order.status === "PENDING" ? "bg-amber-400" :
              order.status === "SHIPPING" ? "bg-blue-400" :
              order.status === "DELIVERED" ? "bg-emerald-400" :
              "bg-rose-400"
            }`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border">
                  <ShoppingBag className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mã đơn hàng</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter">#{order.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-tighter ${getStatusColors(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-xl text-xs font-black uppercase tracking-tighter text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>

            {/* Items Preview */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex flex-wrap gap-4 mb-8">
              {order.items.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border bg-white group-hover:scale-105 transition-transform shadow-sm relative">
                  <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                  {item.quantity > 1 && (
                    <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg">
                      x{item.quantity}
                    </span>
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center text-slate-400 font-black text-xs">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t font-black">
              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase text-slate-400 tracking-widest">Tổng thanh toán:</span>
                <span className="text-2xl text-primary tracking-tighter">{order.totalAmount.toLocaleString("vi-VN")} ₫</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors py-2 px-4 hover:bg-slate-50 rounded-xl">
                  Chi tiết đơn hàng
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm shadow-xl shadow-slate-900/10 hover:-translate-y-1 transition-all">
                  Mua lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
