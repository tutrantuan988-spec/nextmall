"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    { name: "Thông tin cá nhân", href: "/profile", icon: User },
    { name: "Lịch sử đơn hàng", href: "/profile/orders", icon: ShoppingBag },
    { name: "Sổ địa chỉ", href: "/profile/addresses", icon: MapPin },
    { name: "Phương thức thanh toán", href: "/profile/payments", icon: CreditCard },
    { name: "Cài đặt", href: "/profile/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[32px] border shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24">
              {/* User Header */}
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border border-white/10">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Thành viên</p>
                    <p className="text-lg font-bold truncate tracking-tight">{user.email.split('@')[0]}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4 py-6 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between group px-4 py-4 rounded-2xl transition-all ${
                        isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
                        <span className="text-sm font-bold">{item.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-white/50" : "text-slate-300"}`} />
                    </Link>
                  );
                })}

                <div className="pt-6 mt-6 border-t">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất tài khoản
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
