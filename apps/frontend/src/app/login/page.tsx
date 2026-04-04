"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
        // If admin, go to admin, else go home
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-lg bg-white p-10 rounded-[32px] border shadow-2xl shadow-slate-200/50 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-primary/5">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Chào Mừng Trở Lại</h1>
          <p className="text-slate-500 font-medium">Đăng nhập để quản lý đơn hàng và trải nghiệm mua sắm của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email của bạn</label>
            <div className="relative group">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                placeholder="example@email.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu</label>
            <div className="relative group">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded-md border text-primary focus:ring-primary" id="remember" />
              <label htmlFor="remember" className="font-semibold text-slate-500 cursor-pointer">Ghi nhớ đăng nhập</label>
            </div>
            <Link href="#" className="font-bold text-primary hover:underline">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Đăng Nhập Ngay
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-slate-100">
          <p className="text-slate-500 font-medium">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline transition-all">
              Tạo tài khoản mới
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
