"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localizeService, serviceItems } from "@/lib/services";
import { publicCaseCategories } from "@/lib/case-categories";

const paths = ["", "/services", "/cases", "/about", "/contact"];

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const t = getDictionary(locale);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setCasesOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        className="pressable -mr-2 grid h-11 w-11 place-items-center text-white lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[72px] z-0 bg-slate-950/35 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
            />
            <motion.nav
              id="mobile-navigation"
              className="fixed inset-x-0 top-[72px] z-10 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10 bg-white shadow-xl lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : {
                      height: { type: "spring", bounce: 0, duration: 0.32 },
                      opacity: { duration: 0.16 },
                    }
              }
            >
              <div className="mx-auto grid max-w-6xl px-5 py-3">
                {t.nav.map((item, index) => {
                  const href = `/${locale}${paths[index]}`;
                  const active =
                    index === 1 || index === 2
                      ? pathname.startsWith(href)
                      : pathname === href;

                  if (index === 1) {
                    return (
                      <div key={item} className="border-b border-slate-200">
                        <button
                          type="button"
                          aria-expanded={servicesOpen}
                          onClick={() => setServicesOpen((value) => !value)}
                          className={`flex min-h-12 w-full items-center justify-between text-sm font-semibold ${active ? "text-[#8a7d51]" : "text-slate-700"}`}
                        >
                          <span>{item}</span>
                          <ChevronDown
                            size={17}
                            className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {servicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mb-3 border-l-2 border-[#8a7d51] bg-[#f4f1e8] px-4 py-2">
                                <Link
                                  href={`/${locale}/services`}
                                  className="block py-2 text-xs font-bold text-[#1a243f]"
                                >
                                  {locale === "zh" ? "全部服务项目" : "All services"}
                                </Link>
                                {serviceItems.map((service) => (
                                  <Link
                                    key={service.slug}
                                    href={`/${locale}/services/${service.slug}`}
                                    className="block py-2 text-xs font-semibold text-slate-600"
                                  >
                                    {localizeService(service, locale).shortTitle}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (index === 2) {
                    return (
                      <div key={item} className="border-b border-slate-200">
                        <button
                          type="button"
                          aria-expanded={casesOpen}
                          onClick={() => setCasesOpen((value) => !value)}
                          className={`flex min-h-12 w-full items-center justify-between text-sm font-semibold ${active ? "text-[#8a7d51]" : "text-slate-700"}`}
                        >
                          <span>{item}</span>
                          <ChevronDown
                            size={17}
                            className={`transition-transform ${casesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {casesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mb-3 border-l-2 border-[#8a7d51] bg-[#f4f1e8] px-4 py-2">
                                {publicCaseCategories.map((category) => (
                                  <Link
                                    key={category.id}
                                    href={`/${locale}/cases/${category.slug}`}
                                    className="block py-2 text-xs font-semibold text-slate-600"
                                  >
                                    {locale === "zh" ? category.nameZh : category.nameEn}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center justify-between border-b border-slate-200 text-sm font-semibold last:border-b-0 ${active ? "text-[#8a7d51]" : "text-slate-700"}`}
                    >
                      <span>{item}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8a7d51]" />
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-slate-200 py-4 md:hidden">
                  <a
                    href="tel:8881234567"
                    className="pressable flex min-h-12 items-center justify-between bg-[#1a243f] px-4 text-sm font-bold text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone size={17} className="text-[#c5b780]" />
                      {locale === "zh" ? "电话咨询" : "Call us"}
                    </span>
                    <span className="text-[#c5b780]">(888) 123-4567</span>
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
