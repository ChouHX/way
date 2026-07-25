import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) { if (!locales.includes(params.locale as Locale)) notFound(); return <SiteShell locale={params.locale as Locale}>{children}</SiteShell>; }
