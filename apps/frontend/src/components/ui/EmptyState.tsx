"use client";

import React from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: string;
  href?: string;
}

export function EmptyState({ icon: Icon, title, description, cta = "Quay lại trang chủ", href = "/" }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-dashed border-slate-200 py-32 px-8 flex flex-col items-center justify-center text-center shadow-sm"
    >
      <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-8 border border-slate-50 shadow-inner">
        <Icon className="w-10 h-10 opacity-30" />
      </div>
      
      <div className="max-w-md space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
      
      <Link
        href={href}
        className="mt-12 bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-[0.98] transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30"
      >
        {cta}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
