"use client";

import React, { useEffect, useState } from "react";
import { 
  Ticket, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Zap,
  Loader2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("http://localhost:3001/coupons");
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã ${code}!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <Ticket className="w-10 h-10 text-primary" />
              Mã giảm giá hấp dẫn
            </h1>
            <p className="text-slate-500 font-bold max-w-xl">
              Săn ngay các voucher cực hot để tiết kiệm hơn khi mua sắm tại Shoppee. 
              Mã giảm giá có hạn, hãy nhanh tay nhé!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <div 
              key={coupon.id}
              className="bg-white rounded-[32px] border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative group"
            >
              {/* Ticket Notch effect with CSS */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-slate-50 rounded-full border shadow-inner z-20" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-slate-50 rounded-full border shadow-inner z-20" />
              
              {/* Left Section: Discount */}
              <div className="p-8 bg-primary/5 border-b border-dashed border-primary/20 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-primary/10">
                  <Ticket className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-black text-primary tracking-tighter">
                    -{coupon.discountAmount.toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">Giảm trực tiếp</p>
                </div>
              </div>

              {/* Right Section: Info & Copy */}
              <div className="p-8 space-y-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    HSD: {new Date(coupon.expiryDate).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-3 text-emerald-600 text-xs font-black uppercase tracking-widest leading-none">
                    <Zap className="w-4 h-4" />
                    Số lượng có hạn
                  </div>
                </div>

                <div 
                  onClick={() => copyToClipboard(coupon.code)}
                  className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all group/code"
                >
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Mã giảm giá</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter truncate uppercase">{coupon.code}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border group-hover/code:scale-110 transition-transform">
                    {copiedCode === coupon.code ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter justify-center bg-slate-50/50 py-2 rounded-lg">
                  <ShieldCheck className="w-3 h-3" />
                  Áp dụng cho mọi đơn hàng
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
