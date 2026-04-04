"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Stats {
  totalSales: number;
  totalOrders: number;
  outOfStockCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3001/orders/stats", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Đang tải thống kê hệ thống...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Tổng doanh thu",
      value: `${(stats?.totalSales || 0).toLocaleString("vi-VN")} ₫`,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      trend: "+12.5%",
      isPositive: true,
    },
    {
      label: "Tổng đơn hàng",
      value: (stats?.totalOrders || 0).toLocaleString("vi-VN"),
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      trend: "+5.2%",
      isPositive: true,
    },
    {
      label: "Hết hàng",
      value: (stats?.outOfStockCount || 0).toLocaleString("vi-VN"),
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-600",
      trend: "-2.1%",
      isPositive: false,
    },
    {
      label: "Khách hàng mới",
      value: "1,234",
      icon: Users,
      color: "bg-amber-50 text-amber-600",
      trend: "+15.8%",
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng Quan Hệ Thống</h1>
        <p className="text-muted-foreground mt-2 font-medium">Chào mừng trở lại, Admin! Đây là diễn biến kinh doanh của shop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${card.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {card.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="text-2xl font-black mt-1 tracking-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Biểu đồ doanh thu (Mô phỏng)</h2>
          <div className="h-64 bg-slate-50 rounded-xl border border-dashed flex items-center justify-center text-slate-400 font-medium italic">
            Biểu đồ tương tác sẽ được tích hợp tại đây
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Hoạt động gần đây</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 bg-primary rounded-full ring-4 ring-primary/10" />
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">Đơn hàng #{1020 + i} vừa được đặt</p>
                  <p className="text-xs text-slate-500 font-medium">2 phút trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
