"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Loader2, ShieldAlert, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl border shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">Truy Cập Bị Từ Chối</h1>
            <p className="text-slate-500 font-medium text-sm">
              Bạn không có quyền truy cập vào trung tâm điều khiển. 
              Vui lòng đăng nhập bằng tài khoản Quản trị viên.
            </p>
          </div>
          <button 
            onClick={() => router.push("/login")}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Đến trang Đăng nhập
          </button>
          <button 
            onClick={() => router.push("/")}
            className="w-full text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-6 right-6 z-[100] p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-all"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-[90] transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 lg:ml-64 p-6 md:p-10 bg-slate-50 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
