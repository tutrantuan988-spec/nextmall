"use client";

import { Search, ShoppingCart, Menu, User, ShoppingBag, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchDropdown } from "./SearchDropdown";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const router = useRouter();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced search for "Search-as-you-type"
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoadingSuggestions(true);
        setIsDropdownVisible(true);
        try {
          const response = await fetch(`http://localhost:3001/search/suggest?q=${searchQuery}`);
          if (!response.ok) throw new Error("Search failed");
          const data = await response.json();
          setSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Lỗi khi tìm gợi ý:", error);
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setIsDropdownVisible(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownVisible(false);
    }
  };

  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories for mobile menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/products/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const cartCount = mounted ? getTotalItems() : 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black italic text-primary tracking-tight">Nex<span className="text-primary/80">Mall</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Link href="/categories" className="hover:text-primary transition-all">Theo Danh Mục</Link>
              <Link href="/promotions" className="hover:text-primary transition-all">Khuyến Mãi</Link>
              <Link href="/stores" className="hover:text-primary transition-all">Gian Hàng</Link>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-6 relative">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownVisible(true)}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2.5 pl-11 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                suppressHydrationWarning
              />
              <button 
                type="submit" 
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-primary transition-colors"
                suppressHydrationWarning
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            
            <AnimatePresence>
              {isDropdownVisible && (
                <SearchDropdown 
                  suggestions={suggestions} 
                  isLoading={isLoadingSuggestions}
                  onSelect={(product: any) => {
                    setIsDropdownVisible(false);
                    setSearchQuery("");
                    router.push(`/product/${product.id}`);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {mounted && user ? (
              <div className="flex items-center gap-2 group relative">
                <button className="flex items-center gap-2 p-1.5 text-foreground/80 hover:text-primary transition-all rounded-full hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20">
                    {user.email[0].toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-[32px] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 origin-top-right scale-95 group-hover:scale-100">
                  <div className="px-4 py-4 border-b mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tài khoản</p>
                    <p className="text-sm font-black truncate text-slate-800 tracking-tight">{user.email}</p>
                    {user.role === "ADMIN" && (
                      <span className="inline-block mt-2 text-[8px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                        Quản trị viên
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Link href="/profile/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group/item">
                      <ShoppingBag className="w-4 h-4 text-slate-400 group-hover/item:text-primary transition-colors" />
                      Đơn hàng của tôi
                    </Link>

                    {user.role === "ADMIN" && (
                      <div className="mt-2 pt-2 border-t border-dashed">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all group/item">
                          <Settings className="w-4 h-4" />
                          Trang Quản Trị
                        </Link>
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group/item"
                      >
                        <User className="w-4 h-4 rotate-180 text-rose-400 group-hover/item:text-rose-600 transition-colors" />
                        Đăng Xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/login" className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:opacity-90 shadow-xl transition-all active:scale-95">
                  Đăng ký
                </Link>
              </div>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-600 hover:text-primary transition-all bg-slate-50 rounded-xl hover:bg-primary/5"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-lg bg-cta text-[10px] font-black text-white shadow-lg shadow-cta/20 border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            <button 
              className="md:hidden p-2.5 text-slate-600 hover:text-primary bg-slate-50 rounded-xl" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-white z-[70] shadow-2xl p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-2xl font-black italic text-primary tracking-tight">Nex<span className="text-primary/80">Mall</span></span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border rounded-xl">
                  <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-10">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="Tìm sản phẩm..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border bg-slate-50 px-4 py-3 pl-11 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </form>
              </div>

              <div className="space-y-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-4">Khám Phá</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-4 text-sm font-black text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">Theo Danh Mục</Link>
                    <Link href="/promotions" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-4 text-sm font-black text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">Khuyến Mãi</Link>
                    <Link href="/stores" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-4 text-sm font-black text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">Gian Hàng</Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-4">Gian Hàng</p>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.name}
                        href={`/?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-4 text-sm font-bold text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl flex items-center justify-between border border-transparent hover:border-primary/10 transition-all capitalize"
                      >
                        {cat.name}
                        <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2.5 py-1 rounded-lg">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {!user && (
                  <div className="pt-10 flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-4 text-sm font-black text-slate-500 border rounded-2xl">Đăng Nhập</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-4 text-sm font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">Đăng Ký</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
