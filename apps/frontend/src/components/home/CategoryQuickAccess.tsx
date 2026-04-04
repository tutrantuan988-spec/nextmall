import Link from 'next/link';
import { Smartphone, Monitor, Watch, Shirt, Home, Gamepad2, Camera, Headphones, Percent, Store } from 'lucide-react';

const categories = [
  { name: 'Điện thoại', icon: Smartphone, href: '/?category=Phones', color: 'text-blue-500' },
  { name: 'Máy tính', icon: Monitor, href: '/?category=Computers', color: 'text-purple-500' },
  { name: 'Đồng hồ', icon: Watch, href: '/?category=Watches', color: 'text-orange-500' },
  { name: 'Thời trang', icon: Shirt, href: '/?category=Fashion', color: 'text-pink-500' },
  { name: 'Đồ gia dụng', icon: Home, href: '/?category=Home Appliances', color: 'text-green-500' },
  { name: 'Game', icon: Gamepad2, href: '/?category=Gaming', color: 'text-indigo-500' },
  { name: 'Máy ảnh', icon: Camera, href: '/?category=Cameras', color: 'text-slate-700' },
  { name: 'Âm thanh', icon: Headphones, href: '/?category=Audio', color: 'text-teal-500' },
  { name: 'Khuyến mãi', icon: Percent, href: '/?sale=true', color: 'text-red-500' },
  { name: 'Mall', icon: Store, href: '/?mall=true', color: 'text-red-600' },
];

export function CategoryQuickAccess() {
  return (
    <section className="py-8 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center gap-4 group cursor-pointer"
              >
                {/* 3D Glassmorphism Container */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] md:rounded-[32px] flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_-4px_8px_rgba(0,0,0,0.05),inset_0_4px_8px_rgba(255,255,255,1)] group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.1),inset_0_-4px_8px_rgba(0,0,0,0.05),inset_0_4px_8px_rgba(255,255,255,1)] transition-all duration-300 ease-out relative">
                  {/* Glossy top highlight */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent rounded-t-[32px] pointer-events-none"></div>
                  
                  <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${category.color} drop-shadow-md`} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Elegant Typography */}
                <span className="text-xs md:text-sm font-semibold text-slate-700 text-center tracking-tight group-hover:text-[#EE4D2D] transition-colors leading-tight">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}