"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { StripePaymentForm } from "@/components/cart/StripePaymentForm";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [clientSecret, setClientSecret] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && items.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [hasMounted, items, orderSuccess, router]);

  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (paymentMethod === "STRIPE" && !clientSecret && totalPrice > 0) {
      fetchClientSecret();
    }
  }, [paymentMethod, totalPrice]);

  const fetchClientSecret = async () => {
    if (!totalPrice || totalPrice <= 0) return;
    
    try {
      const response = await fetch("http://127.0.0.1:3001/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!response.ok) {
        throw new Error("Không thể khởi tạo thanh toán.");
      }

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error("Không tìm thấy clientSecret trong phản hồi.");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy mã thanh toán:", error);
      const message = error.message === "Failed to fetch" 
        ? "Không thể kết nối đến máy chủ thanh toán (Backend có thể chưa chạy)." 
        : `Lỗi máy chủ: ${error.message}`;
      toast.error(message);
    }
  };

  if (!hasMounted) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  const createOrder = async () => {
    const response = await fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        totalAmount: totalPrice,
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });
    return response;
  };

  const handleCODSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createOrder();
      if (response.ok) {
        clearCart();
        toast.success("Đặt hàng thành công!");
        router.push("/checkout/success");
      } else {
        toast.error("Đã xảy ra lỗi khi đặt hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async () => {
    setLoading(true);
    try {
      const response = await createOrder();
      if (response.ok) {
        clearCart();
        toast.success("Thanh toán và đặt hàng thành công!");
        router.push("/checkout/success");
      } else {
        toast.error("Đã thanh toán nhưng lỗi khi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng sau Stripe:", error);
      toast.error("Lỗi hệ thống sau khi thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Thanh Toán</h1>
          <p className="text-muted-foreground mt-2">Hoàn tất thông tin để nhận hàng ngay.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleCODSubmit} id="checkout-form" className="space-y-6">
              <div className="bg-card rounded-2xl border p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Truck className="w-6 h-6 text-primary" />
                  Thông Tin Giao Hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Tên Người Nhận</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Địa Chỉ Email</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Địa Chỉ Nhận Hàng (Chi Tiết)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Phương Thức Thanh Toán
                </h2>
                
                <div className="space-y-4">
                  <div 
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === "COD" ? "border-primary bg-primary/5 shadow-sm" : "border-muted hover:border-primary/50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${paymentMethod === "COD" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        COD
                      </div>
                      <div>
                        <p className="font-bold">Thanh toán khi nhận hàng</p>
                        <p className="text-xs text-muted-foreground">Phí thanh toán: 0 ₫</p>
                      </div>
                    </div>
                    {paymentMethod === "COD" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                  </div>

                  <div 
                    onClick={() => setPaymentMethod("STRIPE")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${paymentMethod === "STRIPE" ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50 hover:bg-muted/30"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "STRIPE" ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Thanh Toán Thẻ</p>
                        <p className="text-sm text-muted-foreground font-medium">Visa, Mastercard, JCB, Apple Pay...</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "STRIPE" ? "border-primary bg-primary" : "border-muted"}`}>
                      {paymentMethod === "STRIPE" && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  {paymentMethod === "STRIPE" && (
                    <div className="pt-6 border-t border-dashed animate-in fade-in zoom-in-95 duration-500">
                      {clientSecret ? (
                        <div className="space-y-4">
                          <Elements stripe={stripePromise} options={{ 
                            clientSecret, 
                            appearance: { 
                              theme: 'stripe',
                              variables: {
                                colorPrimary: '#0f172a',
                                borderRadius: '12px',
                                fontFamily: 'inherit'
                              }
                            } 
                          }}>
                            <StripePaymentForm 
                              onSuccess={handleStripeSuccess}
                              onError={(msg) => toast.error(msg)}
                              orderId="TEMP_ORDER_ID"
                            />
                          </Elements>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 bg-muted/5 rounded-2xl border border-dashed">
                          <div className="relative">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <CreditCard className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground animate-pulse">Đang thiết lập cổng thanh toán bảo mật...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/40 p-4 rounded-xl border">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Thông tin của bạn được bảo mật tuyệt đối theo tiêu chuẩn quốc tế.
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-card rounded-2xl border shadow-sm p-8 space-y-6">
              <h2 className="text-2xl font-bold">Sản Phẩm Đơn Hàng</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center animate-fade-in">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng cộng SL</span>
                  <span className="font-semibold">{items.reduce((acc, curr) => acc + curr.quantity, 0)} sản phẩm</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary">{totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              {paymentMethod === "COD" && (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-xl flex items-center justify-center font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Đặt Hàng Ngay"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
