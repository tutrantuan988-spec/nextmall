"use client";

import { useEffect, useState, Suspense } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductSkeleton, ProductSkeletonGrid } from "@/components/ui/ProductSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  Loader2, 
  LayoutGrid, 
  Smartphone, 
  Laptop, 
  Watch, 
  Shirt, 
  Home as HomeIcon, 
  Gamepad, 
  Camera, 
  Headphones, 
  SearchX 
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryQuickAccess } from "@/components/home/CategoryQuickAccess";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";

const categories = [
  { name: "All", icon: LayoutGrid },
  { name: "Phones", icon: Smartphone },
  { name: "Computers", icon: Laptop },
  { name: "Watches", icon: Watch },
  { name: "Fashion", icon: Shirt },
  { name: "Home Appliances", icon: HomeIcon },
  { name: "Gaming", icon: Gamepad },
  { name: "Cameras", icon: Camera },
  { name: "Audio", icon: Headphones },
];

function HomeContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
   const currentCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const currentBrand = searchParams.get("brand") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:3001/products?`;
        if (currentCategory !== "All") url += `category=${encodeURIComponent(currentCategory)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (currentBrand) url += `brand=${encodeURIComponent(currentBrand)}`;

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, searchQuery, currentBrand]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Sections (Only on main landing without search/category) */}
      {!searchQuery && currentCategory === "All" && !currentBrand && (
        <div className="space-y-0">
          <HeroCarousel />
          <CategoryQuickAccess />
          <FlashSaleSection />
        </div>
      )}

      {/* Main Content Area */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 px-2">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                        currentCategory === cat.name 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-slate-500 hover:bg-white hover:text-primary hover:shadow-md"
                      }`}
                    >
                      <cat.icon className={`w-5 h-5 ${currentCategory === cat.name ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[24px] text-white overflow-hidden relative group cursor-pointer">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Quảng cáo</p>
                  <h4 className="font-black text-lg leading-tight mb-4 text-white">Giảm giá 30% cho Laptops!</h4>
                  <button className="text-xs font-black px-4 py-2 bg-white text-slate-900 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    Xem ngay
                  </button>
                </div>
                <Laptop className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">
                  {searchQuery ? `Kết quả cho "${searchQuery}"` : 
                   currentBrand ? `Gian hàng ${currentBrand}` :
                   currentCategory === "All" ? "Gợi Ý Cho Bạn" : currentCategory}
                </h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
              </div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {loading ? "Đang tìm kiếm..." : `Tìm thấy ${products.length} sản phẩm`}
              </p>
            </div>

            {loading ? (
              <ProductSkeletonGrid count={searchParams.get("search") ? 4 : 8} />
            ) : products.length === 0 ? (
              <EmptyState 
                icon={SearchX}
                title="Không tìm thấy sản phẩm"
                description={searchQuery ? `Chúng tôi không tìm thấy kết quả nào cho "${searchQuery}". Hãy thử từ khóa khác!` : "Không có sản phẩm nào trong danh mục này."}
                cta="Quay lại tất cả sản phẩm"
                href="/"
              />
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.imageUrl}
                  category={product.category}
                  rating={product.rating}
                  sold={product.sold}
                />
              ))}
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
