"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
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
        alt="Yongsheng logo"
        className="h-9 w-11 object-contain"
      />
      <span className="min-w-0 leading-none">
        <b className="block truncate text-[15px] tracking-[-.03em] text-[#721126]">
          {t.shortName}
        </b>
        <span className="mt-1 block text-[8px] font-semibold tracking-[.08em] text-slate-500">
          YONGSHENG CONSULTING
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
  const currentIndex = Math.max(
    0,
    paths.findIndex((path) =>
      path
        ? pathname.startsWith(`/${locale}${path}`)
        : pathname === `/${locale}`,
    ),
  );
  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(15,39,71,.08)] md:bg-white/85 md:backdrop-blur-xl">
        <div className="relative mx-auto flex h-[70px] max-w-6xl items-center justify-between px-5">
          <Brand locale={locale} />
          <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-xs font-semibold tracking-[.06em] text-slate-500 md:block lg:hidden">
            {t.nav[currentIndex]}
          </span>
          <nav className="hidden h-full items-center gap-8 lg:flex">
            {t.nav.map((item, i) => (
              <Link
                key={item}
                href={`/${locale}${paths[i]}`}
                aria-current={i === currentIndex ? "page" : undefined}
                className={`nav-link relative py-2 text-sm font-semibold tracking-[-.01em] transition-colors ${i === currentIndex ? "nav-link-active text-[#0f2747]" : "text-slate-600 hover:text-[#0f2747]"}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 md:gap-5">
            <div className="md:hidden">
              <LanguageMenu locale={locale} compact />
            </div>
            <div className="hidden md:block">
              <LanguageMenu locale={locale} />
            </div>
            <a
              href="tel:8881234567"
              className="hidden items-center gap-2 border-l border-slate-200 pl-5 text-xs font-bold text-[#1667c9] md:flex"
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
    [
      Mail,
      "info@yongshengconsulting.com",
      "mailto:info@yongshengconsulting.com",
    ],
    [MapPin, "123 Main Street, New York, NY 10001", ""],
    [Clock3, locale === "zh" ? "周一至周六 9AM–6PM" : "Mon–Sat, 9AM–6PM", ""],
  ];
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-6xl gap-9 px-5 py-12 md:grid-cols-[1.15fr_.65fr_.9fr_1.15fr]">
        <div>
          <Brand locale={locale} />
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
            {t.footer}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0f2747]">
            {locale === "zh" ? "快速导航" : "Navigate"}
          </h3>
          <div className="mt-4 grid gap-2.5 text-sm">
            {t.nav.slice(1).map((x, i) => (
              <Link
                key={x}
                href={`/${locale}${paths[i + 1]}`}
                className="text-slate-500 hover:text-blue-600"
              >
                {x}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0f2747]">
            {locale === "zh" ? "联系我们" : "Contact"}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-500">
            {contact.map(([Icon, text, href]) => (
              <span className="flex items-center gap-2.5" key={text as string}>
                <Icon size={15} className="shrink-0 text-blue-600" />
                {href ? (
                  <a href={href as string} className="hover:text-blue-600">
                    {text as string}
                  </a>
                ) : (
                  <span>{text as string}</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0f2747]">
            {locale === "zh" ? "办公地址" : "Find us"}
          </h3>
          <div className="mt-4 overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title="Yongsheng Consulting location"
              src="https://www.google.com/maps?q=123%20Main%20Street%2C%20New%20York%2C%20NY%2010001&z=14&output=embed"
              className="h-36 w-full border-0 grayscale-[.25]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <span>© 2026 Yongsheng Consulting Center</span>
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
