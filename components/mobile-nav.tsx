"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";

const paths = ["", "/services", "/cases", "/about", "/contact"];

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const t = getDictionary(locale);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, []);
  return <><button type="button" className="pressable -mr-2 grid h-11 w-11 place-items-center text-[#0f2747] lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? <X size={22}/> : <Menu size={22}/>}</button><AnimatePresence initial={false}>{open && <><motion.button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-x-0 bottom-0 top-[70px] z-0 bg-slate-950/20 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.18 }}/><motion.nav id="mobile-navigation" className="fixed inset-x-0 top-[70px] z-10 overflow-hidden border-t border-slate-200 bg-white shadow-xl lg:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={reduceMotion ? { duration: 0.01 } : { height: { type: "spring", bounce: 0, duration: 0.32 }, opacity: { duration: 0.16 } }}><div className="mx-auto grid max-w-6xl px-5 py-3">{t.nav.map((item, index) => { const href = `/${locale}${paths[index]}`; const active = pathname === href; return <Link key={item} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center justify-between border-b border-slate-100 text-sm font-semibold last:border-b-0 ${active ? "text-blue-600" : "text-slate-700"}`}><span>{item}</span>{active && <span className="h-1.5 w-1.5 bg-blue-600"/>}</Link>; })}</div></motion.nav></>}</AnimatePresence></>;
}
