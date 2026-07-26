"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { localizeService, serviceItems } from "@/lib/services";
import { MobileNav } from "./mobile-nav";
import { LanguageMenu } from "./language-menu";
import { PageTransition } from "./page-transition";

const paths = ["", "/services", "/cases", "/about", "/contact"];

export function Brand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5">
      <img
        src="/logo-transparent.png"
        alt="YONG SHENG CONSULTNG logo"
        className="h-10 w-12 object-contain"
      />
      <span className="min-w-0 leading-none">
        <b className="block truncate text-[15px] tracking-[-.025em] text-white">
          {t.shortName}
        </b>
        <span className="mt-1.5 block text-[8px] font-semibold tracking-[.11em] text-[#c5b780]">
          {locale === "zh" ? "YONG SHENG CONSULTNG" : "TRAFFIC · IMMIGRATION SERVICES"}
        </span>
      </span>
    </Link>
  );
}

export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const currentIndex = Math.max(
    0,
    paths.findIndex((path) =>
      path
        ? pathname.startsWith(`/${locale}${path}`)
        : pathname === `/${locale}`,
    ),
  );

  useEffect(() => setServicesOpen(false), [pathname]);
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1a243f] shadow-[0_1px_0_rgba(255,255,255,.1)]">
        <div className="relative mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <Brand locale={locale} />
          <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-xs font-semibold tracking-[.06em] text-white/70 md:block lg:hidden">
            {t.nav[currentIndex]}
          </span>
          <nav className="hidden h-full items-center gap-7 lg:flex">
            {t.nav.map((item, index) => {
              const active = index === currentIndex;
              if (index === 1) {
                return (
                  <div
                    key={item}
                    ref={servicesRef}
                    className="relative flex h-full items-center"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-haspopup="menu"
                      onClick={() => setServicesOpen((open) => !open)}
                      className={`nav-link relative inline-flex items-center gap-1.5 py-2 text-sm font-semibold tracking-[-.01em] transition-colors ${
                        active
                          ? "nav-link-active text-white"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {item}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      role="menu"
                      className={`absolute left-1/2 top-full w-[25rem] -translate-x-1/2 border-t-2 border-[#8a7d51] bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,.2)] transition duration-150 ${
                        servicesOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <Link
                        href={`/${locale}/services`}
                        role="menuitem"
                        className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-bold text-[#1a243f] hover:bg-[#f4f1e8]"
                      >
                        {locale === "zh" ? "全部服务项目" : "All services"}
                        <span className="text-[#8a7d51]">→</span>
                      </Link>
                      <div className="grid grid-cols-2 gap-px pt-1">
                        {serviceItems.map((service) => {
                          const copy = localizeService(service, locale);
                          const Icon = service.icon;
                          return (
                            <Link
                              key={service.slug}
                              href={`/${locale}/services/${service.slug}`}
                              role="menuitem"
                              className="flex min-h-14 items-center gap-3 px-3 py-2 text-sm font-semibold leading-5 text-slate-700 hover:bg-[#f4f1e8] hover:text-[#1a243f]"
                            >
                              <Icon size={17} className="shrink-0 text-[#8a7d51]" />
                              {copy.shortTitle}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item}
                  href={`/${locale}${paths[index]}`}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link relative py-2 text-sm font-semibold tracking-[-.01em] transition-colors ${
                    active
                      ? "nav-link-active text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1 md:gap-5">
            <div className="md:hidden">
              <LanguageMenu locale={locale} compact tone="dark" />
            </div>
            <div className="hidden md:block">
              <LanguageMenu locale={locale} tone="dark" />
            </div>
            <a
              href="tel:8881234567"
              className="hidden items-center gap-2 border-l border-white/15 pl-5 text-xs font-bold text-[#c5b780] md:flex"
            >
              <Phone size={15} />
              (888) 123-4567
            </a>
            <MobileNav locale={locale} />
          </div>
        </div>
      </header>
      <PageTransition>{children}</PageTransition>
      <Footer locale={locale} />
    </>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const contact = [
    [Phone, "(888) 123-4567", "tel:8881234567"],
    [Mail, "info@yongshengconsulting.com", "mailto:info@yongshengconsulting.com"],
    [MapPin, "123 Main Street, New York, NY 10001", ""],
    [Clock3, locale === "zh" ? "周一至周六 9AM–6PM" : "Mon–Sat, 9AM–6PM", ""],
  ] as const;

  return (
    <footer className="bg-[#191919] text-white/65">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.15fr_.8fr_1fr_1.2fr]">
        <div>
          <Brand locale={locale} />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">{t.footer}</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
            {[2, 3, 4].map((index) => (
              <Link
                key={paths[index]}
                href={`/${locale}${paths[index]}`}
                className="hover:text-[#c5b780]"
              >
                {t.nav[index]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {locale === "zh" ? "服务项目" : "Services"}
          </h3>
          <div className="mt-4 grid gap-2.5 text-sm">
            {serviceItems.map((service) => (
              <Link
                key={service.slug}
                href={`/${locale}/services/${service.slug}`}
                className="hover:text-[#c5b780]"
              >
                {localizeService(service, locale).shortTitle}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {locale === "zh" ? "联系我们" : "Contact"}
          </h3>
          <div className="mt-4 grid gap-3 text-sm">
            {contact.map(([Icon, text, href]) => (
              <span className="flex items-start gap-2.5" key={text}>
                <Icon size={15} className="mt-0.5 shrink-0 text-[#c5b780]" />
                {href ? (
                  <a href={href} className="break-all hover:text-[#c5b780]">
                    {text}
                  </a>
                ) : (
                  <span>{text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {locale === "zh" ? "办公地址" : "Find us"}
          </h3>
          <div className="mt-4 overflow-hidden border border-white/10 bg-white/5">
            <iframe
              title="YONG SHENG CONSULTNG location"
              src="https://www.google.com/maps?q=123%20Main%20Street%2C%20New%20York%2C%20NY%2010001&z=14&output=embed"
              className="h-36 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 YONG SHENG CONSULTNG</span>
          <span>
            {locale === "zh"
              ? "免责声明：本网站信息仅供参考，不构成法律建议。"
              : "Disclaimer: Website information is for general reference only and does not constitute legal advice."}
          </span>
        </div>
      </div>
    </footer>
  );
}
