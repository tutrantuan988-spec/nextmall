"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Search,
  ExternalLink,
  MapPin,
  Mail,
  User,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

const statusOptions = ["PENDING", "SHIPPING", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = () => {
    setLoading(true);
    fetch("http://localhost:3001/orders", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3001/orders/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Đã cập nhật trạng thái đơn hàng sang ${newStatus}!`);
        fetchOrders();
      } else {
        toast.error("Không thể cập nhật trạng thái.");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Đơn Hàng</h1>
        <p className="text-muted-foreground mt-2 font-medium">Theo dõi và cập nhật trạng thái của {orders.length} đơn hàng.</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
            <input
              type="text"
              placeholder="Tìm theo tên khách, ID hoặc email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-8 py-5">Đơn hàng & Khách hàng</th>
                <th className="px-6 py-5">Giá trị</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5">Ngày tạo</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y relative">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">Đang tải đơn hàng...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">Không tìm thấy đơn hàng nào.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">#{order.id.slice(0, 8)}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-bold">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs font-medium">{order.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-black text-sm tracking-tight text-primary">
                        {(order.totalAmount || 0).toLocaleString("vi-VN")} ₫
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">{order.items?.length || 0} sản phẩm</p>
                    </td>
                    <td className="px-6 py-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-black px-4 py-2 rounded-xl border-2 outline-none transition-all cursor-pointer ${
                          order.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          order.status === "SHIPPING" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-xs text-slate-500 font-medium space-y-0.5">
                        <p>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                        <p className="text-slate-400 text-[10px]">{new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
