"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Package,
  AlertTriangle,
  MoveUp,
  MoveDown
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:3001/products", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;

    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Đã xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        toast.error("Không thể xóa sản phẩm.");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Sản Phẩm</h1>
          <p className="text-muted-foreground mt-2 font-medium">Danh sách toàn bộ {products.length} sản phẩm trong kho.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-xl shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-6 py-5">Giá</th>
                <th className="px-6 py-5">Tồn kho</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Không tìm thấy sản phẩm nào.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border bg-slate-100 flex-shrink-0">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{product.name}</p>
                          <p className="text-xs text-slate-400 truncate font-medium">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm">{product.price.toLocaleString("vi-VN")} ₫</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.stock > 10 
                            ? "bg-emerald-50 text-emerald-600" 
                            : product.stock > 0 
                              ? "bg-amber-50 text-amber-600" 
                              : "bg-rose-50 text-rose-600"
                        }`}>
                          {product.stock > 0 ? `${product.stock} trong kho` : "Hết hàng"}
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg border shadow-sm text-slate-600 transition-all hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 hover:bg-white rounded-lg border shadow-sm text-slate-600 transition-all hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
