"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Summer Collection 2026",
    subtitle: "Nâng Tầm Phong Cách",
    description: "Khám phá những xu hướng thời trang mới nhất với ưu đãi lên đến 50%.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
    color: "bg-slate-900",
    tag: "New Arrival"
  },
  {
    id: 2,
    title: "Tech Innovation Event",
    subtitle: "Tương Lai Trong Tầm Tay",
    description: "Sở hữu những siêu phẩm công nghệ hàng đầu với chính sách trả góp 0%.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
    color: "bg-blue-900",
    tag: "Hot Tech"
  },
  {
    id: 3,
    title: "Big Sale Fest 2026",
    subtitle: "Bùng Nổ Ưu Đãi",
    description: "Hàng ngàn sản phẩm chính hãng giảm giá sốc chỉ trong tuần này.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
    color: "bg-rose-900",
    tag: "Flash Deal"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative h-[380px] md:h-[600px] w-full overflow-hidden group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className={`absolute inset-0 ${slides[current].color} opacity-40 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 h-full flex items-center relative z-10">
            <div className="max-w-2xl space-y-6 md:space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full text-primary border border-primary/20 shadow-lg"
              >
                <Zap size={14} className="fill-current" />
                <span className="text-xs font-black uppercase tracking-widest">{slides[current].tag}</span>
              </motion.div>

              <div className="space-y-2 md:space-y-4">
                <motion.h4
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl font-bold text-primary tracking-tight"
                >
                  {slides[current].subtitle}
                </motion.h4>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter"
                >
                  {slides[current].title}
                </motion.h2>
              </div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-base md:text-lg max-w-lg font-medium leading-relaxed"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 pt-4"
              >
                <button className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                  Mua Ngay
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-black py-4 px-10 rounded-2xl transition-all backdrop-blur-md border border-white/10">
                  Khám Phá Thêm
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
