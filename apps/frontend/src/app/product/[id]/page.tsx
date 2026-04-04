"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star as StarIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  MessageSquare,
  Send
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { StarRating } from "@/components/ui/StarRating";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  averageRating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    email: string;
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const fetchData = async () => {
    try {
      // Fetch Product
      const productRes = await fetch(`http://localhost:3001/products/${id}`);
      if (!productRes.ok) throw new Error("Product not found");
      const productData = await productRes.json();
      setProduct(productData);

      // Fetch Reviews
      const reviewsRes = await fetch(`http://localhost:3001/reviews/${id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tìm thấy sản phẩm");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
        });
      }
      toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: formRating,
          comment: formComment
        })
      });

      if (!res.ok) throw new Error("Could not submit review");
      
      toast.success("Cảm ơn bạn đã đánh giá!");
      setFormComment("");
      setFormRating(5);
      
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-[32px] p-8 md:p-12 shadow-sm border">
            <div className="lg:col-span-7">
              <div className="aspect-square bg-slate-100 animate-pulse rounded-3xl" />
            </div>
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-slate-100 animate-pulse rounded-xl" />
                <div className="h-6 w-1/2 bg-slate-50 animate-pulse rounded-lg" />
                <div className="h-10 w-1/3 bg-slate-100 animate-pulse rounded-xl pt-4" />
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-32 w-full bg-slate-50 animate-pulse rounded-2xl" />
                <div className="h-14 w-full bg-slate-100 animate-pulse rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại cửa hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-[32px] overflow-hidden border shadow-2xl shadow-slate-200/50 p-8 md:p-12 mb-12">
          {/* Left: Product Image */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square relative rounded-3xl overflow-hidden bg-slate-100 border">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-slate-900 border uppercase tracking-widest shadow-sm">
                  {product.category}
                </span>
                {isOutOfStock && (
                  <span className="bg-rose-500 px-4 py-2 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-rose-500/20">
                    Hết hàng
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col h-full space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <StarRating rating={Math.round(product.averageRating || 0)} />
                <span className="text-sm font-bold text-slate-400 border-l pl-4">
                  {product.reviewCount || 0} đánh giá
                </span>
              </div>
              <p className="text-4xl font-black text-primary tracking-tighter">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-slate-500 leading-relaxed font-medium">
                {product.description || "Không có mô tả cho sản phẩm này."}
              </p>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                {isOutOfStock ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                <span className={`text-sm font-bold ${isOutOfStock ? "text-rose-600" : "text-emerald-700"}`}>
                  {isOutOfStock ? "Sản phẩm tạm thời hết hàng" : `Còn ${product.stock} sản phẩm trong kho`}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-6 pt-6 border-t">
              {!isOutOfStock && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-white rounded-xl transition-all active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-white rounded-xl transition-all active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-400">Mua tối đa: {product.stock}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Thêm Vào Giỏ Hàng
                </button>
                <button className="w-full border-2 border-slate-200 py-5 rounded-2xl font-black text-lg hover:border-primary hover:text-primary transition-all active:scale-[0.98]">
                  Mua Ngay
                </button>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-dashed">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Miễn phí ship</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">7 Ngày đổi trả</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Bảo hành 12th</span>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Review Stats & Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[32px] border p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                Đánh giá khách hàng
              </h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="text-5xl font-black text-slate-900 tracking-tighter">
                  {(product.averageRating || 0).toFixed(1)}
                </div>
                <div>
                  <StarRating rating={Math.round(product.averageRating || 0)} size={24} />
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    dựa trên {product.reviewCount || 0} lượt đánh giá
                  </p>
                </div>
              </div>

              {/* Leave a Review Form */}
              <div className="pt-8 border-t">
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <p className="text-sm font-black text-slate-800">Để lại đánh giá của bạn</p>
                    <StarRating 
                      rating={formRating} 
                      interactive 
                      onRatingChange={setFormRating} 
                      size={28}
                    />
                    <textarea 
                      required
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] resize-none"
                    />
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Gửi đánh giá
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-dashed text-center">
                    <p className="text-sm font-bold text-slate-500 mb-4">Vui lòng đăng nhập để đánh giá sản phẩm</p>
                    <button 
                      onClick={() => router.push("/login")}
                      className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] border p-8 shadow-sm h-full overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 mb-8 border-b pb-4">Tất cả nhận xét</h3>
              
              <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-300">
                    <MessageSquare className="w-16 h-16 opacity-20" />
                    <p className="font-bold">Chưa có nhận xét nào cho sản phẩm này.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs">
                            {review.user?.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{review.user?.email.split('@')[0]}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium pl-[52px]">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
