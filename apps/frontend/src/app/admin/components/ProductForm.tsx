"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `http://localhost:3001/products/${initialData.id}`
        : "http://localhost:3001/products";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(initialData ? "Cập nhật sản phẩm thành công!" : "Đã tạo sản phẩm thành công!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Đã xảy ra lỗi khi lưu sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {initialData ? "Cập nhật thông tin chi tiết cho sản phẩm của bạn." : "Nhập thông tin chi tiết cho sản phẩm mới."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Tên Sản Phẩm</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Ví dụ: Giày Sneaker Cao Cấp"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Giá Sản Phẩm (VNĐ)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Ví dụ: 990000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">URL Hình Ảnh</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Mô Tả Sản Phẩm</label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            placeholder="Nhập mô tả chi tiết sản phẩm tại đây..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {initialData ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}
        </button>
      </form>
    </div>
  );
}
