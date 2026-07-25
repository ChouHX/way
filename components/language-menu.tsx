"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageMenu({ locale, mobile = false, compact = false }: { locale: Locale; mobile?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const items = [{ code: "zh" as const, flag: "/flags/cn.svg", label: "简体中文" }, { code: "en" as const, flag: "/flags/us.svg", label: "English" }];
  const current = items.find(x => x.code === locale)!;
  useEffect(() => { const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <div ref={ref} className={`relative ${mobile ? "w-full" : ""}`}><button type="button" onClick={() => setOpen(!open)} aria-label={compact ? current.label : undefined} aria-expanded={open} className={`pressable flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 ${mobile ? "w-full justify-between py-3" : ""} ${compact ? "h-11 px-2" : ""}`}><img src={current.flag} alt="" className="h-4 w-6 rounded-[2px] border border-slate-200 object-cover"/><span className={compact ? "sr-only" : ""}>{current.label}</span><ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}/></button><div className={`absolute right-0 z-50 mt-2 min-w-40 origin-top-right border border-slate-200 bg-white p-1.5 shadow-xl transition duration-200 ${open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[.98] opacity-0"}`}>{items.map(item => { const href = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${item.code}`); return <Link key={item.code} href={href || `/${item.code}`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><img src={item.flag} alt="" className="h-4 w-6 rounded-[2px] border border-slate-200 object-cover"/><span className="flex-1">{item.label}</span>{item.code === locale && <Check size={15} className="text-blue-600"/>}</Link>; })}</div></div>;
}
