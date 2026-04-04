"use client";

import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";

interface StripePaymentFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  orderId: string;
}

export function StripePaymentForm({ onSuccess, onError, orderId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      const msg = error.message || "Đã xảy ra lỗi khi thanh toán.";
      onError(msg);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-primary/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            Cổng thanh toán bảo mật
          </h3>
          <div className="flex gap-1">
            <div className="w-8 h-5 bg-muted/50 rounded-sm" />
            <div className="w-8 h-5 bg-muted/50 rounded-sm" />
            <div className="w-8 h-5 bg-muted/50 rounded-sm" />
          </div>
        </div>
        
        <PaymentElement options={{ 
          layout: "tabs",
          business: { name: "Shoppee" }
        }} />
      </div>
      
      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing || !stripe}
        className="w-full bg-primary text-primary-foreground py-5 rounded-2xl flex items-center justify-center font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            Đang Xử Lý Thanh Toán...
          </>
        ) : (
          "Xác Nhận & Thanh Toán"
        )}
      </button>
      
      <p className="text-center text-xs text-muted-foreground">
        Thanh toán được bảo mật bởi <span className="font-semibold">Stripe</span>. 
        Thông tin thẻ của bạn không được lưu trên hệ thống của chúng tôi.
      </p>
    </div>
  );
}
