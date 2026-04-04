import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">NexMall</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Nền tảng mua sắm trực tuyến hàng đầu, mang đến cho bạn trải nghiệm tuyệt vời với hàng triệu sản phẩm đa dạng và chất lượng.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-cta transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-cta transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-cta transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-cta transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Danh Mục</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Thời trang nam/nữ</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Điện thoại & Phụ kiện</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Thiết bị điện tử</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Máy tính & Laptop</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Sức khỏe & Sắc đẹp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Về Chúng Tôi</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Giới thiệu NexMall</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Tuyển dụng</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Chính sách thanh toán</Link></li>
              <li><Link href="#" className="hover:text-cta hover:translate-x-1 inline-block transition-all">Flash Sales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Thanh Toán</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-md h-10 w-full flex items-center justify-center text-xs font-bold">VISA</div>
              <div className="bg-white/10 rounded-md h-10 w-full flex items-center justify-center text-xs font-bold">MasterCard</div>
              <div className="bg-white/10 rounded-md h-10 w-full flex items-center justify-center text-xs font-bold">JCB</div>
              <div className="bg-white/10 rounded-md h-10 w-full flex items-center justify-center text-xs font-bold">COD</div>
            </div>
            <h4 className="font-semibold text-lg mt-6 mb-4">Tải Ứng Dụng</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-white/10 rounded-md p-2 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-white/20 transition-colors">App Store</div>
              <div className="bg-white/10 rounded-md p-2 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-white/20 transition-colors">Google Play</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} NexMall. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Khu vực: Việt Nam</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
