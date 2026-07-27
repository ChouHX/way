import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/lib/i18n";
import { getPublicServices } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!locales.includes(locale as Locale)) notFound(); const services = await getPublicServices(); return <SiteShell locale={locale as Locale} services={services}>{children}</SiteShell>; }
