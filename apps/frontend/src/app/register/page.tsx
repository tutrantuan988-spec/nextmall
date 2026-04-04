"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        router.push("/login");
      } else {
        toast.error(data.message || "Đăng ký thất bại");
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
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Tạo Tài Khoản</h1>
          <p className="text-slate-500 font-medium">Khám phá trải nghiệm mua sắm đẳng cấp ngay hôm nay.</p>
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Xác nhận mật khẩu</label>
            <div className="relative group">
              <ShieldCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
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
                Đăng Ký Ngay
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-slate-100">
          <p className="text-slate-500 font-medium">
            Bạn đã có tài khoản?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline transition-all">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
