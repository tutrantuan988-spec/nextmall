"use client";

import React from "react";
import { User, Mail, Shield, Calendar, Edit2, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Thông tin cá nhân</h1>
          <p className="text-slate-400 font-bold mt-1">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
        </div>
        <button className="bg-white border text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="bg-white rounded-[32px] border p-8 space-y-8 shadow-sm">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Thông tin cơ bản</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email liên hệ</p>
                  <p className="font-bold text-slate-700">{user.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Đã xác minh</span>
            </div>

            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-slate-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vai trò</p>
                <p className="font-bold text-slate-700">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t pt-6">
              <Calendar className="w-5 h-5 text-slate-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày tham gia</p>
                <p className="font-bold text-slate-700">04 tháng 04, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-white rounded-[32px] border p-8 space-y-8 shadow-sm">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
              <Key className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Bảo mật</h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed text-center">
              <p className="text-sm font-bold text-slate-600 mb-4">Bạn chưa thiết lập mật khẩu cấp 2</p>
              <button className="bg-slate-900 text-white text-xs font-black px-6 py-3 rounded-xl hover:scale-105 transition-all">
                Kích hoạt ngay
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-amber-700">Xác thực 2 yếu tố chưa bật</p>
              </div>
              <button className="text-xs font-black text-amber-700 underline underline-offset-4">Bật</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
